import type { AccountStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";

export class ArchivedCorrespondencePolicy {
  static enforceCanRead(userStatus: AccountStatus): void {
    if (userStatus !== "ACTIVE") {
      throw new AppError("FORBIDDEN", 403, "غير مصرح بهذه العملية");
    }
  }
}
