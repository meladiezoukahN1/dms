"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchArchiveHandoverCorrespondence } from "../api/archive-handover.api";
import type { ApiClientError, UpdateArchiveHandoverPayload } from "../types";

export function useUpdateArchiveHandoverCorrespondence() {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiClientError, { id: string; payload: UpdateArchiveHandoverPayload }>({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateArchiveHandoverPayload }) =>
      patchArchiveHandoverCorrespondence(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["archive-handover"] });
    },
  });
}
