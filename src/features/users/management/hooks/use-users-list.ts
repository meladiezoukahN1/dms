import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/users-management.api";
import type { UsersQueryState } from "../types";

export function useUsersList(query: UsersQueryState) {
  return useQuery({
    queryKey: ["users-list", query.page, query.pageSize, query.search],
    queryFn: () => getUsers(query),
    staleTime: 30_000,
    retry: 1,
  });
}
