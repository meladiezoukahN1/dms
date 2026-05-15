import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
