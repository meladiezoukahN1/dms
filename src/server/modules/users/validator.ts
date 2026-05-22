import { z } from "zod";
import { ValidationError } from "@/server/core/errors/validation-error";
import { formatZodError } from "@/server/core/errors/format-zod-error";
import type { AccountStatus } from "@prisma/client";
import type { CreateUserInput, UpdateUserStatusInput, UserListQuery } from "./types";

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

const createUserSchema = z.object({
  fullName: z.string().min(2, "الاسم الكامل مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم"),
  accountType: z.enum(["admin", "staff"] as const),
});

const updateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED"] as const),
});

export class UsersValidator {
  static validateListQuery(raw: unknown): UserListQuery {
    const result = listQuerySchema.safeParse(raw);
    if (!result.success) {
      throw new ValidationError("معايير البحث غير صالحة", formatZodError(result.error));
    }
    return result.data;
  }

  static validateCreateInput(raw: unknown): CreateUserInput {
    const result = createUserSchema.safeParse(raw);
    if (!result.success) {
      throw new ValidationError("بيانات المستخدم غير صالحة", formatZodError(result.error));
    }
    return result.data;
  }

  static validateStatusUpdate(raw: unknown): UpdateUserStatusInput {
    const result = updateStatusSchema.safeParse(raw);
    if (!result.success) {
      throw new ValidationError("حالة المستخدم غير صالحة", formatZodError(result.error));
    }
    return { status: result.data.status as AccountStatus };
  }
}
