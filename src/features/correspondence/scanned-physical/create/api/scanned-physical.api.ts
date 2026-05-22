import type { ApiResponse } from "@/shared/types/api-response";
import { ApiClientError, type CreateScannedPhysicalPayload, type CreatedScannedPhysicalDto } from "../types";
import { appFetch } from "@/lib/api-client";

const ENDPOINT = "/api/v1/correspondence/scanned-physical";

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

function cleanOptional(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function appendIfPresent(formData: FormData, key: string, value?: string): void {
  const normalized = cleanOptional(value);
  if (normalized) {
    formData.append(key, normalized);
  }
}

function toApiError<T>(response: Response, json: ApiResponse<T>): ApiClientError {
  return new ApiClientError({
    status: response.status,
    code: json.error?.code,
    message: json.error?.message || "حدث خطأ أثناء تنفيذ الطلب",
    details: json.error?.details,
  });
}

export async function createScannedPhysicalCorrespondence(
  payload: CreateScannedPhysicalPayload
): Promise<CreatedScannedPhysicalDto> {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("title", payload.title.trim());
  formData.append("direction", payload.direction);

  appendIfPresent(formData, "referenceNumber", payload.referenceNumber);
  appendIfPresent(formData, "subject", payload.subject);
  appendIfPresent(formData, "correspondenceDate", payload.correspondenceDate);
  appendIfPresent(formData, "priority", payload.priority);
  appendIfPresent(formData, "confidentiality", payload.confidentiality);
  appendIfPresent(formData, "senderDepartmentId", payload.senderDepartmentId);
  appendIfPresent(formData, "receiverDepartmentId", payload.receiverDepartmentId);
  appendIfPresent(formData, "senderEntityId", payload.senderEntityId);
  appendIfPresent(formData, "receiverEntityId", payload.receiverEntityId);
  appendIfPresent(formData, "notes", payload.notes);

  const response = await appFetch(ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const json = await parseJsonSafely<CreatedScannedPhysicalDto>(response);

  if (!response.ok || !json.data) {
    throw toApiError(response, json);
  }

  return json.data;
}
