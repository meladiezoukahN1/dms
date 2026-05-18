import { z } from "zod";

export const digitalGeneratedFormSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب").max(500, "العنوان طويل جداً"),
  referenceNumber: z.string().max(100, "الرقم الإشاري طويل جداً").optional(),
  subject: z.string().max(500, "الموضوع طويل جداً").optional(),
  body: z.string().optional(),
  direction: z.enum(["OUTGOING", "INTERNAL"] as const),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"] as const),
  confidentiality: z.enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET", "TOP_SECRET"] as const),
  receiverDepartmentId: z.string().optional(),
  receiverEntityId: z.string().optional(),
  correspondenceDate: z.string().optional(),
  templateId: z.string().optional(),
  recipientTitle: z.string().max(100, "صفة المخاطب طويلة جداً").optional(),
  recipientName: z.string().max(200, "اسم المخاطب طويل جداً").optional(),
  senderDisplayName: z.string().max(200, "بيانات المرسل طويلة جداً").optional(),
  receiverDisplayName: z.string().max(200, "بيانات الجهة المستقبلة طويلة جداً").optional(),
  signatureName: z.string().max(200, "اسم التوقيع طويل جداً").optional(),
  signatureTitle: z.string().max(200, "صفة التوقيع طويلة جداً").optional(),
  footerLocation: z.string().max(250, "تذييل الموقع طويل جداً").optional(),
  documentIntro: z.string().max(500, "مقدمة الخطاب طويلة جداً").optional(),
  formData: z.record(z.string(), z.unknown()).optional(),
});

export type DigitalGeneratedFormSchemaType = z.infer<typeof digitalGeneratedFormSchema>;
