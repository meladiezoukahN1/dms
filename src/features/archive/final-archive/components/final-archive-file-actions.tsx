"use client";

import type { FinalArchiveFileDto } from "../types";
import { FinalArchiveAPI } from "../api/final-archive.api";

interface FinalArchiveFileActionsProps {
  file: FinalArchiveFileDto;
  onPreview: (file: FinalArchiveFileDto) => void;
}

function EyeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function FinalArchiveFileActions({ file, onPreview }: FinalArchiveFileActionsProps) {
  const downloadUrl = FinalArchiveAPI.getDownloadUrl(file.fileId);

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onPreview(file)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="معاينة الملف"
        title="معاينة الملف"
      >
        <EyeIcon />
      </button>
      <a
        href={downloadUrl}
        download={file.originalName}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="تحميل الملف"
        title="تحميل الملف"
      >
        <DownloadIcon />
      </a>
    </div>
  );
}
