"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  ArchivedCorrespondenceListResponse,
  ArchivedCorrespondenceQueryState,
} from "../types";
import { ArchivedCorrespondenceAPI } from "../api/archived-correspondence.api";

export function useArchivedCorrespondenceList(query: ArchivedCorrespondenceQueryState) {
  return useQuery<ArchivedCorrespondenceListResponse>({
    queryKey: [
      "archived-correspondence-list",
      query.page,
      query.pageSize,
      query.search,
      query.sourceType,
      query.direction,
      query.priority,
      query.confidentiality,
      query.dateFrom,
      query.dateTo,
      query.archiveDateFrom,
      query.archiveDateTo,
    ],
    queryFn: () => ArchivedCorrespondenceAPI.getList(query),
    staleTime: 30000,
    retry: 1,
  });
}
