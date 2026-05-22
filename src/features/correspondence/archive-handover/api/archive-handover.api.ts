import type { ApiResponse } from "@/shared/types/api-response";
import type {
  ArchiveHandoverListResponseDto,
  ArchiveHandoverQueryState,
  ApiClientError,
  SendToArchiveResponseDto,
  SendToArchivePayload,
  UpdateArchiveHandoverPayload,
  UpdateArchiveHandoverResponseDto,
} from "../types";
import { ApiClientError as ApiClientErrorClass } from "../types";
import { appFetch } from "@/lib/api-client";

const BASE_ENDPOINT = "/api/v1/correspondence/archive-handover";

function toApiError<T>(response: Response, json: ApiResponse<T>): ApiClientError {
  return new ApiClientErrorClass({
    status: response.status,
    code: json.error?.code,
    message: json.error?.message || "حدث خطأ أثناء تنفيذ الطلب",
    details: json.error?.details,
  });
}

async function parseJsonSafely<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    return (await response.json()) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      error: {
        code: "INVALID_JSON_RESPONSE",
        message: "تعذر قراءة استجابة الخادم",
      },
    };
  }
}

function appendParam(params: URLSearchParams, key: string, value: string | number | undefined): void {
  if (typeof value === "undefined" || value === "") {
    return;
  }

  params.set(key, String(value));
}

export async function getArchiveHandoverList(
  query: ArchiveHandoverQueryState
): Promise<ArchiveHandoverListResponseDto> {
  const params = new URLSearchParams();

  appendParam(params, "page", query.page);
  appendParam(params, "pageSize", query.pageSize);
  appendParam(params, "search", query.search);
  appendParam(params, "sourceType", query.sourceType);
  appendParam(params, "status", query.status);
  appendParam(params, "direction", query.direction);
  appendParam(params, "priority", query.priority);
  appendParam(params, "confidentiality", query.confidentiality);
  appendParam(params, "dateFrom", query.dateFrom);
  appendParam(params, "dateTo", query.dateTo);

  const response = await appFetch(`${BASE_ENDPOINT}?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  const json = await parseJsonSafely<ArchiveHandoverListResponseDto>(response);
  if (!response.ok || !json.data) {
    throw toApiError(response, json);
  }

  return json.data;
}

export async function patchArchiveHandoverCorrespondence(
  id: string,
  payload: UpdateArchiveHandoverPayload
): Promise<UpdateArchiveHandoverResponseDto> {
  const response = await appFetch(`${BASE_ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafely<UpdateArchiveHandoverResponseDto>(response);
  if (!response.ok || !json.data) {
    throw toApiError(response, json);
  }

  return json.data;
}

export async function sendArchiveHandover(
  id: string,
  payload: SendToArchivePayload
): Promise<SendToArchiveResponseDto> {
  const response = await appFetch(`${BASE_ENDPOINT}/${id}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await parseJsonSafely<SendToArchiveResponseDto>(response);
  if (!response.ok || !json.data) {
    throw toApiError(response, json);
  }

  return json.data;
}

export function getArchiveHandoverFilePreviewUrl(fileId: string): string {
  return `${BASE_ENDPOINT}/files/${fileId}/preview`;
}

export function getArchiveHandoverFileDownloadUrl(fileId: string): string {
  return `${BASE_ENDPOINT}/files/${fileId}/download`;
}
