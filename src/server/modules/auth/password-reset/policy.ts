import type { AccountStatus } from "@prisma/client";

export class PasswordResetPolicy {
  static canRequestReset(status: AccountStatus): boolean {
    return status === "ACTIVE";
  }
}
