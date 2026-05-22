"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ArchivedCorrespondenceQueryState } from "../types";

interface ArchivedCorrespondenceFiltersProps {
  query: ArchivedCorrespondenceQueryState;
}

export function ArchivedCorrespondenceFilters({ query }: ArchivedCorrespondenceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div>
        <label className="block text-sm font-medium mb-2">بحث</label>
        <input
          type="text"
          placeholder="ابحث بالعنوان، رقم المرجع، أو الموضوع..."
          title="بحث في سجل المراسلات المؤرشفة"
          defaultValue={query.search || ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium mb-2">النوع</label>
          <select
            value={query.sourceType || ""}
            onChange={(e) => handleFilterChange("sourceType", e.target.value || undefined)}
            title="تصفية حسب النوع"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">الكل</option>
            <option value="DIGITAL_GENERATED">مراسلة رقمية</option>
            <option value="SCANNED_PHYSICAL">مراسلة ممسوحة</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الاتجاه</label>
          <select
            value={query.direction || ""}
            onChange={(e) => handleFilterChange("direction", e.target.value || undefined)}
            title="تصفية حسب الاتجاه"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">الكل</option>
            <option value="INCOMING">وارد</option>
            <option value="OUTGOING">صادر</option>
            <option value="INTERNAL">داخلي</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الأولوية</label>
          <select
            value={query.priority || ""}
            onChange={(e) => handleFilterChange("priority", e.target.value || undefined)}
            title="تصفية حسب الأولوية"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">الكل</option>
            <option value="LOW">منخفضة</option>
            <option value="NORMAL">عادية</option>
            <option value="HIGH">عالية</option>
            <option value="URGENT">عاجلة</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">مستوى السرية</label>
          <select
            value={query.confidentiality || ""}
            onChange={(e) => handleFilterChange("confidentiality", e.target.value || undefined)}
            title="تصفية حسب مستوى السرية"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">الكل</option>
            <option value="PUBLIC">عامة</option>
            <option value="INTERNAL">داخلية</option>
            <option value="CONFIDENTIAL">سرية</option>
            <option value="SECRET">سرية جدا</option>
            <option value="TOP_SECRET">سرية للغاية</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium mb-2">تاريخ المراسلة من</label>
          <input
            type="date"
            value={query.dateFrom || ""}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)}
            title="تاريخ المراسلة من"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">تاريخ المراسلة إلى</label>
          <input
            type="date"
            value={query.dateTo || ""}
            onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)}
            title="تاريخ المراسلة إلى"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">تاريخ الأرشفة من</label>
          <input
            type="date"
            value={query.archiveDateFrom || ""}
            onChange={(e) => handleFilterChange("archiveDateFrom", e.target.value || undefined)}
            title="تاريخ الأرشفة من"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">تاريخ الأرشفة إلى</label>
          <input
            type="date"
            value={query.archiveDateTo || ""}
            onChange={(e) => handleFilterChange("archiveDateTo", e.target.value || undefined)}
            title="تاريخ الأرشفة إلى"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
