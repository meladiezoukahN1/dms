"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { FinalArchiveItemDto } from "../types";
import { useUpdateFinalArchiveMetadata } from "../hooks/use-update-final-archive-metadata";
import { FinalArchiveFileActions } from "./final-archive-file-actions";
import { FinalArchiveFilePreview } from "./final-archive-file-preview";
import {
  formatArchiveFileSize,
  getArchiveConfidentialityLabel,
  getArchiveDirectionLabel,
  getArchiveFilePurposeLabel,
  getArchivePriorityLabel,
} from "@/features/archive/shared/archive-labels";

interface EditFinalArchiveDialogProps {
  item: FinalArchiveItemDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditFinalArchiveDialog({
  item,
  open,
  onOpenChange,
}: EditFinalArchiveDialogProps) {
  const queryClient = useQueryClient();
  const { mutate: updateMetadata, isPending } = useUpdateFinalArchiveMetadata();
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);
  const previewFile = item.files.find((file) => file.id === previewFileId) ?? null;

  const [formData, setFormData] = useState({
    title: item.title,
    referenceNumber: item.referenceNumber || "",
    subject: item.subject || "",
    direction: item.direction,
    priority: item.priority,
    confidentiality: item.confidentiality,
    correspondenceDate: item.correspondenceDate?.split("T")[0] || "",
    archiveHandoverNotes: item.archiveHandoverNotes || "",
  });

  const handleDirectionChange = (value: string) => {
    setFormData({
      ...formData,
      direction: value as typeof item.direction,
    });
  };

  const handlePriorityChange = (value: string) => {
    setFormData({
      ...formData,
      priority: value as typeof item.priority,
    });
  };

  const handleConfidentialityChange = (value: string) => {
    setFormData({
      ...formData,
      confidentiality: value as typeof item.confidentiality,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateMetadata(
      {
        id: item.id,
        payload: {
          title: formData.title,
          referenceNumber: formData.referenceNumber || null,
          subject: formData.subject || null,
          direction: formData.direction,
          priority: formData.priority,
          confidentiality: formData.confidentiality,
          correspondenceDate: formData.correspondenceDate || null,
          archiveHandoverNotes: formData.archiveHandoverNotes || null,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["final-archive-list"] });
          onOpenChange(false);
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
          <h2 className="text-lg font-semibold">تعديل المراسلة</h2>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="rounded-md border border-border bg-muted/20 p-3">
            <h3 className="mb-2 text-sm font-semibold text-foreground">الملفات المرتبطة</h3>
            {item.files.length === 0 ? (
              <p className="text-xs text-muted-foreground">لا توجد ملفات مرتبطة.</p>
            ) : (
              <div className="space-y-2">
                {item.files.map((file) => (
                  <div key={file.id} className="rounded-md border border-border bg-card p-2 text-xs">
                    <p className="font-medium text-foreground">{file.originalName}</p>
                    <p className="text-muted-foreground">
                      {file.mimeType} · {formatArchiveFileSize(file.sizeBytes)}
                    </p>
                    <p className="text-muted-foreground">
                      الغرض: {getArchiveFilePurposeLabel(file.purpose)}
                    </p>
                    <div className="mt-1">
                      <FinalArchiveFileActions file={file} onPreview={(selected) => setPreviewFileId(selected.id)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">العنوان</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              title="العنوان"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">رقم المرجع</label>
              <input
                type="text"
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                title="رقم المرجع"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الموضوع</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                title="الموضوع"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">الاتجاه</label>
              <select
                value={formData.direction}
                onChange={(e) => handleDirectionChange(e.target.value)}
                title="الاتجاه"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="INCOMING">{getArchiveDirectionLabel("INCOMING")}</option>
                <option value="OUTGOING">{getArchiveDirectionLabel("OUTGOING")}</option>
                <option value="INTERNAL">{getArchiveDirectionLabel("INTERNAL")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الأولوية</label>
              <select
                value={formData.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                title="الأولوية"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="LOW">{getArchivePriorityLabel("LOW")}</option>
                <option value="NORMAL">{getArchivePriorityLabel("NORMAL")}</option>
                <option value="HIGH">{getArchivePriorityLabel("HIGH")}</option>
                <option value="URGENT">{getArchivePriorityLabel("URGENT")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">مستوى السرية</label>
              <select
                value={formData.confidentiality}
                onChange={(e) => handleConfidentialityChange(e.target.value)}
                title="مستوى السرية"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="PUBLIC">{getArchiveConfidentialityLabel("PUBLIC")}</option>
                <option value="INTERNAL">{getArchiveConfidentialityLabel("INTERNAL")}</option>
                <option value="CONFIDENTIAL">{getArchiveConfidentialityLabel("CONFIDENTIAL")}</option>
                <option value="SECRET">{getArchiveConfidentialityLabel("SECRET")}</option>
                <option value="TOP_SECRET">{getArchiveConfidentialityLabel("TOP_SECRET")}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">تاريخ المراسلة</label>
            <input
              type="date"
              value={formData.correspondenceDate}
              onChange={(e) => setFormData({ ...formData, correspondenceDate: e.target.value })}
              title="تاريخ المراسلة"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ملاحظات الإحالة</label>
            <textarea
              value={formData.archiveHandoverNotes}
              onChange={(e) => setFormData({ ...formData, archiveHandoverNotes: e.target.value })}
              rows={3}
              title="ملاحظات الإحالة"
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
              {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
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
