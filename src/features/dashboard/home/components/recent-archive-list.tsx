'use client';

import { Card } from '@/components/ui/card';
import type { RecentArchivedCorrespondence } from '../types';

interface RecentArchiveListProps {
  data: RecentArchivedCorrespondence[];
}

export function RecentArchiveList({ data }: RecentArchiveListProps) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">آخر المراسلات المؤرشفة</h3>
      </div>

      {data.length === 0 ? (
        <div className="flex h-44 items-center justify-center text-sm text-muted-foreground">
          لا توجد مراسلات مؤرشفة حتى الآن
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-3">
              <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.referenceNumber ? `#${item.referenceNumber}` : 'بدون رقم مرجعي'}</span>
                <span>{formatDate(item.archivedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
