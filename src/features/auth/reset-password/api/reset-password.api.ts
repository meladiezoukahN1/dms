import { API_ROUTES } from "@/shared/constants/routes";
import type { ApiResponse } from "@/shared/types/api-response";
import type { ResetPasswordValues, VerifyOtpValues } from "../types";

export async function verifyResetOtp(payload: VerifyOtpValues): Promise<boolean> {
  const response = await fetch(API_ROUTES.V1.AUTH.VERIFY_RESET_OTP, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await response.json()) as ApiResponse<{ valid: boolean }>;
  if (!response.ok || !json.data) {
    return false;
  }

  return json.data.valid;
}

export async function submitResetPassword(payload: ResetPasswordValues): Promise<string> {
  const response = await fetch(API_ROUTES.V1.AUTH.RESET_PASSWORD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await response.json()) as ApiResponse<{ message: string }>;

  if (!response.ok || !json.data) {
    throw new Error(json.error?.message || "تعذر إعادة تعيين كلمة المرور");
  }

  return json.data.message;
}
