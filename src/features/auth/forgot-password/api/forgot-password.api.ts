import { API_ROUTES } from "@/shared/constants/routes";
import type { ApiResponse } from "@/shared/types/api-response";
import type { ForgotPasswordResponse, ForgotPasswordValues } from "../types";

export async function requestForgotPassword(payload: ForgotPasswordValues): Promise<ForgotPasswordResponse> {
  const response = await fetch(API_ROUTES.V1.AUTH.FORGOT_PASSWORD, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = (await response.json()) as ApiResponse<ForgotPasswordResponse>;

  if (!response.ok || !json.data) {
    throw new Error(json.error?.message || "تعذر إرسال الطلب");
  }

  return json.data;
}
