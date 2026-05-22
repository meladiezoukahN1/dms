"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type {
  ArchivedCorrespondenceQueryState,
  CorrespondenceSourceType,
  CorrespondenceDirection,
  CorrespondencePriority,
  ConfidentialityLevel,
} from "../types";

const DEFAULT_PAGE_SIZE = 20;

export function useArchivedCorrespondenceQueryState(): ArchivedCorrespondenceQueryState {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(
      1,
      parseInt(searchParams.get("pageSize") || DEFAULT_PAGE_SIZE.toString(), 10)
    );

    return {
      page,
      pageSize,
      search: searchParams.get("search") || undefined,
      sourceType: (searchParams.get("sourceType") || undefined) as
        | CorrespondenceSourceType
        | undefined,
      direction: (searchParams.get("direction") || undefined) as
        | CorrespondenceDirection
        | undefined,
      priority: (searchParams.get("priority") || undefined) as CorrespondencePriority | undefined,
      confidentiality: (searchParams.get("confidentiality") || undefined) as
        | ConfidentialityLevel
        | undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      archiveDateFrom: searchParams.get("archiveDateFrom") || undefined,
      archiveDateTo: searchParams.get("archiveDateTo") || undefined,
    };
  }, [searchParams]);
}
