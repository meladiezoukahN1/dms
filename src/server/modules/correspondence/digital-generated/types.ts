/**
 * Types for DIGITAL_GENERATED correspondence feature
 */

export interface CreateDraftInput {
  title: string;
  referenceNumber?: string;
  subject?: string;
  body?: string;
  direction: "OUTGOING" | "INTERNAL";
  templateId?: string;
  formData?: Record<string, unknown>;
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  confidentiality?: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "SECRET" | "TOP_SECRET";
  correspondenceDate?: string;
  senderDepartmentId?: string;
  receiverDepartmentId?: string;
  senderEntityId?: string;
  receiverEntityId?: string;
}

export interface CreateDraftOutput {
  id: string;
  title: string;
  status: "DRAFT";
  sourceType: "DIGITAL_GENERATED";
  createdAt: string;
}

export interface GeneratePdfInput {
  correspondenceId: string;
}

export interface GeneratePdfOutput {
  correspondenceId: string;
  fileId: string;
  status: "GENERATED";
  generatedAt: string;
}

/**
 * Internal types
 */
export interface CorrespondenceDraftRecord {
  id: string;
  createdById: string;
}

export interface CorrespondenceWithFiles {
  id: string;
  title: string;
  status: string;
  sourceType: string;
}
