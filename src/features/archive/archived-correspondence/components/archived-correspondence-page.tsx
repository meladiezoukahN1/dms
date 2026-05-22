"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ArchivedCorrespondenceDetail, ArchivedCorrespondenceListItem } from "../types";
import { useArchivedCorrespondenceList } from "../hooks/use-archived-correspondence-list";
import { useArchivedCorrespondenceQueryState } from "../hooks/use-archived-correspondence-query-state";
import { ArchivedCorrespondenceFilters } from "./archived-correspondence-filters";
import { ArchivedCorrespondenceDetailDialog } from "./archived-correspondence-detail-dialog";
import { ArchivedCorrespondenceAPI } from "../api/archived-correspondence.api";
import {
  getArchiveConfidentialityLabel,
  getArchiveDirectionLabel,
  getArchivePriorityLabel,
  getArchiveSourceTypeLabel,
} from "@/features/archive/shared/archive-labels";

export function ArchivedCorrespondencePage() {
  const query = useArchivedCorrespondenceQueryState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading, error } = useArchivedCorrespondenceList(query);
  const [selectedItem, setSelectedItem] = useState<ArchivedCorrespondenceDetail | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const handleOpenDetail = async (item: ArchivedCorrespondenceListItem) => {
    setLoadingDetailId(item.id);
    try {
      const detail = await ArchivedCorrespondenceAPI.getDetail(item.id);
      setSelectedItem(detail);
      setDetailDialogOpen(true);
    } finally {
      setLoadingDetailId(null);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("pageSize", query.pageSize.toString());
    if (query.search) params.set("search", query.search);
    if (query.sourceType) params.set("sourceType", query.sourceType);
    if (query.direction) params.set("direction", query.direction);
    if (query.priority) params.set("priority", query.priority);
    if (query.confidentiality) params.set("confidentiality", query.confidentiality);
    if (query.dateFrom) params.set("dateFrom", query.dateFrom);
    if (query.dateTo) params.set("dateTo", query.dateTo);
    if (query.archiveDateFrom) params.set("archiveDateFrom", query.archiveDateFrom);
    if (query.archiveDateTo) params.set("archiveDateTo", query.archiveDateTo);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 p-2 xl:p-5">
        <h1 className="text-2xl font-bold">سجل المراسلات المؤرشفة</h1>
        <p className="text-sm text-muted-foreground">
          مراجعة المراسلات المؤرشفة مع معاينة وتنزيل محمي للملفات
        </p>
      </div>

      <ArchivedCorrespondenceFilters query={query} />

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          حدث خطأ في تحميل البيانات: {error.message}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            جاري تحميل السجل...
          </div>
        ) : data?.items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-border bg-muted/30 text-muted-foreground">
                <tr>
                  <Th>العنوان</Th>
                  <Th>رقم المرجع</Th>
                  <Th>النوع</Th>
                  <Th>الاتجاه</Th>
                  <Th>الأولوية</Th>
                  <Th>السرية</Th>
                  <Th>تاريخ الأرشفة</Th>
                  <Th>أنشئت بواسطة</Th>
                  <Th>الإجراء</Th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <Td>
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(item)}
                        className="text-right font-medium text-foreground hover:underline"
                      >
                        {item.title}
                      </button>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.archiveNumber ? `رقم الأرشيف: ${item.archiveNumber}` : ""}
                      </div>
                    </Td>
                    <Td>{item.referenceNumber || "-"}</Td>
                    <Td>{getArchiveSourceTypeLabel(item.sourceType)}</Td>
                    <Td>{getArchiveDirectionLabel(item.direction)}</Td>
                    <Td>{getArchivePriorityLabel(item.priority)}</Td>
                    <Td>{getArchiveConfidentialityLabel(item.confidentiality)}</Td>
                    <Td>{formatDate(item.archivedAt)}</Td>
                    <Td>{item.createdByName}</Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(item)}
                        disabled={loadingDetailId === item.id}
                        className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent disabled:opacity-50"
                      >
                        {loadingDetailId === item.id ? "..." : "عرض التفاصيل"}
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            لا توجد مراسلات مؤرشفة مطابقة للمعايير الحالية
          </div>
        )}
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm">
          <div className="text-muted-foreground">
            الصفحة {data.pagination.page} من {data.pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={data.pagination.page <= 1}
              onClick={() => handlePageChange(data.pagination.page - 1)}
              className="rounded-md border border-border px-3 py-1.5 disabled:opacity-50"
            >
              السابق
            </button>
            <button
              type="button"
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() => handlePageChange(data.pagination.page + 1)}
              className="rounded-md border border-border px-3 py-1.5 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      )}

      <ArchivedCorrespondenceDetailDialog
        item={selectedItem}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
  }).format(new Date(value));
}
