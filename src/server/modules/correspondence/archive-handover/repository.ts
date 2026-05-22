import type { CorrespondenceSourceType, CorrespondenceStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { AuditLogger } from "@/lib/audit/audit-logger";
import { AppError } from "@/server/core/errors/app-error";
import type {
  ArchiveHandoverItemDto,
  ArchiveHandoverListOutput,
  ArchiveHandoverListQuery,
  SendToArchiveInput,
  SendToArchiveOutput,
  ArchiveHandoverUserDto,
  UpdateArchiveHandoverInput,
  UpdateArchiveHandoverOutput,
} from "./types";

interface RequestMetadata {
  ipAddress?: string;
  userAgent?: string;
}

interface EligibleRecord {
  id: string;
  sourceType: CorrespondenceSourceType;
  status: CorrespondenceStatus;
}

function buildEligibleWhere(query: ArchiveHandoverListQuery): Prisma.CorrespondenceWhereInput {
  const baseEligible: Prisma.CorrespondenceWhereInput = {
    deletedAt: null,
    sourceType: {
      in: ["DIGITAL_GENERATED", "SCANNED_PHYSICAL"],
    },
  };

  const andFilters: Prisma.CorrespondenceWhereInput[] = [baseEligible];

  // Default list includes only actionable handover records.
  // ARCHIVE_PENDING appears only when explicitly requested by status filter.
  if (query.status) {
    andFilters.push({ status: query.status });
  } else {
    andFilters.push({
      OR: [
        { sourceType: "DIGITAL_GENERATED", status: "GENERATED" },
        { sourceType: "SCANNED_PHYSICAL", status: "RECEIVED" },
      ],
    });
  }

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

function mapUser(user: { id: string; fullName: string; email: string }): ArchiveHandoverUserDto {
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
  };
}

export class ArchiveHandoverRepository {
  static async getList(query: ArchiveHandoverListQuery): Promise<ArchiveHandoverListOutput> {
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

    const items: ArchiveHandoverItemDto[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      referenceNumber: row.referenceNumber,
      subject: row.subject,
      sourceType: row.sourceType,
      status: row.status,
      direction: row.direction,
      priority: row.priority,
      confidentiality: row.confidentiality,
      correspondenceDate: row.correspondenceDate ? row.correspondenceDate.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
      createdBy: mapUser(row.createdBy),
      handedOverBy: row.archiveHandoverBy ? mapUser(row.archiveHandoverBy) : null,
      handedOverAt: row.archiveHandoverAt ? row.archiveHandoverAt.toISOString() : null,
      archiveHandoverNotes: row.archiveHandoverNotes,
      files: row.files.map((fileLink) => {
        const urlAvailable = fileLink.file.visibility === "PUBLIC_APPROVED" && Boolean(fileLink.file.url);
        const previewMimes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
        return {
          id: fileLink.id,
          fileId: fileLink.fileId,
          purpose: fileLink.purpose,
          originalName: fileLink.file.originalName,
          mimeType: fileLink.file.mimeType,
          sizeBytes: fileLink.file.sizeBytes,
          provider: fileLink.file.provider,
          urlAvailable,
          safeUrl: urlAvailable ? fileLink.file.url ?? null : null,
          previewSupported: previewMimes.has(fileLink.file.mimeType),
        };
      }),
    }));

    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
      },
    };
  }

  static async findEligibleById(id: string): Promise<EligibleRecord | null> {
    return prisma.correspondence.findFirst({
      where: {
        id,
        deletedAt: null,
        OR: [
          { sourceType: "DIGITAL_GENERATED", status: "GENERATED" },
          { sourceType: "SCANNED_PHYSICAL", status: "RECEIVED" },
        ],
      },
      select: {
        id: true,
        sourceType: true,
        status: true,
      },
    });
  }

  static async findById(
    id: string
  ): Promise<{
    id: string;
    sourceType: CorrespondenceSourceType;
    status: CorrespondenceStatus;
  } | null> {
    return prisma.correspondence.findUnique({
      where: { id },
      select: {
        id: true,
        sourceType: true,
        status: true,
      },
    });
  }

  static async hasAtLeastOneFile(correspondenceId: string): Promise<boolean> {
    const count = await prisma.correspondenceFile.count({
      where: {
        correspondenceId,
      },
    });

    return count > 0;
  }

  static async sendToArchive(
    id: string,
    input: SendToArchiveInput,
    currentUserId: string,
    handoverStatus: CorrespondenceStatus,
    metadata?: RequestMetadata
  ): Promise<SendToArchiveOutput> {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.correspondence.update({
        where: { id },
        data: {
          status: handoverStatus,
          archiveHandoverById: currentUserId,
          archiveHandoverAt: new Date(),
          archiveHandoverNotes: input.notes || null,
          receiverDepartmentId: input.targetDepartmentId ?? undefined,
        },
        select: {
          id: true,
          status: true,
          archiveHandoverAt: true,
          archiveHandoverNotes: true,
          archiveHandoverBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

      if (!updated.archiveHandoverAt || !updated.archiveHandoverBy) {
        throw new AppError("ARCHIVE_HANDOVER_WRITE_FAILED", 500, "تعذر تسجيل بيانات الإحالة للأرشفة");
      }

      await AuditLogger.log(
        {
          actorUserId: currentUserId,
          action: "STATUS_CHANGE",
          entityType: "CORRESPONDENCE",
          entityId: id,
          metadata: {
            fromStage: "ARCHIVE_HANDOVER_PREP",
            toStatus: handoverStatus,
            targetDepartmentId: input.targetDepartmentId,
            notes: input.notes || null,
            archiveHandoverById: currentUserId,
            archiveHandoverAt: updated.archiveHandoverAt.toISOString(),
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
          },
        },
        tx
      );

      return {
        id: updated.id,
        status: "ARCHIVE_PENDING",
        archiveHandoverAt: updated.archiveHandoverAt.toISOString(),
        archiveHandoverBy: mapUser(updated.archiveHandoverBy),
        archiveHandoverNotes: updated.archiveHandoverNotes,
      };
    });
  }

  static async updateMetadata(
    id: string,
    input: UpdateArchiveHandoverInput,
    currentUserId: string,
    metadata?: RequestMetadata
  ): Promise<UpdateArchiveHandoverOutput> {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.correspondence.findUnique({
        where: { id },
        select: {
          id: true,
          sourceType: true,
          formData: true,
          metadata: true,
        },
      });

      if (!existing) {
        throw new AppError("NOT_FOUND", 404, "المراسلة غير موجودة");
      }

      const updateData: Prisma.CorrespondenceUncheckedUpdateInput = {
        title: input.title,
        referenceNumber: input.referenceNumber,
        subject: input.subject,
        direction: input.direction,
        priority: input.priority,
        confidentiality: input.confidentiality,
        correspondenceDate:
          typeof input.correspondenceDate === "undefined"
            ? undefined
            : input.correspondenceDate
              ? new Date(input.correspondenceDate)
              : null,
        senderDepartmentId: input.senderDepartmentId,
        receiverDepartmentId: input.receiverDepartmentId,
        senderEntityId: input.senderEntityId,
        receiverEntityId: input.receiverEntityId,
      };

      if (typeof input.notes !== "undefined") {
        const currentMetadata =
          existing.metadata && typeof existing.metadata === "object" && !Array.isArray(existing.metadata)
            ? (existing.metadata as Record<string, unknown>)
            : {};

        updateData.metadata = {
          ...currentMetadata,
          notes: input.notes,
        } as Prisma.InputJsonValue;
      }

      if (typeof input.formData !== "undefined") {
        if (existing.sourceType !== "DIGITAL_GENERATED") {
          throw new AppError("FORM_DATA_NOT_ALLOWED", 400, "تعديل formData مسموح فقط للمراسلات الرقمية");
        }

        updateData.formData = input.formData as Prisma.InputJsonValue;
      }

      const updated = await tx.correspondence.update({
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

      await AuditLogger.log(
        {
          actorUserId: currentUserId,
          action: "UPDATE",
          entityType: "CORRESPONDENCE",
          entityId: id,
          metadata: {
            stage: "ARCHIVE_HANDOVER_PREP",
            updatedFields: Object.keys(input),
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
          },
        },
        tx
      );

      return {
        id: updated.id,
        title: updated.title,
        referenceNumber: updated.referenceNumber,
        subject: updated.subject,
        sourceType: updated.sourceType,
        status: updated.status,
        direction: updated.direction,
        priority: updated.priority,
        confidentiality: updated.confidentiality,
        correspondenceDate: updated.correspondenceDate ? updated.correspondenceDate.toISOString() : null,
        updatedAt: updated.updatedAt.toISOString(),
      };
    });
  }

  static async getEligibleFileAccess(fileId: string): Promise<{
    fileId: string;
    storageKey: string;
    url: string | null;
    originalName: string;
    mimeType: string;
  } | null> {
    const file = await prisma.storedFile.findFirst({
      where: {
        id: fileId,
        deletedAt: null,
        correspondenceLinks: {
          some: {
            correspondence: {
              deletedAt: null,
              OR: [
                { sourceType: "DIGITAL_GENERATED", status: "GENERATED" },
                { sourceType: "SCANNED_PHYSICAL", status: "RECEIVED" },
                { status: "ARCHIVE_PENDING" },
              ],
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
