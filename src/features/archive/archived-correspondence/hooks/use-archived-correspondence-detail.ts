"use client";

import { useQuery } from "@tanstack/react-query";
import type { ArchivedCorrespondenceDetail } from "../types";
import { ArchivedCorrespondenceAPI } from "../api/archived-correspondence.api";

export function useArchivedCorrespondenceDetail(id: string | null) {
  return useQuery<ArchivedCorrespondenceDetail>({
    queryKey: ["archived-correspondence-detail", id],
    queryFn: () => ArchivedCorrespondenceAPI.getDetail(id!),
    enabled: !!id,
    staleTime: 30000,
    retry: 1,
  });
}
