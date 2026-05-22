import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../api/users-management.api";
import type { CreateUserPayload } from "../types";

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
  });
}
