import { z } from "zod";
import { ValidationError } from "@/server/core/errors/validation-error";
import { formatZodError } from "@/server/core/errors/format-zod-error";
import { AppError } from "@/server/core/errors/app-error";
import type {
  ArchiveHandoverListQuery,
  SendToArchiveInput,
  UpdateArchiveHandoverInput,
} from "./types";

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1).max(200).optional(),
  sourceType: z.enum(["DIGITAL_GENERATED", "SCANNED_PHYSICAL"] as const).optional(),
  status: z.enum(["GENERATED", "RECEIVED", "ARCHIVE_PENDING"] as const).optional(),
  direction: z.enum(["INCOMING", "OUTGOING", "INTERNAL"] as const).optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"] as const).optional(),
  confidentiality: z
    .enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET", "TOP_SECRET"] as const)
    .optional(),
  dateFrom: z.string().trim().optional(),
  dateTo: z.string().trim().optional(),
});

const updateSchema = z
  .object({
    title: z.string().trim().min(3).max(500).optional(),
    referenceNumber: z.string().trim().max(100).nullable().optional(),
    subject: z.string().trim().max(500).nullable().optional(),
    direction: z.enum(["INCOMING", "OUTGOING", "INTERNAL"] as const).optional(),
    priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"] as const).optional(),
    confidentiality: z
      .enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET", "TOP_SECRET"] as const)
      .optional(),
    correspondenceDate: z.string().trim().nullable().optional(),
    senderDepartmentId: z.string().trim().nullable().optional(),
    receiverDepartmentId: z.string().trim().nullable().optional(),
    senderEntityId: z.string().trim().nullable().optional(),
    receiverEntityId: z.string().trim().nullable().optional(),
    notes: z.string().trim().max(5000).nullable().optional(),
    formData: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

const previewMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const sendSchema = z
  .object({
    targetDepartmentId: z.string().trim().optional(),
    notes: z.string().trim().max(5000).optional(),
  })
  .strict();

function normalizeNullableString(value: string | null | undefined): string | null | undefined {
  if (typeof value === "undefined") {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  return normalized;
}

export class ArchiveHandoverValidator {
  static validateListQuery(input: unknown): ArchiveHandoverListQuery {
    const parsed = listQuerySchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError("معايير البحث غير صالحة", formatZodError(parsed.error));
    }

    return parsed.data;
  }

  static validateUpdateInput(input: unknown): UpdateArchiveHandoverInput {
    const parsed = updateSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError("بيانات التحديث غير صالحة", formatZodError(parsed.error));
    }

    return {
      ...parsed.data,
      referenceNumber: normalizeNullableString(parsed.data.referenceNumber),
      subject: normalizeNullableString(parsed.data.subject),
      correspondenceDate: normalizeNullableString(parsed.data.correspondenceDate),
      senderDepartmentId: normalizeNullableString(parsed.data.senderDepartmentId),
      receiverDepartmentId: normalizeNullableString(parsed.data.receiverDepartmentId),
      senderEntityId: normalizeNullableString(parsed.data.senderEntityId),
      receiverEntityId: normalizeNullableString(parsed.data.receiverEntityId),
      notes: normalizeNullableString(parsed.data.notes),
    };
  }

  static validateSendInput(input: unknown): SendToArchiveInput {
    const parsed = sendSchema.safeParse(input ?? {});
    if (!parsed.success) {
      throw new ValidationError("بيانات الإحالة للأرشفة غير صالحة", formatZodError(parsed.error));
    }

    const targetDepartmentId = parsed.data.targetDepartmentId?.trim() || undefined;
    const notes = parsed.data.notes?.trim() || undefined;

    return {
      targetDepartmentId,
      notes,
    };
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
