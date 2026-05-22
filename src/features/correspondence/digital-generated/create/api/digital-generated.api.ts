import type { ApiResponse } from "@/shared/types/api-response";
import {
  ApiClientError,
  type CreateDigitalCorrespondencePayload,
  type CreatedDigitalCorrespondenceDto,
  type GeneratedDigitalCorrespondencePdfDto,
} from "../types";
import { appFetch } from "@/lib/api-client";

const DIGITAL_GENERATED_ENDPOINT = "/api/v1/correspondence/digital-generated";

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

function toApiError<T>(response: Response, json: ApiResponse<T>): ApiClientError {
  return new ApiClientError({
    status: response.status,
    code: json.error?.code,
    message: json.error?.message || "حدث خطأ أثناء تنفيذ الطلب",
    details: json.error?.details,
  });
}

export async function createDigitalGeneratedDraft(
  payload: CreateDigitalCorrespondencePayload
): Promise<CreatedDigitalCorrespondenceDto> {
  const response = await appFetch(DIGITAL_GENERATED_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: payload.title.trim(),
      referenceNumber: cleanOptional(payload.referenceNumber),
      subject: cleanOptional(payload.subject),
      body: cleanOptional(payload.body),
      direction: payload.direction,
      templateId: cleanOptional(payload.templateId),
      formData: payload.formData,
      priority: payload.priority,
      confidentiality: payload.confidentiality,
      correspondenceDate: cleanOptional(payload.correspondenceDate),
      receiverDepartmentId: cleanOptional(payload.receiverDepartmentId),
      receiverEntityId: cleanOptional(payload.receiverEntityId),
    }),
  });

  const json = await parseJsonSafely<CreatedDigitalCorrespondenceDto>(response);

  if (!response.ok || !json.data) {
    throw toApiError(response, json);
  }

  return json.data;
}

export async function generateDigitalGeneratedPdf(
  correspondenceId: string
): Promise<GeneratedDigitalCorrespondencePdfDto> {
  const response = await appFetch(`${DIGITAL_GENERATED_ENDPOINT}/${correspondenceId}/generate-pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await parseJsonSafely<GeneratedDigitalCorrespondencePdfDto>(response);

  if (!response.ok || !json.data) {
    throw toApiError(response, json);
  }

  return json.data;
}
