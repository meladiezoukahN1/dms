import { prisma } from '@/lib/prisma/client';
import type {
  MonthlyCorrespondenceData,
  StatusDistribution,
  RecentCorrespondence,
  ArchiveTask,
  RecentArchivedCorrespondence,
} from './types';

/**
 * Repository for Dashboard Overview data access
 * Contains all Prisma queries for dashboard statistics
 */
export class DashboardOverviewRepository {
  /**
   * Count total correspondences (not deleted)
   */
  static async getTotalCorrespondences(): Promise<number> {
    return prisma.correspondence.count({
      where: { deletedAt: null },
    });
  }

  /**
   * Count digital generated correspondences
   */
  static async getDigitalGeneratedCount(): Promise<number> {
    return prisma.correspondence.count({
      where: {
        sourceType: 'DIGITAL_GENERATED',
        deletedAt: null,
      },
    });
  }

  /**
   * Count scanned physical correspondences
   */
  static async getScannedPhysicalCount(): Promise<number> {
    return prisma.correspondence.count({
      where: {
        sourceType: 'SCANNED_PHYSICAL',
        deletedAt: null,
      },
    });
  }

  /**
   * Count pending archive correspondences
   */
  static async getPendingArchiveCount(): Promise<number> {
    return prisma.correspondence.count({
      where: {
        status: 'ARCHIVE_PENDING',
        deletedAt: null,
      },
    });
  }

  /**
   * Count archived correspondences
   */
  static async getArchivedCount(): Promise<number> {
    return prisma.correspondence.count({
      where: {
        status: 'ARCHIVED',
        deletedAt: null,
      },
    });
  }

  /**
   * Count correspondences created today
   */
  static async getCreatedTodayCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return prisma.correspondence.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        deletedAt: null,
      },
    });
  }

  /**
   * Count correspondences created this month
   */
  static async getCreatedThisMonthCount(): Promise<number> {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return prisma.correspondence.count({
      where: {
        createdAt: {
          gte: firstDay,
          lt: firstDayNextMonth,
        },
        deletedAt: null,
      },
    });
  }

  /**
   * Get monthly correspondence data for current and previous months
   * Returns data for current month and 11 previous months
   */
  static async getMonthlyCorrespondenceData(): Promise<MonthlyCorrespondenceData[]> {
    const now = new Date();
    const monthData: MonthlyCorrespondenceData[] = [];

    // Get data for current month and 11 previous months
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth() + 1;

      const firstDay = new Date(year, month - 1, 1);
      const firstDayNextMonth = new Date(year, month, 1);

      const [digitalGenerated, scannedPhysical] = await Promise.all([
        prisma.correspondence.count({
          where: {
            sourceType: 'DIGITAL_GENERATED',
            createdAt: {
              gte: firstDay,
              lt: firstDayNextMonth,
            },
            deletedAt: null,
          },
        }),
        prisma.correspondence.count({
          where: {
            sourceType: 'SCANNED_PHYSICAL',
            createdAt: {
              gte: firstDay,
              lt: firstDayNextMonth,
            },
            deletedAt: null,
          },
        }),
      ]);

      monthData.push({
        month,
        year,
        digitalGenerated,
        scannedPhysical,
      });
    }

    return monthData;
  }

  /**
   * Get status distribution of all correspondences
   */
  static async getStatusDistribution(): Promise<StatusDistribution> {
    const results = await prisma.correspondence.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: true,
    });

    const distribution: StatusDistribution = {
      DRAFT: 0,
      GENERATED: 0,
      RECEIVED: 0,
      ARCHIVE_PENDING: 0,
      ARCHIVED: 0,
    };

    results.forEach((result) => {
      if (result.status === 'DRAFT') distribution.DRAFT = result._count;
      else if (result.status === 'GENERATED') distribution.GENERATED = result._count;
      else if (result.status === 'RECEIVED') distribution.RECEIVED = result._count;
      else if (result.status === 'ARCHIVE_PENDING') distribution.ARCHIVE_PENDING = result._count;
      else if (result.status === 'ARCHIVED') distribution.ARCHIVED = result._count;
    });

    return distribution;
  }

  /**
   * Get recent correspondences (last 5 created)
   */
  static async getRecentCorrespondences(): Promise<RecentCorrespondence[]> {
    const records = await prisma.correspondence.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        title: true,
        referenceNumber: true,
        sourceType: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return records.map((record) => ({
      id: record.id,
      title: record.title,
      referenceNumber: record.referenceNumber,
      sourceType: record.sourceType,
      status: record.status,
      createdAt: record.createdAt.toISOString(),
    }));
  }

  /**
   * Get archive tasks (ARCHIVE_PENDING correspondences with file counts)
   */
  static async getArchiveTasks(): Promise<ArchiveTask[]> {
    const records = await prisma.correspondence.findMany({
      where: {
        status: 'ARCHIVE_PENDING',
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        referenceNumber: true,
        archiveHandoverAt: true,
        files: {
          select: { id: true },
        },
      },
      orderBy: { archiveHandoverAt: 'asc' },
      take: 5,
    });

    return records.map((record) => ({
      id: record.id,
      title: record.title,
      referenceNumber: record.referenceNumber,
      archiveHandoverAt: record.archiveHandoverAt?.toISOString() ?? null,
      fileCount: record.files.length,
    }));
  }

  /**
   * Get most recently archived correspondences
   */
  static async getRecentArchivedCorrespondences(): Promise<RecentArchivedCorrespondence[]> {
    const records = await prisma.correspondence.findMany({
      where: {
        status: 'ARCHIVED',
        deletedAt: null,
        archivedAt: {
          not: null,
        },
      },
      select: {
        id: true,
        title: true,
        referenceNumber: true,
        archivedAt: true,
      },
      orderBy: {
        archivedAt: 'desc',
      },
      take: 5,
    });

    return records
      .filter((record) => record.archivedAt)
      .map((record) => ({
        id: record.id,
        title: record.title,
        referenceNumber: record.referenceNumber,
        archivedAt: record.archivedAt!.toISOString(),
      }));
  }
}
