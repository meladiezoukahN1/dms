import { AppError } from "@/server/core/errors/app-error";
import { getCurrentUser } from "@/server/core/auth/get-current-user";
import { SessionPolicy } from "./policy";
import { SessionRepository } from "./repository";
import type { SessionUser } from "./types";
import type { NextRequest } from "next/server";

export class SessionService {
  static async getCurrentSessionUser(request: NextRequest): Promise<SessionUser> {
    const currentUser = await getCurrentUser(request);
    const currentUserId = currentUser?.id ?? null;
    SessionPolicy.assertAuthenticated(currentUserId);

    const user = await SessionRepository.findUserById(currentUserId);

    if (!user) {
      throw new AppError("NOT_FOUND", 404, "المستخدم غير موجود");
    }

    return user;
  }
}
