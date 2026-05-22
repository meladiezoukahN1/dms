/**
 * Frontend types for Dashboard Home
 * Maps to backend DTOs from @/server/modules/dashboard/overview/types
 */

export interface MonthlyCorrespondenceData {
  month: number;
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
  createdAt: string;
}

export interface ArchiveTask {
  id: string;
  title: string;
  referenceNumber: string | null;
  archiveHandoverAt: string | null;
  fileCount: number;
}

export interface RecentArchivedCorrespondence {
  id: string;
  title: string;
  referenceNumber: string | null;
  archivedAt: string;
}

export interface DashboardStats {
  totalCorrespondences: number;
  digitalGenerated: number;
  scannedPhysical: number;
  pendingArchive: number;
  archived: number;
  createdToday: number;
  createdThisMonth: number;
  archiveCompletionPercentage: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  monthlyData: MonthlyCorrespondenceData[];
  statusDistribution: StatusDistribution;
  recentCorrespondences: RecentCorrespondence[];
  archiveTasks: ArchiveTask[];
  recentArchivedCorrespondences: RecentArchivedCorrespondence[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
