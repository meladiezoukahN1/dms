import { z } from "zod";
import { ValidationError } from "@/server/core/errors/validation-error";
import { formatZodError } from "@/server/core/errors/format-zod-error";
import type { ForgotPasswordInput, ResetPasswordInput, VerifyResetOtpInput } from "./types";

const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

const verifyResetOtpSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  otp: z.string().regex(/^\d{6}$/, "رمز التحقق يجب أن يكون 6 أرقام"),
});

const resetPasswordSchema = z
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

export class PasswordResetValidator {
  static validateForgotPassword(input: unknown): ForgotPasswordInput {
    const parsed = forgotPasswordSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError("بيانات غير صالحة", formatZodError(parsed.error));
    }

    return { email: parsed.data.email.trim().toLowerCase() };
  }

  static validateVerifyOtp(input: unknown): VerifyResetOtpInput {
    const parsed = verifyResetOtpSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError("بيانات غير صالحة", formatZodError(parsed.error));
    }

    return {
      email: parsed.data.email.trim().toLowerCase(),
      otp: parsed.data.otp,
    };
  }

  static validateResetPassword(input: unknown): ResetPasswordInput {
    const parsed = resetPasswordSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError("بيانات غير صالحة", formatZodError(parsed.error));
    }

    return {
      email: parsed.data.email.trim().toLowerCase(),
      otp: parsed.data.otp,
      password: parsed.data.password,
      confirmPassword: parsed.data.confirmPassword,
    };
  }
}
