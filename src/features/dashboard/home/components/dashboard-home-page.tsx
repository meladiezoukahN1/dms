'use client';

import {
  Archive,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Files,
  FolderArchive,
  ScanLine,
} from 'lucide-react';
import { useDashboardStats } from '../hooks/use-dashboard-stats';
import { DashboardStatCard } from './dashboard-stat-card';
import { MonthlyCorrespondenceChart } from './monthly-correspondence-chart';
import { CorrespondenceStatusChart } from './correspondence-status-chart';
import { ArchiveProgressChart } from './archive-progress-chart';
import { RecentCorrespondenceList } from './recent-correspondence-list';
import { ArchiveTaskList } from './archive-task-list';
import { RecentArchiveList } from './recent-archive-list';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Main Dashboard Home Page Component
 * Fetches dashboard data and renders statistics, charts, and lists
 */
export function DashboardHomePage() {
  const { data, isLoading, error } = useDashboardStats();

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 bg-destructive/5 border-destructive/20">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            خطأ عند تحميل البيانات
          </h2>
          <p className="text-sm text-muted-foreground">
            حدث خطأ أثناء جلب بيانات لوحة المعلومات. يرجى حاول مرة أخرى لاحقاً.
          </p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-56 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-56 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-56 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
        </Card>
      </div>
    );
  }

  const {
    stats,
    monthlyData,
    statusDistribution,
    recentCorrespondences,
    archiveTasks,
    recentArchivedCorrespondences,
  } = data;

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">الرئيسية</h1>
        <p className="text-sm text-muted-foreground">نظرة عامة على المراسلات والأرشفة</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard label="إجمالي المراسلات" value={stats.totalCorrespondences} icon={Files} />
        <DashboardStatCard label="المراسلات الرقمية" value={stats.digitalGenerated} icon={FileText} />
        <DashboardStatCard label="المراسلات الممسوحة" value={stats.scannedPhysical} icon={ScanLine} />
        <DashboardStatCard label="قيد الأرشفة" value={stats.pendingArchive} icon={Clock3} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard label="المراسلات المؤرشفة" value={stats.archived} icon={Archive} />
        <DashboardStatCard label="مراسلات اليوم" value={stats.createdToday} icon={CalendarDays} />
        <DashboardStatCard label="مراسلات هذا الشهر" value={stats.createdThisMonth} icon={FolderArchive} />
        <DashboardStatCard
          label="نسبة إنجاز الأرشفة"
          value={stats.archiveCompletionPercentage}
          icon={CheckCircle2}
          isPercentage
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MonthlyCorrespondenceChart data={monthlyData} />
        </div>
        <div>
          <CorrespondenceStatusChart data={statusDistribution} />
        </div>
        <div>
          <ArchiveProgressChart
            archiveCompletionPercentage={stats.archiveCompletionPercentage}
            pendingCount={stats.pendingArchive}
            archivedCount={stats.archived}
          />
        </div>
        <div className="xl:col-span-2">
          <RecentCorrespondenceList data={recentCorrespondences} />
        </div>
        <div>
          <RecentArchiveList data={recentArchivedCorrespondences} />
        </div>
      </div>

      <ArchiveTaskList data={archiveTasks} />
    </div>
  );
}
