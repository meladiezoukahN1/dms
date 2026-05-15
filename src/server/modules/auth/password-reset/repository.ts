import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";
import { AuditLogger } from "@/lib/audit/audit-logger";
import type { PasswordResetTokenRecord, PasswordResetUserRecord, PasswordResetMetadata } from "./types";

export class PasswordResetRepository {
  static async findUserByEmail(email: string): Promise<PasswordResetUserRecord | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true,
      },
    });
  }

  static async invalidateUnusedTokens(tx: Prisma.TransactionClient, userId: string): Promise<void> {
    await tx.passwordResetToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  static async createResetToken(
    tx: Prisma.TransactionClient,
    userId: string,
    otpHash: string,
    expiresAt: Date
  ): Promise<PasswordResetTokenRecord> {
    return tx.passwordResetToken.create({
      data: {
        userId,
        otpHash,
        expiresAt,
      },
      select: {
        id: true,
        userId: true,
        otpHash: true,
        expiresAt: true,
        usedAt: true,
      },
    });
  }

  static async findLatestToken(userId: string): Promise<PasswordResetTokenRecord | null> {
    return prisma.passwordResetToken.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        userId: true,
        otpHash: true,
        expiresAt: true,
        usedAt: true,
      },
    });
  }

  static async markTokenUsed(tx: Prisma.TransactionClient, tokenId: string): Promise<void> {
    await tx.passwordResetToken.update({
      where: { id: tokenId },
      data: {
        usedAt: new Date(),
      },
    });
  }

  static async updateUserPassword(tx: Prisma.TransactionClient, userId: string, passwordHash: string): Promise<void> {
    await tx.user.update({
      where: { id: userId },
      data: {
        passwordHash,
      },
    });
  }

  static async executeForgotPasswordTransaction(
    userId: string,
    otpHash: string,
    expiresAt: Date,
    metadata?: PasswordResetMetadata
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await this.invalidateUnusedTokens(tx, userId);
      await this.createResetToken(tx, userId, otpHash, expiresAt);
      await AuditLogger.log(
        {
          actorUserId: userId,
          action: "PASSWORD_RESET_REQUESTED",
          entityType: "USER",
          entityId: userId,
          metadata: {
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
          },
        },
        tx
      );
    });
  }

  static async executeResetPasswordTransaction(
    userId: string,
    tokenId: string,
    passwordHash: string,
    metadata?: PasswordResetMetadata
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await this.updateUserPassword(tx, userId, passwordHash);
      await this.markTokenUsed(tx, tokenId);
      await AuditLogger.log(
        {
          actorUserId: userId,
          action: "PASSWORD_RESET_COMPLETED",
          entityType: "USER",
          entityId: userId,
          metadata: {
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
          },
        },
        tx
      );
    });
  }
}
