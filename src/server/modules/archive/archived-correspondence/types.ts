import type {
  ConfidentialityLevel,
  CorrespondenceDirection,
  CorrespondencePriority,
  CorrespondenceSourceType,
  FilePurpose,
  FileProvider,
} from "@prisma/client";

export interface ArchivedCorrespondenceListQuery {
  page: number;
  pageSize: number;
  search?: string;
  sourceType?: Extract<CorrespondenceSourceType, "DIGITAL_GENERATED" | "SCANNED_PHYSICAL">;
  direction?: CorrespondenceDirection;
  priority?: CorrespondencePriority;
  confidentiality?: ConfidentialityLevel;
  dateFrom?: string;
  dateTo?: string;
  archiveDateFrom?: string;
  archiveDateTo?: string;
}

export interface ArchivedCorrespondenceListItemDto {
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

export interface ArchivedCorrespondenceListOutput {
  items: ArchivedCorrespondenceListItemDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ArchivedCorrespondenceFileDto {
  id: string;
  purpose: FilePurpose;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  provider: FileProvider;
  previewSupported: boolean;
}

export interface ArchivedCorrespondenceDetailOutput {
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
  files: ArchivedCorrespondenceFileDto[];
}

export interface ArchivedCorrespondenceFileAccess {
  fileId: string;
  storageKey: string;
  url: string | null;
  originalName: string;
  mimeType: string;
}
