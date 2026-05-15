import { prisma } from "@/lib/prisma/client";
import type { CredentialUserRecord } from "./types";

export class CredentialsRepository {
  static async findByEmail(email: string): Promise<CredentialUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        passwordHash: true,
        status: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      status: user.status,
    };
  }
}
