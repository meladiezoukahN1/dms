import { z } from "zod";
import { ValidationError } from "@/server/core/errors/validation-error";
import { formatZodError } from "@/server/core/errors/format-zod-error";
import type { CredentialsInput } from "./types";

const credentialsSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export class CredentialsValidator {
  static validate(input: unknown): CredentialsInput {
    const parsed = credentialsSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError("بيانات تسجيل الدخول غير صالحة", formatZodError(parsed.error));
    }

    return {
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
    };
  }
}
