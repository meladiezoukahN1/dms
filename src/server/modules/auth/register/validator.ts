import { z } from "zod";
import { ValidationError } from "@/server/core/errors/validation-error";
import { formatZodError } from "@/server/core/errors/format-zod-error";
import type { RegisterInput } from "./types";

const registerSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain lowercase, uppercase, and numbers"
      ),
    confirmPassword: z.string(),
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters"),
    accountType: z.enum(["individual", "organization"]),
    organizationName: z
      .string()
      .min(2, "Organization name must be at least 2 characters")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.accountType === "organization") {
        return !!data.organizationName;
      }
      return true;
    },
    {
      message: "Organization name is required for organization accounts",
      path: ["organizationName"],
    }
  );

export class RegisterValidator {
  static validate(data: unknown): RegisterInput {
    try {
      return registerSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = formatZodError(error);
        throw new ValidationError("Invalid registration data", fieldErrors);
      }
      throw error;
    }
  }
}
