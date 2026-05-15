import { z } from "zod";

/**
 * Frontend validation schema for registration form
 * Mirrors server-side validation but optimized for UX feedback
 */
export const registerFormSchema = z
  .object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /^(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/^(?=.*\d)/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters"),
    accountType: z.enum(["individual", "organization"]),
    organizationName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.accountType === "organization") {
        return data.organizationName && data.organizationName.length >= 2;
      }
      return true;
    },
    {
      message: "Organization name is required and must be at least 2 characters",
      path: ["organizationName"],
    }
  );

export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;
