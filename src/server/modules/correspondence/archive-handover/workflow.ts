import type { CorrespondenceSourceType, CorrespondenceStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";

export class ArchiveHandoverWorkflow {
  static isEligible(sourceType: CorrespondenceSourceType, status: CorrespondenceStatus): boolean {
    return (
      (sourceType === "DIGITAL_GENERATED" && status === "GENERATED") ||
      (sourceType === "SCANNED_PHYSICAL" && status === "RECEIVED")
    );
  }

  static enforceEligible(sourceType: CorrespondenceSourceType, status: CorrespondenceStatus): void {
    if (!this.isEligible(sourceType, status)) {
      throw new AppError("INELIGIBLE_STATUS", 400, "المراسلة غير مؤهلة للإحالة للأرشفة");
    }
  }

  static getArchiveHandoverStatus(): CorrespondenceStatus {
    return "ARCHIVE_PENDING";
  }

  static enforceArchiveHandoverStatusAvailable(): void {
    if (!this.getArchiveHandoverStatus()) {
      throw new AppError(
        "ARCHIVE_HANDOVER_STATUS_REQUIRED",
        409,
        "لا توجد حالة آمنة للإحالة للأرشفة في المخطط الحالي"
      );
    }
  }
}
