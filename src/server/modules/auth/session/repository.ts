import { prisma } from "@/lib/prisma/client";
import type { SessionUser } from "./types";

export class SessionRepository {
  static async findUserById(userId: string): Promise<SessionUser | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true,
      },
    });
  }
}
