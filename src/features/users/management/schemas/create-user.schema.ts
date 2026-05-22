import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().min(2, "الاسم الكامل مطلوب (حرفان على الأقل)"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم"),
  accountType: z.enum(["admin", "staff"] as const),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
