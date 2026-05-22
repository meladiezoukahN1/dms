import type {
  CorrespondenceSourceType,
  CorrespondenceStatus,
  Prisma,
  ArchiveClassification,
} from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { AuditLogger } from "@/lib/audit/audit-logger";
import { AppError } from "@/server/core/errors/app-error";
import type {
  FinalArchiveItemDto,
  FinalArchiveListOutput,
  FinalArchiveListQuery,
  ArchiveCorrespondenceInput,
  ArchiveCorrespondenceOutput,
  FinalArchiveUserDto,
  UpdateFinalArchiveInput,
  UpdateFinalArchiveOutput,
  FinalArchiveFileAccess,
} from "./types";
import { FinalArchiveValidator } from "./validator";

interface RequestMetadata {
  ipAddress?: string;
  userAgent?: string;
}

interface EligibleRecord {
  id: string;
  sourceType: CorrespondenceSourceType;
  status: CorrespondenceStatus;
  filesCount: number;
  archiveHandoverById: string | null;
  archiveHandoverAt: Date | null;
}

function buildEligibleWhere(query: FinalArchiveListQuery): Prisma.CorrespondenceWhereInput {
  // Final archive is for ARCHIVE_PENDING only
  const baseEligible: Prisma.CorrespondenceWhereInput = {
    deletedAt: null,
    sourceType: {
      in: ["DIGITAL_GENERATED", "SCANNED_PHYSICAL"],
    },
    status: "ARCHIVE_PENDING",
  };

  const andFilters: Prisma.CorrespondenceWhereInput[] = [baseEligible];

  if (query.search) {
    andFilters.push({
      OR: [
        { title: { contains: query.search } },
        { referenceNumber: { contains: query.search } },
        { subject: { contains: query.search } },
      ],
    });
  }

  if (query.sourceType) {
    andFilters.push({ sourceType: query.sourceType });
  }

  if (query.direction) {
    andFilters.push({ direction: query.direction });
  }

  if (query.priority) {
    andFilters.push({ priority: query.priority });
  }

  if (query.confidentiality) {
    andFilters.push({ confidentiality: query.confidentiality });
  }

  if (query.dateFrom || query.dateTo) {
    andFilters.push({
      correspondenceDate: {
        gte: query.dateFrom ? new Date(query.dateFrom) : undefined,
        lte: query.dateTo ? new Date(query.dateTo) : undefined,
      },
    });
  }

  return {
    AND: andFilters,
  };
}

function mapUser(user: { id: string; fullName: string; email: string }): FinalArchiveUserDto {
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
  };
}

export class FinalArchiveRepository {
  static async getList(query: FinalArchiveListQuery): Promise<FinalArchiveListOutput> {
    const where = buildEligibleWhere(query);
    const skip = (query.page - 1) * query.pageSize;

    const [total, rows] = await Promise.all([
      prisma.correspondence.count({ where }),
      prisma.correspondence.findMany({
        where,
        skip,
        take: query.pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          referenceNumber: true,
          subject: true,
          sourceType: true,
          status: true,
          direction: true,
          priority: true,
          confidentiality: true,
          correspondenceDate: true,
          createdAt: true,
          archiveHandoverAt: true,
          archiveHandoverNotes: true,
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          archiveHandoverBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          files: {
            select: {
              id: true,
              fileId: true,
              purpose: true,
              file: {
                select: {
                  originalName: true,
                  mimeType: true,
                  sizeBytes: true,
                  provider: true,
                  visibility: true,
                  url: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const items: FinalArchiveItemDto[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      referenceNumber: row.referenceNumber || null,
      subject: row.subject || null,
      sourceType: row.sourceType,
      direction: row.direction,
      priority: row.priority,
      confidentiality: row.confidentiality,
      correspondenceDate: row.correspondenceDate?.toISOString() || null,
      createdAt: row.createdAt.toISOString(),
      createdBy: mapUser(row.createdBy),
      archiveHandoverBy: row.archiveHandoverBy ? mapUser(row.archiveHandoverBy) : null,
      archiveHandoverAt: row.archiveHandoverAt?.toISOString() || null,
      archiveHandoverNotes: row.archiveHandoverNotes || null,
      files: row.files.map((cf) => ({
        id: cf.id,
        fileId: cf.fileId,
        purpose: cf.purpose,
        originalName: cf.file.originalName,
        mimeType: cf.file.mimeType,
        sizeBytes: cf.file.sizeBytes,
        provider: cf.file.provider,
        previewSupported: FinalArchiveValidator.isPreviewSupported(cf.file.mimeType),
      })),
    }));

    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  }

  static async findById(id: string): Promise<EligibleRecord | null> {
    const record = await prisma.correspondence.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        sourceType: true,
        status: true,
        archiveHandoverById: true,
        archiveHandoverAt: true,
        files: {
          select: { id: true },
        },
      },
    });

    if (!record) return null;

    return {
      id: record.id,
      sourceType: record.sourceType,
      status: record.status,
      filesCount: record.files.length,
      archiveHandoverById: record.archiveHandoverById,
      archiveHandoverAt: record.archiveHandoverAt,
    };
  }

  static async hasAtLeastOneFile(id: string): Promise<boolean> {
    const count = await prisma.correspondenceFile.count({
      where: { correspondenceId: id },
    });
    return count > 0;
  }

  static async updateMetadata(
    id: string,
    input: UpdateFinalArchiveInput,
    currentUserId: string,
    metadata?: RequestMetadata
  ): Promise<UpdateFinalArchiveOutput> {
    const updateData: Prisma.CorrespondenceUpdateInput = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.referenceNumber !== undefined) updateData.referenceNumber = input.referenceNumber;
    if (input.subject !== undefined) updateData.subject = input.subject;
    if (input.direction !== undefined) updateData.direction = input.direction;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.confidentiality !== undefined) updateData.confidentiality = input.confidentiality;
    if (input.correspondenceDate !== undefined) {
      updateData.correspondenceDate = input.correspondenceDate ? new Date(input.correspondenceDate) : null;
    }    if (input.archiveHandoverNotes !== undefined) updateData.archiveHandoverNotes = input.archiveHandoverNotes;

    const updated = await prisma.correspondence.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        referenceNumber: true,
        subject: true,
        sourceType: true,
        status: true,
        direction: true,
        priority: true,
        confidentiality: true,
        correspondenceDate: true,
        updatedAt: true,
      },
    });

    // Log the update
    await AuditLogger.log({
      actorUserId: currentUserId,
      action: "UPDATE",
      entityType: "CORRESPONDENCE",
      entityId: id,
      metadata: {
        fields: Object.keys(input).filter((key) => (input as Record<string, unknown>)[key] !== undefined),
        stage: "FINAL_ARCHIVE_PREP",
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      },
    });

    return {
      id: updated.id,
      title: updated.title,
      referenceNumber: updated.referenceNumber || null,
      subject: updated.subject || null,
      sourceType: updated.sourceType,
      status: updated.status,
      direction: updated.direction,
      priority: updated.priority,
      confidentiality: updated.confidentiality,
      correspondenceDate: updated.correspondenceDate?.toISOString() || null,
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  static async archiveCorrespondence(
    id: string,
    input: ArchiveCorrespondenceInput,
    currentUserId: string,
    metadata?: RequestMetadata
  ): Promise<ArchiveCorrespondenceOutput> {
    // Get existing correspondence data
    const correspondence = await prisma.correspondence.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        subject: true,
        confidentiality: true,
        files: {
          select: {
            fileId: true,
            file: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!correspondence) {
      throw new AppError("NOT_FOUND", 404, "المراسلة غير موجودة");
    }

    // Get the default classification (required by schema)
    // For now, find the first one or create a default
    let classification: ArchiveClassification | null = await prisma.archiveClassification.findFirst({
      where: { deletedAt: null },
    });

    if (!classification) {
      // Create a default classification if none exists
      classification = await prisma.archiveClassification.create({
        data: {
          name: "تصنيف عام",
          code: "GENERAL",
          description: "التصنيف الافتراضي للأرشيف",
        },
      });
    }

    // Build archive metadata
    const archiveMetadata = {
      archiveCode: input.archiveCode || null,
      archiveLocation: input.archiveLocation || null,
      shelf: input.shelf || null,
      boxNumber: input.boxNumber || null,
      notes: input.notes || null,
    };

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create ArchiveRecord
      const archiveRecord = await tx.archiveRecord.create({
        data: {
          title: correspondence.title,
          description: correspondence.subject || undefined,
          metadata: archiveMetadata,
          correspondenceId: id,
          classificationId: classification!.id,
          confidentiality: correspondence.confidentiality,
          status: "ARCHIVED",
          createdById: currentUserId,
        },
        select: { id: true },
      });

      // Link files to archive
      if (correspondence.files.length > 0) {
        const fileLinks = correspondence.files.map((cf) => ({
          archiveRecordId: archiveRecord.id,
          fileId: cf.fileId,
        }));

        await tx.archiveFile.createMany({
          data: fileLinks,
          skipDuplicates: true,
        });
      }

      // Update correspondence status to ARCHIVED
      const updatedCorr = await tx.correspondence.update({
        where: { id },
        data: {
          status: "ARCHIVED",
          archivedAt: new Date(),
        },
        select: { id: true, status: true, archivedAt: true },
      });

      return {
        correspondenceId: updatedCorr.id,
        archiveRecordId: archiveRecord.id,
        status: updatedCorr.status,
        archivedAt: updatedCorr.archivedAt,
      };
    });

    // Log the archive action
    await AuditLogger.log({
      actorUserId: currentUserId,
      action: "ARCHIVE",
      entityType: "CORRESPONDENCE",
      entityId: id,
      metadata: {
        archiveRecordId: result.archiveRecordId,
        stage: "FINAL_ARCHIVE",
        archiveMetadata,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
      },
    });

    return {
      id: result.correspondenceId,
      status: "ARCHIVED",
      archivedAt: result.archivedAt?.toISOString() || new Date().toISOString(),
      archiveRecordId: result.archiveRecordId,
    };
  }

  static async getArchivePendingFileAccess(fileId: string): Promise<FinalArchiveFileAccess | null> {
    const file = await prisma.storedFile.findFirst({
      where: {
        id: fileId,
        deletedAt: null,
        correspondenceLinks: {
          some: {
            correspondence: {
              status: "ARCHIVE_PENDING",
              deletedAt: null,
            },
          },
        },
      },
      select: {
        id: true,
        storageKey: true,
        url: true,
        originalName: true,
        mimeType: true,
      },
    });

    if (!file) return null;

    return {
      fileId: file.id,
      storageKey: file.storageKey,
      url: file.url,
      originalName: file.originalName,
      mimeType: file.mimeType,
    };
  }

}