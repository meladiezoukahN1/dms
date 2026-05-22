import type { CorrespondenceStatus } from "@prisma/client";

/**
 * Intake workflow for scanned correspondence.
 * In this phase: initial state is RECEIVED.
 * Fallback to DRAFT is only for projects lacking RECEIVED enum.
 */
export class ScannedPhysicalWorkflow {
  static getInitialStatus(): CorrespondenceStatus {
    return "RECEIVED";
  }
}
