import { API_ROUTES } from "@/shared/constants/routes";
import type { ApiResponse } from "@/shared/types/api-response";
import type { RegisterFormData, RegisterResponse, RegistrationError } from "../types";

/**
 * HTTP client function for registration
 * Handles API communication only
 */
export async function registerUser(
  data: RegisterFormData
): Promise<{ data?: RegisterResponse; error?: RegistrationError }> {
  try {
    const response = await fetch(API_ROUTES.V1.AUTH.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json: ApiResponse<RegisterResponse> = await response.json();

    if (!response.ok) {
      const details = json.error?.details as
        | { fieldErrors?: Record<string, string[]> }
        | undefined;

      return {
        error: {
          code: json.error?.code || "UNKNOWN_ERROR",
          message: json.error?.message || "An error occurred during registration",
          fieldErrors: details?.fieldErrors,
        },
      };
    }

    if (!json.data) {
      return {
        error: {
          code: "INVALID_RESPONSE",
          message: "Invalid response from server",
        },
      };
    }

    return { data: json.data };
  } catch (error) {
    console.error("Registration API error:", error);
    return {
      error: {
        code: "NETWORK_ERROR",
        message: "Network error occurred. Please check your connection.",
      },
    };
  }
}
