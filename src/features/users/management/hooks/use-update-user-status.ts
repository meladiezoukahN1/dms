import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserStatus } from "../api/users-management.api";
import type { UpdateStatusPayload } from "../types";

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStatusPayload }) =>
      updateUserStatus(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
  });
}
