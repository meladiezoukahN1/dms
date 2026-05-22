import type { AccountStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";
import { ArchivedCorrespondencePolicy } from "./policy";
import { ArchivedCorrespondenceRepository } from "./repository";
import { ArchivedCorrespondenceValidator } from "./validator";
import type {
  ArchivedCorrespondenceDetailOutput,
  ArchivedCorrespondenceFileAccess,
  ArchivedCorrespondenceListOutput,
} from "./types";

export class ArchivedCorrespondenceService {
  static async list(
    rawQuery: unknown,
    userStatus: AccountStatus
  ): Promise<ArchivedCorrespondenceListOutput> {
    ArchivedCorrespondencePolicy.enforceCanRead(userStatus);
    const query = ArchivedCorrespondenceValidator.validateListQuery(rawQuery);
    return ArchivedCorrespondenceRepository.getList(query);
  }

  static async getDetail(
    id: string,
    userStatus: AccountStatus
  ): Promise<ArchivedCorrespondenceDetailOutput> {
    ArchivedCorrespondencePolicy.enforceCanRead(userStatus);

    const item = await ArchivedCorrespondenceRepository.getDetailById(id);
    if (!item) {
      throw new AppError("NOT_FOUND", 404, "المراسلة المؤرشفة غير موجودة");
    }

    return item;
  }

  static async getPreviewFileAccess(
    fileId: string,
    userStatus: AccountStatus
  ): Promise<ArchivedCorrespondenceFileAccess> {
    ArchivedCorrespondencePolicy.enforceCanRead(userStatus);

    const file = await ArchivedCorrespondenceRepository.getArchivedFileAccess(fileId);
    if (!file) {
      throw new AppError("NOT_FOUND", 404, "الملف غير موجود");
    }

    ArchivedCorrespondenceValidator.enforcePreviewSupported(file.mimeType);
    return file;
  }

  static async getDownloadFileAccess(
    fileId: string,
    userStatus: AccountStatus
  ): Promise<ArchivedCorrespondenceFileAccess> {
    ArchivedCorrespondencePolicy.enforceCanRead(userStatus);

    const file = await ArchivedCorrespondenceRepository.getArchivedFileAccess(fileId);
    if (!file) {
      throw new AppError("NOT_FOUND", 404, "الملف غير موجود");
    }

    return file;
  }
}
