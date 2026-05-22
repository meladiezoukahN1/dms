import type { Prisma, CorrespondenceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { AuditLogger } from "@/lib/audit/audit-logger";
import type {
  CreateScannedPhysicalInput,
  CreateScannedPhysicalResult,
  UploadedBlobMetadata,
  UploadedScannedFile,
} from "./types";

interface TransactionMetadata {
  ipAddress?: string;
  userAgent?: string;
}

interface CreateScannedPhysicalTransactionInput {
  currentUserId: string;
  status: CorrespondenceStatus;
  payload: CreateScannedPhysicalInput;
  uploadedFile: UploadedScannedFile;
  blob: UploadedBlobMetadata;
  metadata?: TransactionMetadata;
}

export class ScannedPhysicalRepository {
  static async executeCreateIntakeTransaction(
    input: CreateScannedPhysicalTransactionInput
  ): Promise<CreateScannedPhysicalResult> {
    return prisma.$transaction(async (tx) => {
      const now = new Date();
      const year = now.getFullYear();
      const correspondenceDateValue = input.payload.correspondenceDate
        ? new Date(input.payload.correspondenceDate)
        : undefined;

      const correspondence = await tx.correspondence.create({
        data: {
          title: input.payload.title,
          referenceNumber: input.payload.referenceNumber,
          subject: input.payload.subject,
          body: undefined,
          direction: input.payload.direction,
          sourceType: "SCANNED_PHYSICAL",
          status: input.status,
          priority: input.payload.priority || "NORMAL",
          confidentiality: input.payload.confidentiality || "INTERNAL",
          senderDepartmentId: input.payload.senderDepartmentId,
          receiverDepartmentId: input.payload.receiverDepartmentId,
          senderEntityId: input.payload.senderEntityId,
          receiverEntityId: input.payload.receiverEntityId,
          correspondenceDate: correspondenceDateValue,
          year,
          createdById: input.currentUserId,
          receivedAt: now,
          metadata: ({
            notes: input.payload.notes || null,
            intakeMethod: "UPLOAD",
            originalFileName: input.uploadedFile.originalName,
          } satisfies Record<string, unknown>) as Prisma.InputJsonValue,
        },
        select: {
          id: true,
          status: true,
        },
      });

      const storedFile = await tx.storedFile.create({
        data: {
          originalName: input.uploadedFile.originalName,
          mimeType: input.uploadedFile.mimeType,
          sizeBytes: input.uploadedFile.sizeBytes,
          provider: input.blob.provider,
          storageKey: input.blob.storageKey,
          url: input.blob.url,
          visibility: "PRIVATE",
          uploadedById: input.currentUserId,
          uploadedAt: now,
        },
        select: {
          id: true,
        },
      });

      await tx.correspondenceFile.create({
        data: {
          correspondenceId: correspondence.id,
          fileId: storedFile.id,
          purpose: "SCANNED_DOCUMENT",
          version: 1,
          createdById: input.currentUserId,
        },
      });

      await AuditLogger.log(
        {
          actorUserId: input.currentUserId,
          action: "SCAN_UPLOAD",
          entityType: "CORRESPONDENCE",
          entityId: correspondence.id,
          metadata: {
            sourceType: "SCANNED_PHYSICAL",
            status: correspondence.status,
            fileId: storedFile.id,
            filePurpose: "SCANNED_DOCUMENT",
            mimeType: input.uploadedFile.mimeType,
            sizeBytes: input.uploadedFile.sizeBytes,
            storageKey: input.blob.storageKey,
            ipAddress: input.metadata?.ipAddress,
            userAgent: input.metadata?.userAgent,
          },
        },
        tx
      );

      return {
        correspondenceId: correspondence.id,
        status: correspondence.status,
        fileId: storedFile.id,
        purpose: "SCANNED_DOCUMENT",
        visibility: "PRIVATE",
      };
    });
  }
}
