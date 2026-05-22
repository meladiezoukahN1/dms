"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { archiveHandoverQuerySchema } from "../schemas/archive-handover.schema";
import type { ArchiveHandoverQueryState } from "../types";

function normalizeValue(value: string): string | undefined {
  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

export function useArchiveHandoverQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo<ArchiveHandoverQueryState>(() => {
    const parsed = archiveHandoverQuerySchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      sourceType: searchParams.get("sourceType") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      direction: searchParams.get("direction") ?? undefined,
      priority: searchParams.get("priority") ?? undefined,
      confidentiality: searchParams.get("confidentiality") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
    });

    if (!parsed.success) {
      return {
        page: 1,
        pageSize: 10,
      };
    }

    return parsed.data;
  }, [searchParams]);

  function setQuery(updates: Partial<ArchiveHandoverQueryState>): void {
    const params = new URLSearchParams(searchParams.toString());

    const merged: ArchiveHandoverQueryState = {
      ...query,
      ...updates,
    };

    const keys: Array<keyof ArchiveHandoverQueryState> = [
      "page",
      "pageSize",
      "search",
      "sourceType",
      "status",
      "direction",
      "priority",
      "confidentiality",
      "dateFrom",
      "dateTo",
    ];

    keys.forEach((key) => {
      const value = merged[key];

      if (typeof value === "undefined" || value === null || value === "") {
        params.delete(key);
        return;
      }

      params.set(key, String(value));
    });

    router.push(`${pathname}?${params.toString()}`);
  }

  function setSearch(value: string): void {
    setQuery({
      search: normalizeValue(value),
      page: 1,
    });
  }

  function setFilter(updates: Partial<ArchiveHandoverQueryState>): void {
    setQuery({
      ...updates,
      page: 1,
    });
  }

  function setPage(page: number): void {
    setQuery({ page });
  }

  function setPageSize(pageSize: number): void {
    setQuery({ pageSize, page: 1 });
  }

  return {
    query,
    setSearch,
    setFilter,
    setPage,
    setPageSize,
  };
}
