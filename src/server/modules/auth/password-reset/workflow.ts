import { AppError } from "@/server/core/errors/app-error";
import type { PasswordResetTokenRecord } from "./types";

export class PasswordResetWorkflow {
  static assertTokenUsable(token: PasswordResetTokenRecord, now: Date): void {
    if (token.usedAt) {
      throw new AppError("INVALID_RESET_TOKEN", 400, "رمز إعادة التعيين غير صالح");
    }

    if (token.expiresAt.getTime() <= now.getTime()) {
      throw new AppError("INVALID_RESET_TOKEN", 400, "رمز إعادة التعيين منتهي الصلاحية");
    }
  }
}
