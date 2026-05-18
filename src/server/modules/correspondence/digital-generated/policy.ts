import type { AccountStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";

export class DigitalGeneratedPolicy {
  /**
   * Check if user can create DIGITAL_GENERATED correspondence
   */
  static canCreateDraft(userStatus: AccountStatus): boolean {
    // Only ACTIVE users can create correspondence
    return userStatus === "ACTIVE";
  }

  /**
   * Check if user can generate PDF (currently only creator can)
   */
  static canGeneratePdf(
    userStatus: AccountStatus,
    correspondenceCreatedById: string,
    currentUserId: string
  ): boolean {
    if (userStatus !== "ACTIVE") {
      return false;
    }

    // Creator can generate PDF
    return correspondenceCreatedById === currentUserId;
  }

  /**
   * Enforce policy or throw error
   */
  static enforceCanCreateDraft(userStatus: AccountStatus): void {
    if (!this.canCreateDraft(userStatus)) {
      throw new AppError(
        "FORBIDDEN",
        403,
        "لا يمكن إنشاء مراسلة بحالتك الحالية"
      );
    }
  }

  static enforceCanGeneratePdf(
    userStatus: AccountStatus,
    correspondenceCreatedById: string,
    currentUserId: string
  ): void {
    if (!this.canGeneratePdf(userStatus, correspondenceCreatedById, currentUserId)) {
      throw new AppError(
        "FORBIDDEN",
        403,
        "لا يمكنك توليد PDF لهذه المراسلة"
      );
    }
  }
}
