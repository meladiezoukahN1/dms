import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { ArchivedCorrespondenceValidator } from "./validator";
import type {
  ArchivedCorrespondenceDetailOutput,
  ArchivedCorrespondenceFileAccess,
  ArchivedCorrespondenceFileDto,
  ArchivedCorrespondenceListItemDto,
  ArchivedCorrespondenceListOutput,
  ArchivedCorrespondenceListQuery,
} from "./types";

function buildWhere(query: ArchivedCorrespondenceListQuery): Prisma.CorrespondenceWhereInput {
  const filters: Prisma.CorrespondenceWhereInput[] = [
    {
      deletedAt: null,
      status: "ARCHIVED",
    },
  ];

  if (query.search) {
    filters.push({
      OR: [
        { title: { contains: query.search } },
        { referenceNumber: { contains: query.search } },
        { subject: { contains: query.search } },
      ],
    });
  }

  if (query.sourceType) filters.push({ sourceType: query.sourceType });
  if (query.direction) filters.push({ direction: query.direction });
  if (query.priority) filters.push({ priority: query.priority });
  if (query.confidentiality) filters.push({ confidentiality: query.confidentiality });

  if (query.dateFrom || query.dateTo) {
    filters.push({
      correspondenceDate: {
        gte: query.dateFrom ? new Date(query.dateFrom) : undefined,
        lte: query.dateTo ? new Date(query.dateTo) : undefined,
      },
    });
  }

  if (query.archiveDateFrom || query.archiveDateTo) {
    filters.push({
      archivedAt: {
        gte: query.archiveDateFrom ? new Date(query.archiveDateFrom) : undefined,
        lte: query.archiveDateTo ? new Date(query.archiveDateTo) : undefined,
      },
    });
  }

  return { AND: filters };
}

function mapFilesFromCorrespondenceAndArchive(
  correspondenceFiles: Array<{
    file: {
      id: string;
      originalName: string;
      mimeType: string;
      sizeBytes: number;
      provider: "LOCAL" | "VERCEL_BLOB" | "S3" | "CLOUDINARY";
    };
    purpose: ArchivedCorrespondenceFileDto["purpose"];
  }>,
  archiveFiles: Array<{
    file: {
      id: string;
      originalName: string;
      mimeType: string;
      sizeBytes: number;
      provider: "LOCAL" | "VERCEL_BLOB" | "S3" | "CLOUDINARY";
    };
    purpose: ArchivedCorrespondenceFileDto["purpose"];
  }>
): ArchivedCorrespondenceFileDto[] {
  const map = new Map<string, ArchivedCorrespondenceFileDto>();

  for (const item of correspondenceFiles) {
    map.set(item.file.id, {
      id: item.file.id,
      purpose: item.purpose,
      originalName: item.file.originalName,
      mimeType: item.file.mimeType,
      sizeBytes: item.file.sizeBytes,
      provider: item.file.provider,
      previewSupported: ArchivedCorrespondenceValidator.isPreviewSupported(item.file.mimeType),
    });
  }

  for (const item of archiveFiles) {
    if (!map.has(item.file.id)) {
      map.set(item.file.id, {
        id: item.file.id,
        purpose: item.purpose,
        originalName: item.file.originalName,
        mimeType: item.file.mimeType,
        sizeBytes: item.file.sizeBytes,
        provider: item.file.provider,
        previewSupported: ArchivedCorrespondenceValidator.isPreviewSupported(item.file.mimeType),
      });
    }
  }

  return Array.from(map.values());
}

export class ArchivedCorrespondenceRepository {
  static async getList(query: ArchivedCorrespondenceListQuery): Promise<ArchivedCorrespondenceListOutput> {
    const where = buildWhere(query);
    const skip = (query.page - 1) * query.pageSize;

    const [total, rows] = await Promise.all([
      prisma.correspondence.count({ where }),
      prisma.correspondence.findMany({
        where,
        skip,
        take: query.pageSize,
        orderBy: [
          { archivedAt: "desc" },
          { createdAt: "desc" },
        ],
        select: {
          id: true,
          title: true,
          referenceNumber: true,
          sourceType: true,
          direction: true,
          priority: true,
          confidentiality: true,
          correspondenceDate: true,
          archivedAt: true,
          createdAt: true,
          createdBy: {
            select: {
              fullName: true,
            },
          },
          archiveRecord: {
            select: {
              id: true,
              archiveNumber: true,
              archivedAt: true,
            },
          },
        },
      }),
    ]);

    const items: ArchivedCorrespondenceListItemDto[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      referenceNumber: row.referenceNumber,
      sourceType: row.sourceType,
      direction: row.direction,
      priority: row.priority,
      confidentiality: row.confidentiality,
      correspondenceDate: row.correspondenceDate ? row.correspondenceDate.toISOString() : null,
      archivedAt: row.archivedAt
        ? row.archivedAt.toISOString()
        : row.archiveRecord?.archivedAt
          ? row.archiveRecord.archivedAt.toISOString()
          : null,
      createdAt: row.createdAt.toISOString(),
      createdByName: row.createdBy.fullName,
      archiveRecordId: row.archiveRecord?.id ?? null,
      archiveNumber: row.archiveRecord?.archiveNumber ?? null,
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

  static async getDetailById(id: string): Promise<ArchivedCorrespondenceDetailOutput | null> {
    const row = await prisma.correspondence.findFirst({
      where: {
        id,
        deletedAt: null,
        status: "ARCHIVED",
      },
      select: {
        id: true,
        title: true,
        referenceNumber: true,
        subject: true,
        sourceType: true,
        direction: true,
        priority: true,
        confidentiality: true,
        correspondenceDate: true,
        archivedAt: true,
        createdAt: true,
        createdBy: {
          select: {
            fullName: true,
          },
        },
        files: {
          select: {
            purpose: true,
            file: {
              select: {
                id: true,
                originalName: true,
                mimeType: true,
                sizeBytes: true,
                provider: true,
              },
            },
          },
        },
        archiveRecord: {
          select: {
            id: true,
            archiveNumber: true,
            archivedAt: true,
            files: {
              select: {
                purpose: true,
                file: {
                  select: {
                    id: true,
                    originalName: true,
                    mimeType: true,
                    sizeBytes: true,
                    provider: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!row) return null;

    const files = mapFilesFromCorrespondenceAndArchive(
      row.files,
      row.archiveRecord?.files ?? []
    );

    return {
      id: row.id,
      title: row.title,
      referenceNumber: row.referenceNumber,
      subject: row.subject,
      sourceType: row.sourceType,
      direction: row.direction,
      priority: row.priority,
      confidentiality: row.confidentiality,
      correspondenceDate: row.correspondenceDate ? row.correspondenceDate.toISOString() : null,
      archivedAt: row.archivedAt
        ? row.archivedAt.toISOString()
        : row.archiveRecord?.archivedAt
          ? row.archiveRecord.archivedAt.toISOString()
          : null,
      createdAt: row.createdAt.toISOString(),
      createdByName: row.createdBy.fullName,
      archiveRecordId: row.archiveRecord?.id ?? null,
      archiveNumber: row.archiveRecord?.archiveNumber ?? null,
      files,
    };
  }

  static async getArchivedFileAccess(fileId: string): Promise<ArchivedCorrespondenceFileAccess | null> {
    const file = await prisma.storedFile.findFirst({
      where: {
        id: fileId,
        deletedAt: null,
        OR: [
          {
            correspondenceLinks: {
              some: {
                correspondence: {
                  status: "ARCHIVED",
                  deletedAt: null,
                },
              },
            },
          },
          {
            archiveLinks: {
              some: {
                archiveRecord: {
                  deletedAt: null,
                  correspondence: {
                    status: "ARCHIVED",
                    deletedAt: null,
                  },
                },
              },
            },
          },
        ],
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
