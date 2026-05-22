'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { ArchiveTask } from '../types';

interface ArchiveTaskListProps {
  data: ArchiveTask[];
}

/**
 * Archive task list component
 * Shows correspondences awaiting archiving
 */
export function ArchiveTaskList({ data }: ArchiveTaskListProps) {
  const formatDate = (isoString: string | null) => {
    if (!isoString) return 'لم يتم التعيين';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">قائمة انتظار الأرشفة</h3>
        {data.length > 0 && (
          <Link href="/archive/final-archive">
            <Button variant="outline" size="sm">
              عرض الكل
            </Button>
          </Link>
        )}
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          لا توجد مراسلات قيد الأرشفة
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  {item.referenceNumber && (
                    <p className="text-xs text-muted-foreground mt-1">
                      #{item.referenceNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex gap-2">
                  <span className="inline-block px-2 py-1 bg-muted rounded text-muted-foreground">
                    {item.fileCount} ملف{item.fileCount !== 1 ? 'ات' : ''}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {formatDate(item.archiveHandoverAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
