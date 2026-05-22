"use client";

import { useMutation } from "@tanstack/react-query";
import type { UpdateFinalArchivePayload, UpdateFinalArchiveResponseDto } from "../types";
import { FinalArchiveAPI } from "../api/final-archive.api";

export function useUpdateFinalArchiveMetadata() {
  return useMutation<UpdateFinalArchiveResponseDto, Error, { id: string; payload: UpdateFinalArchivePayload }>({
    mutationFn: async ({ id, payload }) => {
      return FinalArchiveAPI.updateCorrespondence(id, payload);
    },
  });
}
