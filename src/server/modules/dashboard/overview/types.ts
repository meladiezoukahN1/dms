/**
 * Dashboard Overview DTOs
 */

export interface MonthlyCorrespondenceData {
  month: number; // 1-12
  year: number;
  digitalGenerated: number;
  scannedPhysical: number;
}

export interface StatusDistribution {
  DRAFT: number;
  GENERATED: number;
  RECEIVED: number;
  ARCHIVE_PENDING: number;
  ARCHIVED: number;
}

export interface RecentCorrespondence {
  id: string;
  title: string;
  referenceNumber: string | null;
  sourceType: 'DIGITAL_GENERATED' | 'SCANNED_PHYSICAL' | 'IMPORTED_FILE';
  status: string;
  createdAt: string; // ISO string
}

export interface ArchiveTask {
  id: string;
  title: string;
  referenceNumber: string | null;
  archiveHandoverAt: string | null; // ISO string
  fileCount: number;
}

export interface RecentArchivedCorrespondence {
  id: string;
  title: string;
  referenceNumber: string | null;
  archivedAt: string;
}

/**
 * Main dashboard overview DTO
 */
export interface DashboardOverviewDTO {
  stats: {
    totalCorrespondences: number;
    digitalGenerated: number;
    scannedPhysical: number;
    pendingArchive: number;
    archived: number;
    createdToday: number;
    createdThisMonth: number;
    archiveCompletionPercentage: number;
  };
  monthlyData: MonthlyCorrespondenceData[];
  statusDistribution: StatusDistribution;
  recentCorrespondences: RecentCorrespondence[];
  archiveTasks: ArchiveTask[];
  recentArchivedCorrespondences: RecentArchivedCorrespondence[];
}
