export type CorrespondenceSourceType = "DIGITAL_GENERATED" | "SCANNED_PHYSICAL";
export type EligibleCorrespondenceStatus = "GENERATED" | "RECEIVED" | "ARCHIVE_PENDING";
export type CorrespondenceDirection = "INCOMING" | "OUTGOING" | "INTERNAL";
export type CorrespondencePriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type ConfidentialityLevel =
  | "PUBLIC"
  | "INTERNAL"
  | "CONFIDENTIAL"
  | "SECRET"
  | "TOP_SECRET";

export interface ArchiveHandoverUserDto {
  id: string;
  name: string;
  email: string;
}

export interface ArchiveHandoverFileDto {
  id: string;
  fileId: string;
  purpose: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  provider: string;
  urlAvailable: boolean;
  safeUrl: string | null;
  previewSupported: boolean;
}

export interface ArchiveHandoverItemDto {
  id: string;
  title: string;
  referenceNumber: string | null;
  subject: string | null;
  sourceType: CorrespondenceSourceType;
  status: EligibleCorrespondenceStatus;
  direction: CorrespondenceDirection;
  priority: CorrespondencePriority;
  confidentiality: ConfidentialityLevel;
  correspondenceDate: string | null;
  createdAt: string;
  createdBy: ArchiveHandoverUserDto;
  handedOverBy: ArchiveHandoverUserDto | null;
  handedOverAt: string | null;
  archiveHandoverNotes: string | null;
  files: ArchiveHandoverFileDto[];
}

export interface ArchiveHandoverListResponseDto {
  items: ArchiveHandoverItemDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ArchiveHandoverQueryState {
  page: number;
  pageSize: number;
  search?: string;
  sourceType?: CorrespondenceSourceType;
  status?: EligibleCorrespondenceStatus;
  direction?: CorrespondenceDirection;
  priority?: CorrespondencePriority;
  confidentiality?: ConfidentialityLevel;
  dateFrom?: string;
  dateTo?: string;
}

export interface UpdateArchiveHandoverPayload {
  title?: string;
  referenceNumber?: string | null;
  subject?: string | null;
  direction?: CorrespondenceDirection;
  priority?: CorrespondencePriority;
  confidentiality?: ConfidentialityLevel;
  correspondenceDate?: string | null;
  senderDepartmentId?: string | null;
  receiverDepartmentId?: string | null;
  senderEntityId?: string | null;
  receiverEntityId?: string | null;
  notes?: string | null;
  formData?: Record<string, unknown>;
}

export interface UpdateArchiveHandoverResponseDto {
  id: string;
  title: string;
  referenceNumber: string | null;
  subject: string | null;
  sourceType: string;
  status: string;
  direction: string;
  priority: string;
  confidentiality: string;
  correspondenceDate: string | null;
  updatedAt: string;
}

export interface SendToArchivePayload {
  targetDepartmentId?: string;
  notes?: string;
}

export interface SendToArchiveResponseDto {
  id: string;
  status: "ARCHIVE_PENDING";
  archiveHandoverAt: string;
  archiveHandoverBy: ArchiveHandoverUserDto;
  archiveHandoverNotes: string | null;
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
