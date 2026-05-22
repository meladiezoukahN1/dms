import { z } from "zod";
import { AppError } from "@/server/core/errors/app-error";
import { ValidationError } from "@/server/core/errors/validation-error";
import { formatZodError } from "@/server/core/errors/format-zod-error";
import type {
  CreateScannedPhysicalInput,
  UploadedScannedFile,
} from "./types";

const DEFAULT_MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const createScannedSchema = z
  .object({
    title: z.string().trim().min(3, "العنوان مطلوب ويجب أن لا يقل عن 3 أحرف").max(500, "العنوان طويل جداً"),
    referenceNumber: z.string().max(100, "الرقم الإشاري طويل جداً").optional(),
    subject: z.string().max(500, "الموضوع طويل جداً").optional(),
    direction: z.enum(["INCOMING", "OUTGOING", "INTERNAL"] as const),
    correspondenceDate: z.string().optional(),
    priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"] as const).default("NORMAL"),
    confidentiality: z
      .enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET", "TOP_SECRET"] as const)
      .default("INTERNAL"),
    senderDepartmentId: z.string().optional(),
    receiverDepartmentId: z.string().optional(),
    senderEntityId: z.string().optional(),
    receiverEntityId: z.string().optional(),
    notes: z.string().max(5000, "الملاحظات طويلة جداً").optional(),
  })
  .strict();

function toOptionalTrimmed(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function getMaxFileSizeBytes(): number {
  const configured = Number(process.env.SCANNED_UPLOAD_MAX_SIZE_BYTES);

  if (Number.isFinite(configured) && configured > 0) {
    return configured;
  }

  return DEFAULT_MAX_FILE_SIZE_BYTES;
}

export class ScannedPhysicalValidator {
  static validateCreateInput(input: unknown): CreateScannedPhysicalInput {
    const parsed = createScannedSchema.safeParse(input);

    if (!parsed.success) {
      throw new ValidationError("بيانات المراسلة الممسوحة غير صالحة", formatZodError(parsed.error));
    }

    return {
      ...parsed.data,
      referenceNumber: toOptionalTrimmed(parsed.data.referenceNumber),
      subject: toOptionalTrimmed(parsed.data.subject),
      correspondenceDate: toOptionalTrimmed(parsed.data.correspondenceDate),
      senderDepartmentId: toOptionalTrimmed(parsed.data.senderDepartmentId),
      receiverDepartmentId: toOptionalTrimmed(parsed.data.receiverDepartmentId),
      senderEntityId: toOptionalTrimmed(parsed.data.senderEntityId),
      receiverEntityId: toOptionalTrimmed(parsed.data.receiverEntityId),
      notes: toOptionalTrimmed(parsed.data.notes),
    };
  }

  static validateUploadedFile(file: File | null): UploadedScannedFile {
    if (!file) {
      throw new AppError("FILE_REQUIRED", 400, "ملف المراسلة الممسوحة مطلوب");
    }

    if (file.size <= 0) {
      throw new AppError("EMPTY_FILE", 400, "الملف المرفوع فارغ");
    }

    const mimeType = file.type?.trim().toLowerCase();

    if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new AppError(
        "UNSUPPORTED_FILE_TYPE",
        400,
        "نوع الملف غير مدعوم. الأنواع المسموحة: PDF, JPEG, PNG, WEBP"
      );
    }

    const maxBytes = getMaxFileSizeBytes();

    if (file.size > maxBytes) {
      throw new AppError("FILE_TOO_LARGE", 413, `حجم الملف يتجاوز الحد المسموح (${maxBytes} بايت)`);
    }

    return {
      originalName: file.name || "scanned-document",
      mimeType,
      sizeBytes: file.size,
    };
  }
}
