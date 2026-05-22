"use client";

import { useState } from "react";
import type { FinalArchiveItemDto } from "../types";
import { EditFinalArchiveDialog } from "./edit-final-archive-dialog";
import { ArchiveConfirmDialog } from "./archive-confirm-dialog";
import { FinalArchiveFilesDialog } from "./final-archive-files-dialog";
import {
  getArchiveDirectionLabel,
  getArchiveSourceTypeLabel,
} from "@/features/archive/shared/archive-labels";

interface FinalArchiveTableProps {
  items: FinalArchiveItemDto[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function FilesIcon() {
  return (
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
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
      <polyline points="14 2 14 9 21 9" />
    </svg>
  );
}

function EditIcon() {
  return (
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
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
      <path d="M21 8v13H3V8" />
      <rect x="1" y="3" width="22" height="5" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

export function FinalArchiveTable({
  items,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: FinalArchiveTableProps) {
  const [selectedItem, setSelectedItem] = useState<FinalArchiveItemDto | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [filesDialogOpen, setFilesDialogOpen] = useState(false);

  const handleEdit = (item: FinalArchiveItemDto) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const handleArchive = (item: FinalArchiveItemDto) => {
    setSelectedItem(item);
    setArchiveDialogOpen(true);
  };

  const handleViewFiles = (item: FinalArchiveItemDto) => {
    setSelectedItem(item);
    setFilesDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">لا توجد مراسلات مؤهلة للأرشفة النهائية</div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-right text-sm font-medium">رقم المرجع</th>
                <th className="px-4 py-3 text-right text-sm font-medium">العنوان</th>
                <th className="px-4 py-3 text-right text-sm font-medium">النوع</th>
                <th className="px-4 py-3 text-right text-sm font-medium">الاتجاه</th>
                <th className="px-4 py-3 text-right text-sm font-medium">التاريخ</th>
                <th className="px-4 py-3 text-right text-sm font-medium">أحيل بواسطة</th>
                <th className="px-4 py-3 text-right text-sm font-medium">الملفات</th>
                <th className="px-4 py-3 text-right text-sm font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm">{item.referenceNumber || "-"}</td>
                  <td className="px-4 py-3 text-sm">{item.title}</td>
                  <td className="px-4 py-3 text-sm">{getArchiveSourceTypeLabel(item.sourceType)}</td>
                  <td className="px-4 py-3 text-sm">{getArchiveDirectionLabel(item.direction)}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.correspondenceDate
                      ? new Date(item.correspondenceDate).toLocaleDateString("ar-SA")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {item.archiveHandoverBy?.name || "-"}
                    {item.archiveHandoverAt && (
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.archiveHandoverAt).toLocaleDateString("ar-SA")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.files.length}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewFiles(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        aria-label="عرض الملفات"
                        title="عرض الملفات"
                      >
                        <FilesIcon />
                        <span className="sr-only">عرض الملفات</span>
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        aria-label="تعديل"
                        title="تعديل"
                      >
                        <EditIcon />
                        <span className="sr-only">تعديل</span>
                      </button>
                      <button
                        onClick={() => handleArchive(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-primary transition-colors hover:bg-accent"
                        aria-label="أرشفة نهائية"
                        title="أرشفة نهائية"
                      >
                        <ArchiveIcon />
                        <span className="sr-only">أرشفة نهائية</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <div className="text-sm text-muted-foreground">
            الصفحة {currentPage} من {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded px-3 py-1 text-sm hover:bg-muted disabled:opacity-50"
            >
              السابق
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded px-3 py-1 text-sm hover:bg-muted disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      </div>

      {selectedItem && (
        <>
          <EditFinalArchiveDialog
            item={selectedItem}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
          <ArchiveConfirmDialog
            item={selectedItem}
            open={archiveDialogOpen}
            onOpenChange={setArchiveDialogOpen}
          />
          <FinalArchiveFilesDialog
            files={selectedItem.files}
            open={filesDialogOpen}
            onOpenChange={setFilesDialogOpen}
          />
        </>
      )}
    </>
  );
}
