import type { AccountStatus } from "@prisma/client";

export class CredentialsPolicy {
  static canLogin(status: AccountStatus): boolean {
    return status === "ACTIVE";
  }
}
