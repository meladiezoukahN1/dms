import { DashboardOverviewRepository } from './repository';
import type { DashboardOverviewDTO } from './types';

/**
 * Service for Dashboard Overview business logic
 * 
 * Responsibilities:
 * - Orchestrate repository calls
 * - Calculate derived metrics
 * - Format data for frontend DTOs
 */
export class DashboardOverviewService {
  /**
   * Get complete dashboard overview data
   */
  static async getDashboardOverview(): Promise<DashboardOverviewDTO> {
    const [
      totalCorrespondences,
      digitalGenerated,
      scannedPhysical,
      pendingArchive,
      archived,
      createdToday,
      createdThisMonth,
      monthlyData,
      statusDistribution,
      recentCorrespondences,
      archiveTasks,
      recentArchivedCorrespondences,
    ] = await Promise.all([
      DashboardOverviewRepository.getTotalCorrespondences(),
      DashboardOverviewRepository.getDigitalGeneratedCount(),
      DashboardOverviewRepository.getScannedPhysicalCount(),
      DashboardOverviewRepository.getPendingArchiveCount(),
      DashboardOverviewRepository.getArchivedCount(),
      DashboardOverviewRepository.getCreatedTodayCount(),
      DashboardOverviewRepository.getCreatedThisMonthCount(),
      DashboardOverviewRepository.getMonthlyCorrespondenceData(),
      DashboardOverviewRepository.getStatusDistribution(),
      DashboardOverviewRepository.getRecentCorrespondences(),
      DashboardOverviewRepository.getArchiveTasks(),
      DashboardOverviewRepository.getRecentArchivedCorrespondences(),
    ]);

    // Calculate archive completion percentage
    const archiveTotal = pendingArchive + archived;
    const archiveCompletionPercentage =
      archiveTotal > 0 ? Math.round((archived / archiveTotal) * 100) : 0;

    return {
      stats: {
        totalCorrespondences,
        digitalGenerated,
        scannedPhysical,
        pendingArchive,
        archived,
        createdToday,
        createdThisMonth,
        archiveCompletionPercentage,
      },
      monthlyData,
      statusDistribution,
      recentCorrespondences,
      archiveTasks,
      recentArchivedCorrespondences,
    };
  }
}
