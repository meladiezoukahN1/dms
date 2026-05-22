import type { AccountStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";

export class ScannedPhysicalPolicy {
  static canCreateIntake(userStatus: AccountStatus): boolean {
    return userStatus === "ACTIVE";
  }

  static enforceCanCreateIntake(userStatus: AccountStatus): void {
    if (!this.canCreateIntake(userStatus)) {
      throw new AppError("FORBIDDEN", 403, "لا يمكن إنشاء مراسلة ممسوحة بحالتك الحالية");
    }
  }
}
