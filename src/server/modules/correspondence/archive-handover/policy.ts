import type { AccountStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";

export class ArchiveHandoverPolicy {
  static enforceAuthenticatedActiveUser(userStatus: AccountStatus): void {
    if (userStatus !== "ACTIVE") {
      throw new AppError("FORBIDDEN", 403, "غير مصرح بهذه العملية");
    }
  }

  static enforceCanRead(userStatus: AccountStatus): void {
    this.enforceAuthenticatedActiveUser(userStatus);
    // TODO: integrate explicit permissions once centralized permission constants are enabled.
  }

  static enforceCanEdit(userStatus: AccountStatus): void {
    this.enforceAuthenticatedActiveUser(userStatus);
    // TODO: integrate explicit permissions once centralized permission constants are enabled.
  }

  static enforceCanSend(userStatus: AccountStatus): void {
    this.enforceAuthenticatedActiveUser(userStatus);
    // TODO: integrate explicit permissions once centralized permission constants are enabled.
  }
}
