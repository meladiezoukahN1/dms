import type {
  ConfidentialityLevel,
  CorrespondenceDirection,
  CorrespondencePriority,
  CorrespondenceSourceType,
  CorrespondenceStatus,
  FileProvider,
  FilePurpose,
} from "@prisma/client";

export interface ArchiveHandoverListQuery {
  page: number;
  pageSize: number;
  search?: string;
  sourceType?: Extract<CorrespondenceSourceType, "DIGITAL_GENERATED" | "SCANNED_PHYSICAL">;
  status?: Extract<CorrespondenceStatus, "GENERATED" | "RECEIVED" | "ARCHIVE_PENDING">;
  direction?: CorrespondenceDirection;
  priority?: CorrespondencePriority;
  confidentiality?: ConfidentialityLevel;
  dateFrom?: string;
  dateTo?: string;
}

export interface ArchiveHandoverFileSummary {
  id: string;
  fileId: string;
  purpose: FilePurpose;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  provider: FileProvider;
  urlAvailable: boolean;
  safeUrl: string | null;
}

export interface ArchiveHandoverUserDto {
  id: string;
  name: string;
  email: string;
}

export interface ArchiveHandoverItemDto {
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
  createdAt: string;
  createdBy: ArchiveHandoverUserDto;
  handedOverBy: ArchiveHandoverUserDto | null;
  handedOverAt: string | null;
  archiveHandoverNotes: string | null;
  files: ArchiveHandoverFileSummary[];
}

export interface ArchiveHandoverListOutput {
  items: ArchiveHandoverItemDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateArchiveHandoverInput {
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

export interface UpdateArchiveHandoverOutput {
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

export interface SendToArchiveInput {
  targetDepartmentId?: string;
  notes?: string;
}

export interface SendToArchiveOutput {
  id: string;
  status: "ARCHIVE_PENDING";
  archiveHandoverAt: string;
  archiveHandoverBy: ArchiveHandoverUserDto;
  archiveHandoverNotes: string | null;
}

export interface ArchiveHandoverFileAccess {
  fileId: string;
  storageKey: string;
  url: string | null;
  originalName: string;
  mimeType: string;
}
