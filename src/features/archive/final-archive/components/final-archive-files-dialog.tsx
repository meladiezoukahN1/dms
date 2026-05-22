"use client";

import { useState } from "react";
import type { FinalArchiveFileDto } from "../types";
import { FinalArchiveFileActions } from "./final-archive-file-actions";
import { FinalArchiveFilePreview } from "./final-archive-file-preview";
import {
  formatArchiveFileSize,
  getArchiveFilePurposeLabel,
} from "@/features/archive/shared/archive-labels";

interface FinalArchiveFilesDialogProps {
  files: FinalArchiveFileDto[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinalArchiveFilesDialog({
  files,
  open,
  onOpenChange,
}: FinalArchiveFilesDialogProps) {
  const [previewFile, setPreviewFile] = useState<FinalArchiveFileDto | null>(null);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-2xl rounded-lg bg-card p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">الملفات</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {files.length === 0 ? (
              <div className="text-sm text-muted-foreground">لا توجد ملفات</div>
            ) : (
              files.map((file) => (
                <div key={file.id} className="rounded border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-sm">{file.originalName}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.mimeType} · {formatArchiveFileSize(file.sizeBytes)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        الغرض: {getArchiveFilePurposeLabel(file.purpose)}
                      </p>
                    </div>
                    <FinalArchiveFileActions file={file} onPreview={setPreviewFile} />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-muted"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>

      <FinalArchiveFilePreview
        file={previewFile}
        open={!!previewFile}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPreviewFile(null);
          }
        }}
      />
    </>
  );
}
