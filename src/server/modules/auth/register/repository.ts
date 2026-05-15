import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { AuditLogger } from "@/lib/audit/audit-logger";
import { ConflictError } from "@/server/core/errors/conflict-error";
import type { CreateUserData, RegisterOutput } from "./types";

/**
 * Repository for user registration data access
 * ONLY place where Prisma is used
 */
export class RegisterRepository {
  static async findByEmail(db: Prisma.TransactionClient, email: string) {
    return db.user.findUnique({
      where: { email },
    });
  }

  static async create(
    db: Prisma.TransactionClient,
    data: CreateUserData
  ): Promise<RegisterOutput> {
    // Check if user already exists
    const existing = await this.findByEmail(db, data.email);
    if (existing) {
      throw new ConflictError("Email address already registered", "user");
    }

    const user = await db.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        accountType: data.accountType,
        organizationName: data.organizationName,
        status: "PENDING",
      },
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      accountType: user.accountType ?? "",
      createdAt: user.createdAt,
    };
  }

  static async executeRegisterTransaction(
    data: CreateUserData,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<RegisterOutput> {
    return prisma.$transaction(async (tx) => {
      const output = await this.create(tx, data);

      // Log to audit trail
      await AuditLogger.log(
        {
          actorUserId: output.id,
          action: "USER_REGISTERED",
          entityType: "USER",
          entityId: output.id,
          metadata: {
            email: data.email,
            accountType: data.accountType,
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
          },
        },
        tx
      );

      return output;
    });
  }
}
