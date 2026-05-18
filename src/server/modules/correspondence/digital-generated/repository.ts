import type {
  Prisma,
  CorrespondenceSourceType,
  CorrespondenceStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { AuditLogger } from "@/lib/audit/audit-logger";
import type {
  CreateDraftInput,
  CreateDraftOutput,
  CorrespondenceDraftRecord,
  GeneratePdfOutput,
} from "./types";

/**
 * Repository for DIGITAL_GENERATED correspondence data access
 * ONLY place where Prisma is used for this feature
 */
export class DigitalGeneratedRepository {
  /**
   * Load correspondence metadata for generate-pdf guard checks.
   */
  static async findCorrespondenceForPdfGeneration(
    correspondenceId: string
  ): Promise<{
    id: string;
    createdById: string;
    sourceType: CorrespondenceSourceType;
    status: CorrespondenceStatus;
  } | null> {
    return prisma.correspondence.findUnique({
      where: { id: correspondenceId },
      select: {
        id: true,
        createdById: true,
        sourceType: true,
        status: true,
      },
    });
  }

  /**
   * Load correspondence fields required for HTML renderer.
   */
  static async findCorrespondenceForRendering(correspondenceId: string): Promise<{
    id: string;
    referenceNumber: string | null;
    title: string;
    subject: string | null;
    body: string | null;
    priority: string | null;
    confidentiality: string | null;
    direction: string;
    correspondenceDate: Date | null;
    formData: Prisma.JsonValue | null;
  } | null> {
    return prisma.correspondence.findUnique({
      where: { id: correspondenceId },
      select: {
        id: true,
        referenceNumber: true,
        title: true,
        subject: true,
        body: true,
        priority: true,
        confidentiality: true,
        direction: true,
        correspondenceDate: true,
        formData: true,
      },
    });
  }

  /**
   * Find draft correspondence by ID
   */
  static async findDraftById(
    db: Prisma.TransactionClient,
    id: string
  ): Promise<CorrespondenceDraftRecord | null> {
    return db.correspondence.findUnique({
      where: { id },
      select: {
        id: true,
        createdById: true,
      },
    });
  }

  /**
   * Find correspondence with file links (for PDF generation)
   */
  static async findCorrespondenceWithFiles(
    db: Prisma.TransactionClient,
    id: string
  ) {
    return db.correspondence.findUnique({
      where: { id },
      include: {
        files: {
          where: {
            purpose: "GENERATED_PDF",
          },
        },
      },
    });
  }

  /**
   * Create DRAFT correspondence
   */
  static async createDraft(
    db: Prisma.TransactionClient,
    data: CreateDraftInput & { createdById: string }
  ): Promise<CorrespondenceDraftRecord> {
    const now = new Date();
    const year = now.getFullYear();
    const correspondenceDateValue = data.correspondenceDate
      ? new Date(data.correspondenceDate)
      : undefined;

    const correspondence = await db.correspondence.create({
      data: {
        title: data.title,
        referenceNumber: data.referenceNumber,
        subject: data.subject,
        body: data.body,
        templateId: data.templateId || undefined,
        formData: (data.formData || null) as Prisma.InputJsonValue,
        priority: data.priority || "NORMAL",
        confidentiality: data.confidentiality || "INTERNAL",
        status: "DRAFT",
        sourceType: "DIGITAL_GENERATED",
        direction: data.direction,
        correspondenceDate: correspondenceDateValue || undefined,
        year,
        createdById: data.createdById,
        senderDepartmentId: data.senderDepartmentId || undefined,
        receiverDepartmentId: data.receiverDepartmentId || undefined,
        senderEntityId: data.senderEntityId || undefined,
        receiverEntityId: data.receiverEntityId || undefined,
      },
      select: {
        id: true,
        createdById: true,
      },
    });

    return correspondence;
  }

  /**
   * Execute create draft transaction with audit logging
   */
  static async executeCreateDraftTransaction(
    data: CreateDraftInput & { createdById: string },
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<CreateDraftOutput> {
    return prisma.$transaction(async (tx) => {
      const draft = await this.createDraft(tx, data);

      // Audit log
      await AuditLogger.log(
        {
          actorUserId: data.createdById,
          action: "CREATE",
          entityType: "CORRESPONDENCE",
          entityId: draft.id,
          metadata: {
            title: data.title,
            sourceType: "DIGITAL_GENERATED",
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
          },
        },
        tx
      );

      return {
        id: draft.id,
        title: data.title,
        status: "DRAFT",
        sourceType: "DIGITAL_GENERATED",
        createdAt: new Date().toISOString(),
      };
    });
  }

  /**
   * Execute PDF generation transaction
   *
   * Atomically:
   * 1. Create StoredFile record for PDF
   * 2. Link CorrespondenceFile with GENERATED_PDF purpose
   * 3. Update correspondence status to GENERATED
   * 4. Create audit log
   *
   * If any step fails, entire transaction rolls back.
   */
  static async executeGeneratePdfTransaction(
    correspondenceId: string,
    pdfBuffer: Buffer,
    pdfUrl: string,
    storageKey: string,
    currentUserId: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<GeneratePdfOutput> {
    return prisma.$transaction(async (tx) => {
      // 1. Create StoredFile record
      const storedFile = await tx.storedFile.create({
        data: {
          originalName: `correspondence_${correspondenceId}.pdf`,
          mimeType: "application/pdf",
          sizeBytes: pdfBuffer.byteLength,
          provider: "VERCEL_BLOB",
          storageKey,
          url: pdfUrl,
          checksum: undefined,
          visibility: "PRIVATE",
          uploadedById: currentUserId,
          uploadedAt: new Date(),
        },
        select: {
          id: true,
        },
      });

      // 2. Link CorrespondenceFile
      await tx.correspondenceFile.create({
        data: {
          correspondenceId,
          fileId: storedFile.id,
          purpose: "GENERATED_PDF",
          version: 1,
          createdById: currentUserId,
        },
      });

      // 3. Update correspondence status to GENERATED
      await tx.correspondence.update({
        where: { id: correspondenceId },
        data: {
          status: "GENERATED",
        },
      });

      // 4. Audit log
      await AuditLogger.log(
        {
          actorUserId: currentUserId,
          action: "GENERATE_PDF",
          entityType: "CORRESPONDENCE",
          entityId: correspondenceId,
          metadata: {
            fileId: storedFile.id,
            sizeBytes: pdfBuffer.byteLength,
            storageKey,
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
          },
        },
        tx
      );

      return {
        correspondenceId,
        fileId: storedFile.id,
        status: "GENERATED",
        generatedAt: new Date().toISOString(),
      };
    });
  }
}
