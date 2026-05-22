"use client";

import type { ArchivedCorrespondenceFile } from "../types";
import { ArchivedCorrespondenceAPI } from "../api/archived-correspondence.api";

interface ArchivedFileActionsProps {
  file: ArchivedCorrespondenceFile;
  onPreview: (file: ArchivedCorrespondenceFile) => void;
}

export function ArchivedFileActions({ file, onPreview }: ArchivedFileActionsProps) {
  const downloadUrl = ArchivedCorrespondenceAPI.getDownloadUrl(file.id);

  return (
    <div className="flex items-center gap-2">
      {file.previewSupported && (
        <button
          onClick={() => onPreview(file)}
          className="text-xs text-primary hover:underline"
          type="button"
        >
          معاينة
        </button>
      )}
      <a
        href={downloadUrl}
        download={file.originalName}
        className="text-xs text-muted-foreground hover:text-foreground hover:underline"
      >
        تحميل
      </a>
    </div>
  );
}
