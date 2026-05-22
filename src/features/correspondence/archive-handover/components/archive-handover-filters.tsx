"use client";

import { Button, Input } from "@/components/ui";
import type { ArchiveHandoverQueryState, ConfidentialityLevel, CorrespondenceDirection, CorrespondencePriority, CorrespondenceSourceType, EligibleCorrespondenceStatus } from "../types";

interface ArchiveHandoverFiltersProps {
  query: ArchiveHandoverQueryState;
  onSearchChange: (value: string) => void;
  onFilterChange: (updates: Partial<ArchiveHandoverQueryState>) => void;
}

export function ArchiveHandoverFilters({
  query,
  onSearchChange,
  onFilterChange,
}: ArchiveHandoverFiltersProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <Input
        value={query.search || ""}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="بحث بالعنوان أو الرقم الإشاري أو الموضوع"
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <select
          aria-label="تصفية حسب المصدر"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          value={query.sourceType || ""}
          onChange={(event) =>
            onFilterChange({ sourceType: (event.target.value || undefined) as CorrespondenceSourceType | undefined })
          }
        >
          <option value="">كل المصادر</option>
          <option value="DIGITAL_GENERATED">رقمي</option>
          <option value="SCANNED_PHYSICAL">ممسوح</option>
        </select>

        <select
          aria-label="تصفية حسب الحالة"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          value={query.status || ""}
          onChange={(event) =>
            onFilterChange({ status: (event.target.value || undefined) as EligibleCorrespondenceStatus | undefined })
          }
        >
          <option value="">كل الحالات المؤهلة</option>
          <option value="GENERATED">مولدة (جاهزة للإحالة)</option>
          <option value="RECEIVED">مستلمة (جاهزة للإحالة)</option>
          <option value="ARCHIVE_PENDING">بانتظار الأرشفة (عرض فقط)</option>
        </select>

        <select
          aria-label="تصفية حسب الاتجاه"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          value={query.direction || ""}
          onChange={(event) =>
            onFilterChange({ direction: (event.target.value || undefined) as CorrespondenceDirection | undefined })
          }
        >
          <option value="">كل الاتجاهات</option>
          <option value="INCOMING">وارد</option>
          <option value="OUTGOING">صادر</option>
          <option value="INTERNAL">داخلي</option>
        </select>

        <select
          aria-label="تصفية حسب الأولوية"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          value={query.priority || ""}
          onChange={(event) =>
            onFilterChange({ priority: (event.target.value || undefined) as CorrespondencePriority | undefined })
          }
        >
          <option value="">كل الأولويات</option>
          <option value="LOW">منخفضة</option>
          <option value="NORMAL">عادية</option>
          <option value="HIGH">مرتفعة</option>
          <option value="URGENT">عاجلة</option>
        </select>

        <select
          aria-label="تصفية حسب السرية"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          value={query.confidentiality || ""}
          onChange={(event) =>
            onFilterChange({
              confidentiality: (event.target.value || undefined) as ConfidentialityLevel | undefined,
            })
          }
        >
          <option value="">كل درجات السرية</option>
          <option value="PUBLIC">عام</option>
          <option value="INTERNAL">داخلي</option>
          <option value="CONFIDENTIAL">سري</option>
          <option value="SECRET">سري جدًا</option>
          <option value="TOP_SECRET">سري للغاية</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          type="date"
          value={query.dateFrom || ""}
          onChange={(event) => onFilterChange({ dateFrom: event.target.value || undefined })}
        />
        <Input
          type="date"
          value={query.dateTo || ""}
          onChange={(event) => onFilterChange({ dateTo: event.target.value || undefined })}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            onFilterChange({
              search: undefined,
              sourceType: undefined,
              status: undefined,
              direction: undefined,
              priority: undefined,
              confidentiality: undefined,
              dateFrom: undefined,
              dateTo: undefined,
              page: 1,
            })
          }
        >
          إعادة التصفية
        </Button>
      </div>
    </div>
  );
}
