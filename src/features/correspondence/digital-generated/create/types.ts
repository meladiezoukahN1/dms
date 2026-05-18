export type CorrespondenceDirection = "OUTGOING" | "INTERNAL";

export type CorrespondencePriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type ConfidentialityLevel =
  | "PUBLIC"
  | "INTERNAL"
  | "CONFIDENTIAL"
  | "SECRET"
  | "TOP_SECRET";

export interface DigitalCorrespondenceFormValues {
  title: string;
  referenceNumber?: string;
  subject?: string;
  body?: string;
  direction: CorrespondenceDirection;
  priority: CorrespondencePriority;
  confidentiality: ConfidentialityLevel;
  receiverDepartmentId?: string;
  receiverEntityId?: string;
  correspondenceDate?: string;
  templateId?: string;
  recipientTitle?: string;
  recipientName?: string;
  senderDisplayName?: string;
  receiverDisplayName?: string;
  signatureName?: string;
  signatureTitle?: string;
  footerLocation?: string;
  documentIntro?: string;
  formData?: Record<string, unknown>;
}

export interface CreateDigitalCorrespondencePayload {
  title: string;
  referenceNumber?: string;
  subject?: string;
  body?: string;
  direction: CorrespondenceDirection;
  templateId?: string;
  formData?: Record<string, unknown>;
  priority?: CorrespondencePriority;
  confidentiality?: ConfidentialityLevel;
  correspondenceDate?: string;
  receiverDepartmentId?: string;
  receiverEntityId?: string;
}

export interface CreatedDigitalCorrespondenceDto {
  id: string;
  title: string;
  status: "DRAFT";
  sourceType: "DIGITAL_GENERATED";
  createdAt: string;
}

export interface GenerateDigitalCorrespondencePdfPayload {
  correspondenceId: string;
}

export interface GeneratedDigitalCorrespondencePdfDto {
  correspondenceId: string;
  fileId: string;
  status: "GENERATED";
  generatedAt: string;
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
