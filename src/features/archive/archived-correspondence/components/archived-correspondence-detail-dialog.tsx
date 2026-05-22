"use client";

import { useMemo, useState } from "react";
import type { ArchivedCorrespondenceDetail } from "../types";
import { ArchivedFileActions } from "./archived-file-actions";
import { ArchivedCorrespondenceFilePreview } from "./archived-correspondence-file-preview";
import {
  formatArchiveFileSize,
  getArchiveConfidentialityLabel,
  getArchiveDirectionLabel,
  getArchiveFilePurposeLabel,
  getArchivePriorityLabel,
  getArchiveSourceTypeLabel,
} from "@/features/archive/shared/archive-labels";

interface ArchivedCorrespondenceDetailDialogProps {
  item: ArchivedCorrespondenceDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchivedCorrespondenceDetailDialog({
  item,
  open,
  onOpenChange,
}: ArchivedCorrespondenceDetailDialogProps) {
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);
  const previewFile = useMemo(
    () => item?.files.find((file) => file.id === previewFileId) ?? null,
    [item, previewFileId]
  );

  if (!open || !item) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 p-4" onClick={() => onOpenChange(false)} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-start justify-between gap-4 border-b border-border p-5">
            <div>
              <h2 className="text-lg font-semibold">تفاصيل المراسلة المؤرشفة</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.title}</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
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

          <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <DetailField label="رقم المرجع" value={item.referenceNumber || "-"} />
              <DetailField label="رقم الأرشيف" value={item.archiveNumber || "-"} />
              <DetailField label="النوع" value={getArchiveSourceTypeLabel(item.sourceType)} />
              <DetailField label="الاتجاه" value={getArchiveDirectionLabel(item.direction)} />
              <DetailField label="الأولوية" value={getArchivePriorityLabel(item.priority)} />
              <DetailField label="السرية" value={getArchiveConfidentialityLabel(item.confidentiality)} />
              <DetailField label="تاريخ المراسلة" value={formatDate(item.correspondenceDate)} />
              <DetailField label="تاريخ الأرشفة" value={formatDate(item.archivedAt)} />
              <DetailField label="أنشئت بواسطة" value={item.createdByName} />
              <DetailField label="تاريخ الإنشاء" value={formatDate(item.createdAt)} />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">الملفات</h3>
              <div className="space-y-3">
                {item.files.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    لا توجد ملفات مرتبطة بهذه المراسلة
                  </div>
                ) : (
                  item.files.map((file) => (
                    <div
                      key={file.id}
                      className="rounded-lg border border-border bg-background/40 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="truncate text-sm font-medium">{file.originalName}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.mimeType} · {formatArchiveFileSize(file.sizeBytes)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            الغرض: {getArchiveFilePurposeLabel(file.purpose)}
                          </p>
                        </div>
                        <ArchivedFileActions file={file} onPreview={(selected) => setPreviewFileId(selected.id)} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {previewFile && (
        <ArchivedCorrespondenceFilePreview
          file={previewFile}
          open={true}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setPreviewFileId(null);
            }
          }}
        />
      )}
    </>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

