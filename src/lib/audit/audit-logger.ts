import type { Prisma, PrismaClient, $Enums } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";

export interface AuditLogEntry {
  actorUserId?: string;
  action: $Enums.AuditAction;
  entityType: $Enums.AuditEntityType;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

type AuditDbClient = PrismaClient | Prisma.TransactionClient;

/**
 * Audit logger for tracking all mutations
 */
export class AuditLogger {
  static async log(entry: AuditLogEntry, db: AuditDbClient = prisma): Promise<void> {
    try {
      await db.auditLog.create({
        data: {
          actorUserId: entry.actorUserId,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          metadata: entry.metadata as Prisma.InputJsonValue | undefined,
        },
      });
    } catch (error) {
      console.error("Failed to write audit log:", error);
    }
  }
}
