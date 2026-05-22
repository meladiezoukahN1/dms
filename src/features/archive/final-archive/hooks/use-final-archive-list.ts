"use client";

import { useQuery } from "@tanstack/react-query";
import type { FinalArchiveListResponseDto, FinalArchiveQueryState } from "../types";
import { FinalArchiveAPI } from "../api/final-archive.api";

export function useFinalArchiveList(query: FinalArchiveQueryState) {
  return useQuery<FinalArchiveListResponseDto>({
    queryKey: [
      "final-archive-list",
      query.page,
      query.pageSize,
      query.search,
      query.sourceType,
      query.direction,
      query.priority,
      query.confidentiality,
      query.dateFrom,
      query.dateTo,
    ],
    queryFn: () => FinalArchiveAPI.getFinalArchiveList(query),
    staleTime: 30000,
    retry: 1,
  });
}
