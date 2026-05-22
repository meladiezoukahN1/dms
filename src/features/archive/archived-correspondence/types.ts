export type CorrespondenceSourceType = "DIGITAL_GENERATED" | "SCANNED_PHYSICAL";
export type CorrespondenceDirection = "INCOMING" | "OUTGOING" | "INTERNAL";
export type CorrespondencePriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type ConfidentialityLevel =
  | "PUBLIC"
  | "INTERNAL"
  | "CONFIDENTIAL"
  | "SECRET"
  | "TOP_SECRET";

export interface ArchivedCorrespondenceListItem {
  id: string;
  title: string;
  referenceNumber: string | null;
  sourceType: CorrespondenceSourceType;
  direction: CorrespondenceDirection;
  priority: CorrespondencePriority;
  confidentiality: ConfidentialityLevel;
  correspondenceDate: string | null;
  archivedAt: string | null;
  createdAt: string;
  createdByName: string;
  archiveRecordId: string | null;
  archiveNumber: string | null;
}

export interface ArchivedCorrespondenceFile {
  id: string;
  purpose: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  provider: string;
  previewSupported: boolean;
}

export interface ArchivedCorrespondenceDetail {
  id: string;
  title: string;
  referenceNumber: string | null;
  subject: string | null;
  sourceType: CorrespondenceSourceType;
  direction: CorrespondenceDirection;
  priority: CorrespondencePriority;
  confidentiality: ConfidentialityLevel;
  correspondenceDate: string | null;
  archivedAt: string | null;
  createdAt: string;
  createdByName: string;
  archiveRecordId: string | null;
  archiveNumber: string | null;
  files: ArchivedCorrespondenceFile[];
}

export interface ArchivedCorrespondenceListResponse {
  items: ArchivedCorrespondenceListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ArchivedCorrespondenceQueryState {
  page: number;
  pageSize: number;
  search?: string;
  sourceType?: CorrespondenceSourceType;
  direction?: CorrespondenceDirection;
  priority?: CorrespondencePriority;
  confidentiality?: ConfidentialityLevel;
  dateFrom?: string;
  dateTo?: string;
  archiveDateFrom?: string;
  archiveDateTo?: string;
}
