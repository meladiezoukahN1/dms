"use client";

import Image from "next/image";
import type { ArchivedCorrespondenceFile } from "../types";
import { ArchivedCorrespondenceAPI } from "../api/archived-correspondence.api";

interface ArchivedCorrespondenceFilePreviewProps {
  file: ArchivedCorrespondenceFile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchivedCorrespondenceFilePreview({
  file,
  open,
  onOpenChange,
}: ArchivedCorrespondenceFilePreviewProps) {
  const previewUrl = ArchivedCorrespondenceAPI.getPreviewUrl(file.id);

  if (!open) return null;

  const isImage = file.mimeType.startsWith("image/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex h-full max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-card shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.originalName}</p>
            <p className="text-xs text-muted-foreground">{file.mimeType}</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="ms-4 shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            type="button"
            aria-label="إغلاق"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="relative flex-1 overflow-hidden bg-muted/30">
          {isImage ? (
            <div className="relative h-full w-full">
              <Image
                src={previewUrl}
                alt={file.originalName}
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <iframe
              src={previewUrl}
              title={file.originalName}
              className="h-full w-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}
