import { z } from "zod";

export const archiveHandoverQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
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

export const updateArchiveHandoverSchema = z
  .object({
    title: z.string().trim().min(3, "العنوان مطلوب").max(500, "العنوان طويل جدًا"),
    referenceNumber: z.string().trim().max(100, "الرقم الإشاري طويل جدًا").optional().or(z.literal("")),
    subject: z.string().trim().max(500, "الموضوع طويل جدًا").optional().or(z.literal("")),
    direction: z.enum(["INCOMING", "OUTGOING", "INTERNAL"] as const),
    priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"] as const),
    confidentiality: z.enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET", "TOP_SECRET"] as const),
    correspondenceDate: z.string().trim().optional().or(z.literal("")),
    senderDepartmentId: z.string().trim().optional().or(z.literal("")),
    receiverDepartmentId: z.string().trim().optional().or(z.literal("")),
    senderEntityId: z.string().trim().optional().or(z.literal("")),
    receiverEntityId: z.string().trim().optional().or(z.literal("")),
    notes: z.string().trim().max(5000, "الملاحظات طويلة جدًا").optional().or(z.literal("")),
  })
  .strict();

export type ArchiveHandoverQuerySchemaType = z.infer<typeof archiveHandoverQuerySchema>;
export type UpdateArchiveHandoverSchemaType = z.infer<typeof updateArchiveHandoverSchema>;
