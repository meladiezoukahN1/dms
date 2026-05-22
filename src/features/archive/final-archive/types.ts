export type CorrespondenceSourceType = "DIGITAL_GENERATED" | "SCANNED_PHYSICAL";
export type CorrespondenceDirection = "INCOMING" | "OUTGOING" | "INTERNAL";
export type CorrespondencePriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type ConfidentialityLevel =
  | "PUBLIC"
  | "INTERNAL"
  | "CONFIDENTIAL"
  | "SECRET"
  | "TOP_SECRET";

export interface FinalArchiveUserDto {
  id: string;
  name: string;
  email: string;
}

export interface FinalArchiveFileDto {
  id: string;
  fileId: string;
  purpose: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  provider: string;
  previewSupported: boolean;
}

export interface FinalArchiveItemDto {
  id: string;
  title: string;
  referenceNumber: string | null;
  subject: string | null;
  sourceType: CorrespondenceSourceType;
  direction: CorrespondenceDirection;
  priority: CorrespondencePriority;
  confidentiality: ConfidentialityLevel;
  correspondenceDate: string | null;
  createdAt: string;
  createdBy: FinalArchiveUserDto;
  archiveHandoverBy: FinalArchiveUserDto | null;
  archiveHandoverAt: string | null;
  archiveHandoverNotes: string | null;
  files: FinalArchiveFileDto[];
}

export interface FinalArchiveListResponseDto {
  items: FinalArchiveItemDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface FinalArchiveQueryState {
  page: number;
  pageSize: number;
  search?: string;
  sourceType?: CorrespondenceSourceType;
  direction?: CorrespondenceDirection;
  priority?: CorrespondencePriority;
  confidentiality?: ConfidentialityLevel;
  dateFrom?: string;
  dateTo?: string;
}

export interface UpdateFinalArchivePayload {
  title?: string;
  referenceNumber?: string | null;
  subject?: string | null;
  direction?: CorrespondenceDirection;
  priority?: CorrespondencePriority;
  confidentiality?: ConfidentialityLevel;
  correspondenceDate?: string | null;
  archiveHandoverNotes?: string | null;
}

export interface UpdateFinalArchiveResponseDto {
  id: string;
  title: string;
  referenceNumber: string | null;
  subject: string | null;
  sourceType: string;
  direction: string;
  priority: string;
  confidentiality: string;
  correspondenceDate: string | null;
  updatedAt: string;
}

export interface ArchiveCorrespondencePayload {
  archiveCode?: string;
  archiveLocation?: string;
  shelf?: string;
  boxNumber?: string;
  retentionPolicy?: string;
  notes?: string;
}

export interface ArchiveCorrespondenceResponseDto {
  id: string;
  status: "ARCHIVED";
  archivedAt: string;
  archiveRecordId: string;
}
