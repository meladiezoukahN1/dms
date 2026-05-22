import { randomUUID } from "crypto";
import type { AccountStatus } from "@prisma/client";
import { AppError } from "@/server/core/errors/app-error";
import { uploadBufferToVercelBlob } from "@/lib/storage/storage-client";
import { ScannedPhysicalValidator } from "./validator";
import { ScannedPhysicalPolicy } from "./policy";
import { ScannedPhysicalWorkflow } from "./workflow";
import { ScannedPhysicalRepository } from "./repository";
import type { CreateScannedPhysicalOutput } from "./types";

interface RequestMetadata {
  ipAddress?: string;
  userAgent?: string;
}

function toSafeFilename(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "-");
  return normalized.replace(/[^a-z0-9._-]/g, "").slice(0, 120) || "scanned-document";
}

export class ScannedPhysicalService {
  static async createIntake(
    payload: unknown,
    file: File | null,
    currentUserId: string,
    userStatus: AccountStatus,
    metadata?: RequestMetadata
  ): Promise<CreateScannedPhysicalOutput> {
    const input = ScannedPhysicalValidator.validateCreateInput(payload);
    const validatedFile = ScannedPhysicalValidator.validateUploadedFile(file);

    ScannedPhysicalPolicy.enforceCanCreateIntake(userStatus);

    if (!file) {
      throw new AppError("FILE_REQUIRED", 400, "ملف المراسلة الممسوحة مطلوب");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (fileBuffer.byteLength <= 0) {
      throw new AppError("EMPTY_FILE", 400, "الملف المرفوع فارغ");
    }

    const safeName = toSafeFilename(validatedFile.originalName);
    const pathname = `correspondence/scanned/${Date.now()}-${randomUUID()}-${safeName}`;

    const blob = await uploadBufferToVercelBlob({
      pathname,
      contentType: validatedFile.mimeType,
      buffer: fileBuffer,
    });

    const status = ScannedPhysicalWorkflow.getInitialStatus();

    try {
      const result = await ScannedPhysicalRepository.executeCreateIntakeTransaction({
        currentUserId,
        status,
        payload: input,
        uploadedFile: {
          ...validatedFile,
          sizeBytes: fileBuffer.byteLength,
        },
        blob,
        metadata,
      });

      return {
        correspondenceId: result.correspondenceId,
        status: result.status,
        fileId: result.fileId,
        purpose: result.purpose,
      };
    } catch (error) {
      // TODO: Blob cleanup should delete uploaded object if DB transaction fails after successful upload.
      throw new AppError(
        "SCANNED_INTAKE_DB_FAILED",
        500,
        "فشل حفظ بيانات المراسلة بعد رفع الملف",
        {
          storageKey: blob.storageKey,
          cleanupRequired: true,
          cause: error instanceof Error ? error.message : String(error),
        }
      );
    }
  }
}
