import type { CorrespondenceStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";

/**
 * Correspondence state machine for DIGITAL_GENERATED workflow
 * 
 * Workflow: DRAFT → GENERATED
 * 
 * DRAFT: Initial state after creation
 * GENERATED: PDF has been generated; ready for further processing (future phases)
 */
export class DigitalGeneratedWorkflow {
  /**
   * Check if transition is allowed
   */
  static isValidTransition(
    currentStatus: CorrespondenceStatus,
    targetStatus: CorrespondenceStatus
  ): boolean {
    // DRAFT → GENERATED allowed
    if (currentStatus === "DRAFT" && targetStatus === "GENERATED") {
      return true;
    }

    // No other transitions allowed in this phase
    return false;
  }

  /**
   * Enforce transition or throw error
   */
  static enforceTransition(
    currentStatus: CorrespondenceStatus,
    targetStatus: CorrespondenceStatus
  ): void {
    if (!this.isValidTransition(currentStatus, targetStatus)) {
      throw new AppError(
        "INVALID_TRANSITION",
        400,
        `لا يمكن الانتقال من ${currentStatus} إلى ${targetStatus}`
      );
    }
  }

  /**
   * Get next valid state
   */
  static getNextState(currentStatus: CorrespondenceStatus): CorrespondenceStatus | null {
    if (currentStatus === "DRAFT") {
      return "GENERATED";
    }

    return null;
  }
}
