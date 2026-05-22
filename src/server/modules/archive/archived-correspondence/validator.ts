import { z } from "zod";
import { AppError } from "@/server/core/errors/app-error";
import type { ArchivedCorrespondenceListQuery } from "./types";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const previewMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export class ArchivedCorrespondenceValidator {
  static validateListQuery(raw: unknown): ArchivedCorrespondenceListQuery {
    const schema = z.object({
      page: z
        .union([z.string(), z.number()])
        .optional()
        .transform((v) => {
          if (v === undefined || v === "") return DEFAULT_PAGE;
          const parsed = typeof v === "string" ? parseInt(v, 10) : v;
          return Number.isNaN(parsed) || parsed < 1 ? DEFAULT_PAGE : parsed;
        }),
      pageSize: z
        .union([z.string(), z.number()])
        .optional()
        .transform((v) => {
          if (v === undefined || v === "") return DEFAULT_PAGE_SIZE;
          const parsed = typeof v === "string" ? parseInt(v, 10) : v;
          if (Number.isNaN(parsed)) return DEFAULT_PAGE_SIZE;
          if (parsed < 1) return DEFAULT_PAGE_SIZE;
          if (parsed > MAX_PAGE_SIZE) return MAX_PAGE_SIZE;
          return parsed;
        }),
      search: z.string().optional(),
      sourceType: z.enum(["DIGITAL_GENERATED", "SCANNED_PHYSICAL"]).optional(),
      direction: z.enum(["INCOMING", "OUTGOING", "INTERNAL"]).optional(),
      priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),
      confidentiality: z
        .enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET", "TOP_SECRET"])
        .optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
      archiveDateFrom: z.string().optional(),
      archiveDateTo: z.string().optional(),
    });

    try {
      return schema.parse(raw);
    } catch {
      throw new AppError("INVALID_INPUT", 400, "معاملات البحث غير صحيحة");
    }
  }

  static validateId(id: string | undefined, message: string): string {
    if (!id) {
      throw new AppError("BAD_REQUEST", 400, message);
    }
    return id;
  }

  static enforcePreviewSupported(mimeType: string): void {
    if (!previewMimeTypes.has(mimeType)) {
      throw new AppError(
        "FILE_PREVIEW_NOT_SUPPORTED",
        400,
        "هذا النوع من الملفات لا يدعم المعاينة"
      );
    }
  }

  static isPreviewSupported(mimeType: string): boolean {
    return previewMimeTypes.has(mimeType);
  }
}
