import { z } from "zod";
import { ValidationError } from "@/server/core/errors/validation-error";
import { formatZodError } from "@/server/core/errors/format-zod-error";
import type { CreateDraftInput, GeneratePdfInput } from "./types";

const createDraftSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب").max(500, "العنوان طويل جداً"),
  referenceNumber: z.string().max(100, "الرقم الإشاري طويل جداً").optional(),
  subject: z.string().max(500, "الموضوع طويل جداً").optional(),
  body: z.string().optional(),
  direction: z
    .enum(["OUTGOING", "INTERNAL"] as const),
  templateId: z.string().optional(),
  formData: z.record(z.string(), z.any()).optional(),
  priority: z
    .enum(["LOW", "NORMAL", "HIGH", "URGENT"] as const)
    .default("NORMAL" as const),
  confidentiality: z
    .enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET", "TOP_SECRET"] as const)
    .default("INTERNAL" as const),
  correspondenceDate: z.string().optional(),
  senderDepartmentId: z.string().optional(),
  receiverDepartmentId: z.string().optional(),
  senderEntityId: z.string().optional(),
  receiverEntityId: z.string().optional(),
}).strict();

const generatePdfSchema = z.object({
  correspondenceId: z.string().min(1, "معرف المراسلة مطلوب"),
});

export class DigitalGeneratedValidator {
  static validateCreateDraft(input: unknown): CreateDraftInput {
    const parsed = createDraftSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        "بيانات المراسلة غير صالحة",
        formatZodError(parsed.error)
      );
    }

    return parsed.data;
  }

  static validateGeneratePdf(input: unknown): GeneratePdfInput {
    const parsed = generatePdfSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        "معرف المراسلة غير صالح",
        formatZodError(parsed.error)
      );
    }

    return parsed.data;
  }
}
