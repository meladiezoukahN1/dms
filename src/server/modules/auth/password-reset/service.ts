import { createHash, randomInt } from "node:crypto";
import { hash } from "bcryptjs";
import { emailClient } from "@/lib/email/email-client";
import { AppError } from "@/server/core/errors/app-error";
import { PasswordResetPolicy } from "./policy";
import { PasswordResetRepository } from "./repository";
import { PasswordResetValidator } from "./validator";
import { PasswordResetWorkflow } from "./workflow";
import type { PasswordResetMetadata } from "./types";

const GENERIC_FORGOT_MESSAGE = "إذا كان البريد الإلكتروني مسجلاً فسيتم إرسال رمز إعادة التعيين";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}

export class PasswordResetService {
  static async forgotPassword(payload: unknown, metadata?: PasswordResetMetadata): Promise<{ message: string }> {
    const input = PasswordResetValidator.validateForgotPassword(payload);
    const user = await PasswordResetRepository.findUserByEmail(input.email);

    if (!user || !PasswordResetPolicy.canRequestReset(user.status)) {
      return { message: GENERIC_FORGOT_MESSAGE };
    }

    const otp = generateOtp();
    const otpHash = sha256(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Transaction orchestrated by repository
    await PasswordResetRepository.executeForgotPasswordTransaction(user.id, otpHash, expiresAt, metadata);

    await emailClient.send({
      to: user.email,
      subject: "رمز إعادة تعيين كلمة المرور",
      html: `<p>رمز إعادة التعيين الخاص بك هو: <strong>${otp}</strong></p><p>ينتهي خلال 10 دقائق.</p>`,
    });

    return { message: GENERIC_FORGOT_MESSAGE };
  }

  static async verifyResetOtp(payload: unknown): Promise<{ valid: boolean }> {
    const input = PasswordResetValidator.validateVerifyOtp(payload);
    const user = await PasswordResetRepository.findUserByEmail(input.email);

    if (!user) {
      return { valid: false };
    }

    const token = await PasswordResetRepository.findLatestToken(user.id);
    if (!token) {
      return { valid: false };
    }

    const now = new Date();
    const isMatch = token.otpHash === sha256(input.otp);

    if (!isMatch) {
      return { valid: false };
    }

    try {
      PasswordResetWorkflow.assertTokenUsable(token, now);
      return { valid: true };
    } catch {
      return { valid: false };
    }
  }

  static async resetPassword(payload: unknown, metadata?: PasswordResetMetadata): Promise<{ message: string }> {
    const input = PasswordResetValidator.validateResetPassword(payload);
    const user = await PasswordResetRepository.findUserByEmail(input.email);

    if (!user) {
      throw new AppError("INVALID_RESET_TOKEN", 400, "رمز إعادة التعيين غير صالح أو منتهي");
    }

    const token = await PasswordResetRepository.findLatestToken(user.id);

    if (!token || token.otpHash !== sha256(input.otp)) {
      throw new AppError("INVALID_RESET_TOKEN", 400, "رمز إعادة التعيين غير صالح أو منتهي");
    }

    PasswordResetWorkflow.assertTokenUsable(token, new Date());
    const newPasswordHash = await hash(input.password, 12);

    // Transaction orchestrated by repository
    await PasswordResetRepository.executeResetPasswordTransaction(user.id, token.id, newPasswordHash, metadata);

    return { message: "تم تحديث كلمة المرور بنجاح" };
  }
}
