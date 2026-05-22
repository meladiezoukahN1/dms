import { appFetch } from "@/lib/api-client";
import type { ApiResponse } from "@/shared/types/api-response";
import {
  ApiClientError,
  type CreateUserPayload,
  type UpdateStatusPayload,
  type UserDto,
  type UsersListResponseDto,
  type UsersQueryState,
} from "../types";

const BASE = "/api/v1/users";

async function parseJson<T>(res: Response): Promise<ApiResponse<T>> {
  try {
    return (await res.json()) as ApiResponse<T>;
  } catch {
    return { success: false, error: { code: "INVALID_JSON", message: "تعذر قراءة استجابة الخادم" } };
  }
}

function toError<T>(res: Response, json: ApiResponse<T>): ApiClientError {
  return new ApiClientError({
    status: res.status,
    code: json.error?.code,
    message: json.error?.message ?? "حدث خطأ أثناء تنفيذ الطلب",
    details: json.error?.details,
  });
}

export async function getUsers(query: UsersQueryState): Promise<UsersListResponseDto> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));
  if (query.search) params.set("search", query.search);

  const res = await appFetch(`${BASE}?${params}`, { cache: "no-store" });
  const json = await parseJson<UsersListResponseDto>(res);
  if (!res.ok || !json.data) throw toError(res, json);
  return json.data;
}

export async function createUser(payload: CreateUserPayload): Promise<UserDto> {
  const res = await appFetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await parseJson<UserDto>(res);
  if (!res.ok || !json.data) throw toError(res, json);
  return json.data;
}

export async function updateUserStatus(
  id: string,
  payload: UpdateStatusPayload
): Promise<UserDto> {
  const res = await appFetch(`${BASE}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await parseJson<UserDto>(res);
  if (!res.ok || !json.data) throw toError(res, json);
  return json.data;
}
