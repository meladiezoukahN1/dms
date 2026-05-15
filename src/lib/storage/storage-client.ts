export interface StorageClient {
  upload: (key: string, file: Buffer | Uint8Array) => Promise<string>;
  delete: (key: string) => Promise<void>;
}

export const storageClient: StorageClient = {
  async upload() {
    throw new Error("Storage client is not configured yet");
  },
  async delete() {
    throw new Error("Storage client is not configured yet");
  },
};
