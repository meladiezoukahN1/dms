"use client";

import { Button, Skeleton } from "@/components/ui";
import type { ArchiveHandoverItemDto } from "../types";
import { SendToArchiveAction } from "./send-to-archive-action";

interface ArchiveHandoverTableProps {
  items: ArchiveHandoverItemDto[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onViewFiles: (item: ArchiveHandoverItemDto) => void;
  onEdit: (item: ArchiveHandoverItemDto) => void;
}

function formatDate(value: string | null): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("ar");
}

function getStatusLabel(status: ArchiveHandoverItemDto["status"]): string {
  if (status === "GENERATED") return "مولدة";
  if (status === "RECEIVED") return "مستلمة";
  if (status === "ARCHIVE_PENDING") return "بانتظار الأرشفة";
  return status;
}

function LoadingState() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
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

export function ArchiveHandoverTable({
  items,
  isLoading,
  isError,
  errorMessage,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onViewFiles,
  onEdit,
}: ArchiveHandoverTableProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {errorMessage || "تعذر تحميل قائمة الإحالة للأرشفة"}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-border bg-muted/20 p-6 text-sm text-muted-foreground">
        لا توجد مراسلات مؤهلة للإحالة للأرشفة حالياً.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-300 text-sm">
          <thead className="bg-muted/30">
            <tr className="text-right">
              <th className="p-3 font-medium">الرقم الإشاري</th>
              <th className="p-3 font-medium">العنوان / الموضوع</th>
              <th className="p-3 font-medium">المصدر</th>
              <th className="p-3 font-medium">الحالة</th>
              <th className="p-3 font-medium">الاتجاه</th>
              <th className="p-3 font-medium">التاريخ</th>
              <th className="p-3 font-medium">أنشأها</th>
              <th className="p-3 font-medium">أحالها</th>
              <th className="p-3 font-medium">وقت الإحالة</th>
              <th className="p-3 font-medium">ملاحظات الإحالة</th>
              <th className="p-3 font-medium">عدد الملفات</th>
              <th className="p-3 font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-border align-top">
                <td className="p-3">{item.referenceNumber || "-"}</td>
                <td className="p-3">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-muted-foreground">{item.subject || "-"}</p>
                </td>
                <td className="p-3">{item.sourceType}</td>
                <td className="p-3">
                  <span className="inline-flex rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-foreground">
                    {getStatusLabel(item.status)}
                  </span>
                </td>
                <td className="p-3">{item.direction}</td>
                <td className="p-3">{formatDate(item.correspondenceDate)}</td>
                <td className="p-3">
                  <p>{item.createdBy.name}</p>
                  <p className="text-xs text-muted-foreground">{item.createdBy.email}</p>
                </td>
                <td className="p-3">{item.handedOverBy?.name || "-"}</td>
                <td className="p-3">{formatDate(item.handedOverAt)}</td>
                <td className="p-3">{item.archiveHandoverNotes || "-"}</td>
                <td className="p-3">{item.files.length}</td>
                <td className="p-3 min-w-40">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => onViewFiles(item)}
                      aria-label="عرض الملفات"
                      title="عرض الملفات"
                    >
                      <FilesIcon />
                      <span className="sr-only">عرض الملفات</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(item)}
                      aria-label="تعديل"
                      title="تعديل"
                    >
                      <EditIcon />
                      <span className="sr-only">تعديل</span>
                    </Button>
                    {item.status === "ARCHIVE_PENDING" ? null : (
                      <SendToArchiveAction correspondenceId={item.id} />
                    )}
                  </div>

                  {item.status === "ARCHIVE_PENDING" ? (
                    <div className="mt-2 inline-flex rounded-md border border-border bg-muted/20 px-2 py-1 text-xs text-muted-foreground">
                      تمت إحالتها للأرشفة
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">الإجمالي: {total}</p>

        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            السابق
          </Button>
          <span className="text-sm">
            الصفحة {page} من {totalPages}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            التالي
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">حجم الصفحة</span>
          <select
            aria-label="حجم الصفحة"
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
