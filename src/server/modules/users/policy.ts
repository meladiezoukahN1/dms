import type { AccountStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";
import { ForbiddenError } from "@/server/core/errors/forbidden-error";

export class UsersPolicy {
  static enforceAuthenticated(userId: string | null): asserts userId is string {
    if (!userId) {
      throw new AppError("UNAUTHORIZED", 401, "يجب تسجيل الدخول أولاً");
    }
  }

  static enforceActiveUser(status: AccountStatus): void {
    if (status !== "ACTIVE") {
      throw new ForbiddenError("الحساب غير نشط");
    }
  }

  static enforceIsAdmin(accountType: string | null): void {
    if (accountType !== "admin") {
      throw new ForbiddenError("هذه العملية متاحة للمديرين فقط");
    }
  }
}
