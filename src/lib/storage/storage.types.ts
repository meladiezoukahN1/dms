export type StorageProvider = "VERCEL_BLOB";

export interface VercelBlobUploadInput {
  pathname: string;
  contentType: string;
  buffer: Buffer;
}

export interface VercelBlobUploadResult {
  url: string;
  pathname: string;
  storageKey: string;
  contentType: string;
  sizeBytes: number;
  provider: StorageProvider;
}