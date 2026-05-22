"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendArchiveHandover } from "../api/archive-handover.api";
import type { ApiClientError, SendToArchivePayload, SendToArchiveResponseDto } from "../types";

export function useSendToArchive() {
  const queryClient = useQueryClient();

  return useMutation<SendToArchiveResponseDto, ApiClientError, { id: string; payload: SendToArchivePayload }>({
    mutationFn: ({ id, payload }) => sendArchiveHandover(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["archive-handover"] });
    },
  });
}
