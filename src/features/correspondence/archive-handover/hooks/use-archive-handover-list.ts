"use client";

import { useQuery } from "@tanstack/react-query";
import { getArchiveHandoverList } from "../api/archive-handover.api";
import type { ArchiveHandoverQueryState } from "../types";

export function useArchiveHandoverList(query: ArchiveHandoverQueryState) {
  return useQuery({
    queryKey: ["archive-handover", query],
    queryFn: () => getArchiveHandoverList(query),
    staleTime: 0,
  });
}
