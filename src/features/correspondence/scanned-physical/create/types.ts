export type CorrespondenceDirection = "INCOMING" | "OUTGOING" | "INTERNAL";

export type CorrespondencePriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type ConfidentialityLevel =
  | "PUBLIC"
  | "INTERNAL"
  | "CONFIDENTIAL"
  | "SECRET"
  | "TOP_SECRET";

export interface ScannedCorrespondenceFormValues {
  file: File | null;
  title: string;
  referenceNumber?: string;
  subject?: string;
  direction: CorrespondenceDirection;
  correspondenceDate?: string;
  priority: CorrespondencePriority;
  confidentiality: ConfidentialityLevel;
  senderDepartmentId?: string;
  receiverDepartmentId?: string;
  senderEntityId?: string;
  receiverEntityId?: string;
  notes?: string;
}

export interface CreateScannedPhysicalPayload {
  file: File;
  title: string;
  referenceNumber?: string;
  subject?: string;
  direction: CorrespondenceDirection;
  correspondenceDate?: string;
  priority?: CorrespondencePriority;
  confidentiality?: ConfidentialityLevel;
  senderDepartmentId?: string;
  receiverDepartmentId?: string;
  senderEntityId?: string;
  receiverEntityId?: string;
  notes?: string;
}

export interface CreatedScannedPhysicalDto {
  correspondenceId: string;
  status: "RECEIVED" | "DRAFT";
  fileId: string;
  purpose: "SCANNED_DOCUMENT";
}

export interface ApiClientErrorShape {
  message: string;
  code?: string;
  status: number;
  details?: Record<string, unknown>;
}

export class ApiClientError extends Error {
  code?: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(shape: ApiClientErrorShape) {
    super(shape.message);
    this.name = "ApiClientError";
    this.code = shape.code;
    this.status = shape.status;
    this.details = shape.details;
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}
