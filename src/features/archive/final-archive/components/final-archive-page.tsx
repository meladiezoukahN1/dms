"use client";

import { FinalArchiveTable } from "./final-archive-table";
import { FinalArchiveFilters } from "./final-archive-filters";
import { useFinalArchiveList } from "../hooks/use-final-archive-list";
import { useFinalArchiveQueryState } from "../hooks/use-final-archive-query-state";
import { useRouter } from "next/navigation";

export function FinalArchivePage() {
  const query = useFinalArchiveQueryState();
  const router = useRouter();
  const { data, isLoading, error } = useFinalArchiveList(query);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("pageSize", query.pageSize.toString());
    if (query.search) params.set("search", query.search);
    if (query.sourceType) params.set("sourceType", query.sourceType);
    if (query.direction) params.set("direction", query.direction);
    if (query.priority) params.set("priority", query.priority);
    if (query.confidentiality) params.set("confidentiality", query.confidentiality);
    if (query.dateFrom) params.set("dateFrom", query.dateFrom);
    if (query.dateTo) params.set("dateTo", query.dateTo);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 p-5" >
        <h1 className="text-2xl font-bold">الأرشفة النهائية</h1>
        <p className="text-sm text-muted-foreground">إدارة أرشفة المراسلات المحالة للأرشفة</p>
      </div>

      <FinalArchiveFilters query={query} />

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          حدث خطأ في تحميل البيانات: {error.message}
        </div>
      )}

      <FinalArchiveTable
        items={data?.items || []}
        isLoading={isLoading}
        currentPage={query.page}
        totalPages={data?.pagination.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
