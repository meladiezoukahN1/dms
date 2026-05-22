"use client";

import { useMutation } from "@tanstack/react-query";
import type { ArchiveCorrespondencePayload, ArchiveCorrespondenceResponseDto } from "../types";
import { FinalArchiveAPI } from "../api/final-archive.api";

export function useFinalArchiveAction() {
  return useMutation<ArchiveCorrespondenceResponseDto, Error, { id: string; payload: ArchiveCorrespondencePayload }>({
    mutationFn: async ({ id, payload }) => {
      return FinalArchiveAPI.archiveCorrespondence(id, payload);
    },
  });
}
