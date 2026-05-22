import type {
  ConfidentialityLevel,
  CorrespondenceDirection,
  CorrespondencePriority,
  CorrespondenceStatus,
  FilePurpose,
  FileVisibility,
} from "@prisma/client";

export interface CreateScannedPhysicalInput {
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

export interface UploadedScannedFile {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface CreateScannedPhysicalOutput {
  correspondenceId: string;
  status: CorrespondenceStatus;
  fileId: string;
  purpose: FilePurpose;
}

export interface CreateScannedPhysicalResult {
  correspondenceId: string;
  status: CorrespondenceStatus;
  fileId: string;
  purpose: FilePurpose;
  visibility: FileVisibility;
}

export interface UploadedBlobMetadata {
  url: string;
  pathname: string;
  storageKey: string;
  contentType: string;
  sizeBytes: number;
  provider: "VERCEL_BLOB";
}
