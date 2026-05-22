import { z } from "zod";

const MAX_CLIENT_FILE_SIZE = 15 * 1024 * 1024;

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const scannedPhysicalFormSchema = z.object({
  file: z
    .instanceof(File, { message: "ملف المراسلة الممسوحة مطلوب" })
    .refine((file) => file.size > 0, "الملف المرفوع فارغ")
    .refine((file) => allowedMimeTypes.includes(file.type as (typeof allowedMimeTypes)[number]), "نوع الملف غير مدعوم")
    .refine((file) => file.size <= MAX_CLIENT_FILE_SIZE, "حجم الملف يتجاوز الحد المسموح (15MB)"),
  title: z.string().trim().min(3, "العنوان مطلوب ويجب أن لا يقل عن 3 أحرف").max(500, "العنوان طويل جداً"),
  referenceNumber: z.string().max(100, "الرقم الإشاري طويل جداً").optional(),
  subject: z.string().max(500, "الموضوع طويل جداً").optional(),
  direction: z.enum(["INCOMING", "OUTGOING", "INTERNAL"] as const),
  correspondenceDate: z.string().optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"] as const),
  confidentiality: z.enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET", "TOP_SECRET"] as const),
  senderDepartmentId: z.string().optional(),
  receiverDepartmentId: z.string().optional(),
  senderEntityId: z.string().optional(),
  receiverEntityId: z.string().optional(),
  notes: z.string().max(5000, "الملاحظات طويلة جداً").optional(),
});

export type ScannedPhysicalFormSchemaType = z.infer<typeof scannedPhysicalFormSchema>;
