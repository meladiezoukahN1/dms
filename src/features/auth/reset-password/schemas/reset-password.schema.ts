import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  otp: z.string().regex(/^\d{6}$/, "رمز التحقق يجب أن يكون 6 أرقام"),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email("البريد الإلكتروني غير صالح"),
    otp: z.string().regex(/^\d{6}$/, "رمز التحقق يجب أن يكون 6 أرقام"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير")
      .regex(/[a-z]/, "يجب أن تحتوي كلمة المرور على حرف صغير")
      .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم")
      .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي كلمة المرور على رمز خاص"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "تأكيد كلمة المرور غير مطابق",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
