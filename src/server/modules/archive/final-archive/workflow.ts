import type { CorrespondenceStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";

export class FinalArchiveWorkflow {
  /**
   * Enforce that only ARCHIVE_PENDING records are eligible for final archiving.
   * Do not accept ARCHIVED or any other status.
   */
  static enforceArchivePendingStatus(status: CorrespondenceStatus): void {
    if (status !== "ARCHIVE_PENDING") {
      throw new AppError(
        "INVALID_STATUS",
        400,
        "فقط المراسلات ذات حالة 'إحالة للأرشفة' مؤهلة للأرشفة النهائية"
      );
    }
  }

  /**
   * Enforce that files exist
   */
  static enforceHasFiles(fileCount: number): void {
    if (fileCount === 0) {
      throw new AppError("FILES_REQUIRED", 400, "لا يمكن أرشفة مراسلة دون ملفات");
    }
  }

  /**
   * Enforce that handover information exists
   */
  static enforceHandoverExists(handoverId: string | null, handoverAt: Date | null): void {
    if (!handoverId || !handoverAt) {
      throw new AppError(
        "HANDOVER_REQUIRED",
        400,
        "المراسلة يجب أن تكون قد تمت إحالتها للأرشفة أولاً"
      );
    }
  }

  /**
   * Get the archive-to-archive status value for creating archive.
   */
  static getArchiveStatus(): "ARCHIVED" {
    return "ARCHIVED";
  }
}
