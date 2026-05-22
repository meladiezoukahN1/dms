"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { ArchiveHandoverFileDto } from "../types";
import { getArchiveHandoverFileDownloadUrl } from "../api/archive-handover.api";
import { ArchiveHandoverFilePreview } from "./archive-handover-file-preview";

interface ArchiveHandoverFilesDialogProps {
  open: boolean;
  files: ArchiveHandoverFileDto[];
  onClose: () => void;
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export function ArchiveHandoverFilesDialog({ open, files, onClose }: ArchiveHandoverFilesDialogProps) {
  const [previewFile, setPreviewFile] = useState<ArchiveHandoverFileDto | null>(null);

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">الملفات المرتبطة بالمراسلة</CardTitle>
            <Button type="button" variant="ghost" onClick={onClose}>
              إغلاق
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {files.length === 0 ? (
              <div className="rounded-md border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
                لا توجد ملفات مرتبطة.
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col gap-2 rounded-md border border-border bg-card p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate font-medium">{file.originalName}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.purpose} &mdash; {formatBytes(file.sizeBytes)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {file.previewSupported && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewFile(file)}
                        >
                          معاينة
                        </Button>
                      )}
                      <a
                        href={getArchiveHandoverFileDownloadUrl(file.fileId)}
                        download={file.originalName}
                        className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
                      >
                        تحميل
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {previewFile && (
        <ArchiveHandoverFilePreview
          file={previewFile}
          open={true}
          onOpenChange={(o) => { if (!o) setPreviewFile(null); }}
        />
      )}
    </>
  );
}
