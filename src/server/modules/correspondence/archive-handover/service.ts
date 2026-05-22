import type { AccountStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";
import { ArchiveHandoverPolicy } from "./policy";
import { ArchiveHandoverRepository } from "./repository";
import { ArchiveHandoverValidator } from "./validator";
import { ArchiveHandoverWorkflow } from "./workflow";
import type {
  ArchiveHandoverListOutput,
  ArchiveHandoverFileAccess,
  SendToArchiveOutput,
  UpdateArchiveHandoverOutput,
} from "./types";

interface RequestMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export class ArchiveHandoverService {
  static async list(
    rawQuery: unknown,
    userStatus: AccountStatus
  ): Promise<ArchiveHandoverListOutput> {
    ArchiveHandoverPolicy.enforceCanRead(userStatus);
    const query = ArchiveHandoverValidator.validateListQuery(rawQuery);
    return ArchiveHandoverRepository.getList(query);
  }

  static async updateMetadata(
    id: string,
    rawInput: unknown,
    currentUserId: string,
    userStatus: AccountStatus,
    metadata?: RequestMetadata
  ): Promise<UpdateArchiveHandoverOutput> {
    ArchiveHandoverPolicy.enforceCanEdit(userStatus);

    const existing = await ArchiveHandoverRepository.findById(id);
    if (!existing) {
      throw new AppError("NOT_FOUND", 404, "المراسلة غير موجودة");
    }

    ArchiveHandoverWorkflow.enforceEligible(existing.sourceType, existing.status);

    const input = ArchiveHandoverValidator.validateUpdateInput(rawInput);
    return ArchiveHandoverRepository.updateMetadata(id, input, currentUserId, metadata);
  }

  static async sendToArchive(
    id: string,
    rawInput: unknown,
    currentUserId: string,
    userStatus: AccountStatus,
    metadata?: RequestMetadata
  ): Promise<SendToArchiveOutput> {
    ArchiveHandoverPolicy.enforceCanSend(userStatus);

    const correspondence = await ArchiveHandoverRepository.findById(id);
    if (!correspondence) {
      throw new AppError("NOT_FOUND", 404, "المراسلة غير موجودة");
    }

    ArchiveHandoverWorkflow.enforceEligible(correspondence.sourceType, correspondence.status);

    const input = ArchiveHandoverValidator.validateSendInput(rawInput);

    const hasFiles = await ArchiveHandoverRepository.hasAtLeastOneFile(id);
    if (!hasFiles) {
      throw new AppError("FILES_REQUIRED", 400, "لا يمكن الإحالة دون ملفات مرتبطة");
    }

    const handoverStatus = ArchiveHandoverWorkflow.getArchiveHandoverStatus();
    ArchiveHandoverWorkflow.enforceArchiveHandoverStatusAvailable();

    return ArchiveHandoverRepository.sendToArchive(
      id,
      input,
      currentUserId,
      handoverStatus,
      metadata
    );
  }

  static async getPreviewFileAccess(
    fileId: string,
    userStatus: AccountStatus
  ): Promise<ArchiveHandoverFileAccess> {
    ArchiveHandoverPolicy.enforceCanRead(userStatus);

    const file = await ArchiveHandoverRepository.getEligibleFileAccess(fileId);
    if (!file) {
      throw new AppError("NOT_FOUND", 404, "الملف غير موجود");
    }

    ArchiveHandoverValidator.enforcePreviewSupported(file.mimeType);
    return file;
  }

  static async getDownloadFileAccess(
    fileId: string,
    userStatus: AccountStatus
  ): Promise<ArchiveHandoverFileAccess> {
    ArchiveHandoverPolicy.enforceCanRead(userStatus);

    const file = await ArchiveHandoverRepository.getEligibleFileAccess(fileId);
    if (!file) {
      throw new AppError("NOT_FOUND", 404, "الملف غير موجود");
    }

    return file;
  }
}
