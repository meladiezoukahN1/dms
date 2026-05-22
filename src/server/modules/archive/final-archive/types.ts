import type {
  ConfidentialityLevel,
  CorrespondenceDirection,
  CorrespondencePriority,
  CorrespondenceSourceType,
  CorrespondenceStatus,
  FileProvider,
  FilePurpose,
} from "@prisma/client";

export interface FinalArchiveListQuery {
  page: number;
  pageSize: number;
  search?: string;
  sourceType?: Extract<CorrespondenceSourceType, "DIGITAL_GENERATED" | "SCANNED_PHYSICAL">;
  direction?: CorrespondenceDirection;
  priority?: CorrespondencePriority;
  confidentiality?: ConfidentialityLevel;
  dateFrom?: string;
  dateTo?: string;
}

export interface FinalArchiveFileSummary {
  id: string;
  fileId: string;
  purpose: FilePurpose;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  provider: FileProvider;
  previewSupported: boolean;
}

export interface FinalArchiveFileAccess {
  fileId: string;
  storageKey: string;
  url: string | null;
  originalName: string;
  mimeType: string;
}

export interface FinalArchiveUserDto {
  id: string;
  name: string;
  email: string;
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
  files: FinalArchiveFileSummary[];
}

export interface FinalArchiveListOutput {
  items: FinalArchiveItemDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateFinalArchiveInput {
  title?: string;
  referenceNumber?: string | null;
  subject?: string | null;
  direction?: CorrespondenceDirection;
  priority?: CorrespondencePriority;
  confidentiality?: ConfidentialityLevel;
  correspondenceDate?: string | null;
  archiveHandoverNotes?: string | null;
}

export interface UpdateFinalArchiveOutput {
  id: string;
  title: string;
  referenceNumber: string | null;
  subject: string | null;
  sourceType: CorrespondenceSourceType;
  status: CorrespondenceStatus;
  direction: CorrespondenceDirection;
  priority: CorrespondencePriority;
  confidentiality: ConfidentialityLevel;
  correspondenceDate: string | null;
  updatedAt: string;
}

export interface ArchiveCorrespondenceInput {
  archiveCode?: string;
  archiveLocation?: string;
  shelf?: string;
  boxNumber?: string;
  retentionPolicy?: string;
  notes?: string;
}

export interface ArchiveCorrespondenceOutput {
  id: string;
  status: "ARCHIVED";
  archivedAt: string;
  archiveRecordId: string;
}
