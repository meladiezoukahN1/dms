import { put } from "@vercel/blob";
import { AppError } from "@/server/core/errors/app-error";
import type {
  VercelBlobUploadInput,
  VercelBlobUploadResult,
} from "./storage.types";

function getVercelBlobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (!token) {
    throw new AppError(
      "BLOB_STORAGE_NOT_CONFIGURED",
      503,
      "BLOB_READ_WRITE_TOKEN is required for Vercel Blob uploads"
    );
  }

  return token;
}

export async function uploadBufferToVercelBlob(
  input: VercelBlobUploadInput
): Promise<VercelBlobUploadResult> {
  const token = getVercelBlobToken();

  const blob = await put(input.pathname, input.buffer, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: input.contentType,
    token,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
    storageKey: blob.pathname,
    contentType: blob.contentType,
    sizeBytes: input.buffer.byteLength,
    provider: "VERCEL_BLOB",
  };
}