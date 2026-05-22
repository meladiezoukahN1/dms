"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { FinalArchiveItemDto } from "../types";
import { useFinalArchiveAction } from "../hooks/use-final-archive-action";
import { FinalArchiveFileActions } from "./final-archive-file-actions";
import { FinalArchiveFilePreview } from "./final-archive-file-preview";
import {
  formatArchiveFileSize,
  getArchiveFilePurposeLabel,
} from "@/features/archive/shared/archive-labels";

interface ArchiveConfirmDialogProps {
  item: FinalArchiveItemDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchiveConfirmDialog({
  item,
  open,
  onOpenChange,
}: ArchiveConfirmDialogProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: archiveCorrespondence, isPending } = useFinalArchiveAction();
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);
  const previewFile = item.files.find((file) => file.id === previewFileId) ?? null;

  const [formData, setFormData] = useState({
    archiveCode: "",
    archiveLocation: "",
    shelf: "",
    boxNumber: "",
    retentionPolicy: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    archiveCorrespondence(
      {
        id: item.id,
        payload: {
          archiveCode: formData.archiveCode || undefined,
          archiveLocation: formData.archiveLocation || undefined,
          shelf: formData.shelf || undefined,
          boxNumber: formData.boxNumber || undefined,
          retentionPolicy: formData.retentionPolicy || undefined,
          notes: formData.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["final-archive-list"] });
          onOpenChange(false);
          router.refresh();
        },
        onError: (error) => {
          alert(`خطأ: ${error.message}`);
        },
      }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">تأكيد الأرشفة النهائية</h2>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 space-y-2 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm">
            <strong>المراسلة:</strong> {item.title}
          </p>
          {item.referenceNumber && (
            <p className="text-sm">
              <strong>رقم المرجع:</strong> {item.referenceNumber}
            </p>
          )}
          <p className="text-sm">
            <strong>عدد الملفات:</strong> {item.files.length}
          </p>
          {item.archiveHandoverNotes && (
            <p className="text-sm">
              <strong>ملاحظات الإحالة:</strong> {item.archiveHandoverNotes}
            </p>
          )}

          <div className="mt-3 rounded-md border border-border bg-background/40 p-3">
            <p className="mb-2 text-sm font-semibold">الملفات المرتبطة</p>
            {item.files.length === 0 ? (
              <p className="text-xs text-muted-foreground">لا توجد ملفات مرتبطة.</p>
            ) : (
              <div className="space-y-2">
                {item.files.map((file) => (
                  <div key={file.id} className="rounded-md border border-border bg-card p-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1 text-xs">
                        <p className="truncate font-medium text-foreground">{file.originalName}</p>
                        <p className="text-muted-foreground">
                          {file.mimeType} · {formatArchiveFileSize(file.sizeBytes)}
                        </p>
                        <p className="text-muted-foreground">
                          الغرض: {getArchiveFilePurposeLabel(file.purpose)}
                        </p>
                      </div>
                      <FinalArchiveFileActions file={file} onPreview={(selected) => setPreviewFileId(selected.id)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">كود الأرشيف</label>
              <input
                type="text"
                value={formData.archiveCode}
                onChange={(e) => setFormData({ ...formData, archiveCode: e.target.value })}
                placeholder="مثال: AR-2024-001"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">موقع الأرشيف</label>
              <input
                type="text"
                value={formData.archiveLocation}
                onChange={(e) => setFormData({ ...formData, archiveLocation: e.target.value })}
                placeholder="مثال: مخزن A"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الرف</label>
              <input
                type="text"
                value={formData.shelf}
                onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
                placeholder="مثال: 3"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">رقم الصندوق</label>
              <input
                type="text"
                value={formData.boxNumber}
                onChange={(e) => setFormData({ ...formData, boxNumber: e.target.value })}
                placeholder="مثال: 42"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">سياسة الاحتفاظ</label>
            <input
              type="text"
              value={formData.retentionPolicy}
              onChange={(e) => setFormData({ ...formData, retentionPolicy: e.target.value })}
              placeholder="مثال: 5 سنوات"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ملاحظات</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              title="ملاحظات الأرشفة"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "جاري الأرشفة..." : "تأكيد الأرشفة"}
            </button>
          </div>
        </form>
      </div>

      <FinalArchiveFilePreview
        file={previewFile}
        open={!!previewFile}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPreviewFileId(null);
          }
        }}
      />
    </div>
  );
}
