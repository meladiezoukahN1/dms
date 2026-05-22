"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui";
import { useArchiveHandoverList } from "../hooks/use-archive-handover-list";
import { useArchiveHandoverQueryState } from "../hooks/use-archive-handover-query-state";
import type { ArchiveHandoverItemDto } from "../types";
import { ArchiveHandoverFilesDialog } from "./archive-handover-files-dialog";
import { ArchiveHandoverFilters } from "./archive-handover-filters";
import { ArchiveHandoverTable } from "./archive-handover-table";
import { EditHandoverCorrespondenceDialog } from "./edit-handover-correspondence-dialog";

export function ArchiveHandoverPage() {
  const { query, setFilter, setPage, setPageSize, setSearch } = useArchiveHandoverQueryState();
  const listQuery = useMemo(
    () => ({
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
      sourceType: query.sourceType,
      status: query.status,
      direction: query.direction,
      priority: query.priority,
      confidentiality: query.confidentiality,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    }),
    [query]
  );

  const listQueryResult = useArchiveHandoverList(listQuery);

  const [selectedFilesItem, setSelectedFilesItem] = useState<ArchiveHandoverItemDto | null>(null);
  const [selectedEditItem, setSelectedEditItem] = useState<ArchiveHandoverItemDto | null>(null);

  return (
    <div className="w-full space-y-6 p-4 md:p-6" dir="rtl">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">إحالة المراسلات للأرشفة</h1>
        <p className="text-sm text-muted-foreground">
          عرض المراسلات المؤهلة، مراجعة الملفات، تعديل البيانات الوصفية، ومحاولة الإحالة للأرشفة دون تنفيذ الأرشفة النهائية.
        </p>
      </header>

      <ArchiveHandoverFilters query={query} onSearchChange={setSearch} onFilterChange={setFilter} />

      <Card>
        <CardContent className="pt-6">
          <ArchiveHandoverTable
            items={listQueryResult.data?.items || []}
            isLoading={listQueryResult.isLoading}
            isError={listQueryResult.isError}
            errorMessage={listQueryResult.error instanceof Error ? listQueryResult.error.message : undefined}
            page={query.page}
            pageSize={query.pageSize}
            total={listQueryResult.data?.pagination.total || 0}
            totalPages={listQueryResult.data?.pagination.totalPages || 1}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onViewFiles={setSelectedFilesItem}
            onEdit={setSelectedEditItem}
          />
        </CardContent>
      </Card>

      <ArchiveHandoverFilesDialog
        open={Boolean(selectedFilesItem)}
        files={selectedFilesItem?.files || []}
        onClose={() => setSelectedFilesItem(null)}
      />

      <EditHandoverCorrespondenceDialog
        key={selectedEditItem?.id || "edit-dialog"}
        open={Boolean(selectedEditItem)}
        item={selectedEditItem}
        onClose={() => setSelectedEditItem(null)}
      />
    </div>
  );
}
