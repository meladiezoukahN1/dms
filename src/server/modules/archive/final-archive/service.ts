import type { AccountStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";
import { FinalArchivePolicy } from "./policy";
import { FinalArchiveRepository } from "./repository";
import { FinalArchiveValidator } from "./validator";
import { FinalArchiveWorkflow } from "./workflow";
import type {
  FinalArchiveFileAccess,
  FinalArchiveListOutput,
  ArchiveCorrespondenceOutput,
  UpdateFinalArchiveOutput,
} from "./types";

interface RequestMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export class FinalArchiveService {
  static async list(
    rawQuery: unknown,
    userStatus: AccountStatus
  ): Promise<FinalArchiveListOutput> {
    FinalArchivePolicy.enforceCanRead(userStatus);
    const query = FinalArchiveValidator.validateListQuery(rawQuery);
    return FinalArchiveRepository.getList(query);
  }

  static async updateMetadata(
    id: string,
    rawInput: unknown,
    currentUserId: string,
    userStatus: AccountStatus,
    metadata?: RequestMetadata
  ): Promise<UpdateFinalArchiveOutput> {
    FinalArchivePolicy.enforceCanEdit(userStatus);

    const existing = await FinalArchiveRepository.findById(id);
    if (!existing) {
      throw new AppError("NOT_FOUND", 404, "المراسلة غير موجودة");
    }

    // Verify eligible for final archive (ARCHIVE_PENDING only)
    FinalArchiveWorkflow.enforceArchivePendingStatus(existing.status);

    const input = FinalArchiveValidator.validateUpdateInput(rawInput);
    return FinalArchiveRepository.updateMetadata(id, input, currentUserId, metadata);
  }

  static async archiveCorrespondence(
    id: string,
    rawInput: unknown,
    currentUserId: string,
    userStatus: AccountStatus,
    metadata?: RequestMetadata
  ): Promise<ArchiveCorrespondenceOutput> {
    FinalArchivePolicy.enforceCanArchive(userStatus);

    const correspondence = await FinalArchiveRepository.findById(id);
    if (!correspondence) {
      throw new AppError("NOT_FOUND", 404, "المراسلة غير موجودة");
    }

    // Verify eligible for final archive (ARCHIVE_PENDING only)
    FinalArchiveWorkflow.enforceArchivePendingStatus(correspondence.status);

    // Verify files exist
    FinalArchiveWorkflow.enforceHasFiles(correspondence.filesCount);

    // Verify handover exists
    FinalArchiveWorkflow.enforceHandoverExists(
      correspondence.archiveHandoverById,
      correspondence.archiveHandoverAt
    );

    const input = FinalArchiveValidator.validateArchiveInput(rawInput);

    return FinalArchiveRepository.archiveCorrespondence(id, input, currentUserId, metadata);
  }

  static async getPreviewFileAccess(
    fileId: string,
    userStatus: AccountStatus
  ): Promise<FinalArchiveFileAccess> {
    FinalArchivePolicy.enforceCanRead(userStatus);

    const file = await FinalArchiveRepository.getArchivePendingFileAccess(fileId);
    if (!file) {
      throw new AppError("NOT_FOUND", 404, "الملف غير موجود");
    }

    FinalArchiveValidator.enforcePreviewSupported(file.mimeType);
    return file;
  }

  static async getDownloadFileAccess(
    fileId: string,
    userStatus: AccountStatus
  ): Promise<FinalArchiveFileAccess> {
    FinalArchivePolicy.enforceCanRead(userStatus);

    const file = await FinalArchiveRepository.getArchivePendingFileAccess(fileId);
    if (!file) {
      throw new AppError("NOT_FOUND", 404, "الملف غير موجود");
    }

    return file;
  }
}
