import { hash } from "bcryptjs";
import type { NextRequest } from "next/server";
import { AppError } from "@/server/core/errors/app-error";
import { getCurrentUser } from "@/server/core/auth/get-current-user";
import { UsersPolicy } from "./policy";
import { UsersRepository } from "./repository";
import { UsersValidator } from "./validator";
import type { UserListItem, UserListOutput } from "./types";

async function resolveAdminUser(request: NextRequest) {
  const currentUser = await getCurrentUser(request);
  UsersPolicy.enforceAuthenticated(currentUser?.id ?? null);

  const user = await UsersRepository.findForAuth(currentUser!.id);
  if (!user) {
    throw new AppError("NOT_FOUND", 404, "المستخدم غير موجود");
  }
  UsersPolicy.enforceActiveUser(user.status);
  UsersPolicy.enforceIsAdmin(user.accountType);
  return user;
}

export class UsersService {
  static async list(rawQuery: unknown, request: NextRequest): Promise<UserListOutput> {
    await resolveAdminUser(request);
    const query = UsersValidator.validateListQuery(rawQuery);
    return UsersRepository.getList(query);
  }

  static async create(rawInput: unknown, request: NextRequest): Promise<UserListItem> {
    await resolveAdminUser(request);
    const input = UsersValidator.validateCreateInput(rawInput);

    const existing = await UsersRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("CONFLICT", 409, "البريد الإلكتروني مستخدم بالفعل");
    }

    const passwordHash = await hash(input.password, 12);
    return UsersRepository.create({ ...input, passwordHash });
  }

  static async updateStatus(
    id: string,
    rawInput: unknown,
    request: NextRequest
  ): Promise<UserListItem> {
    await resolveAdminUser(request);
    const { status } = UsersValidator.validateStatusUpdate(rawInput);

    const existing = await UsersRepository.findById(id);
    if (!existing) {
      throw new AppError("NOT_FOUND", 404, "المستخدم غير موجود");
    }

    return UsersRepository.updateStatus(id, status);
  }
}
