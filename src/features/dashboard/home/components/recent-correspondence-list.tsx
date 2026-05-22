'use client';

import { Card } from '@/components/ui/card';
import type { RecentCorrespondence } from '../types';

interface RecentCorrespondenceListProps {
  data: RecentCorrespondence[];
}

/**
 * Recent correspondence list component
 * Shows the 5 most recently created correspondences
 */
export function RecentCorrespondenceList({
  data,
}: RecentCorrespondenceListProps) {
  const getSourceTypeLabel = (sourceType: string) => {
    switch (sourceType) {
      case 'DIGITAL_GENERATED':
        return 'رقمية';
      case 'SCANNED_PHYSICAL':
        return 'ممسوحة';
      case 'IMPORTED_FILE':
        return 'مستوردة';
      default:
        return sourceType;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-muted text-muted-foreground';
      case 'GENERATED':
        return 'bg-secondary text-secondary-foreground';
      case 'RECEIVED':
        return 'bg-accent text-accent-foreground';
      case 'ARCHIVE_PENDING':
        return 'bg-secondary text-secondary-foreground';
      case 'ARCHIVED':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      DRAFT: 'مسودة',
      GENERATED: 'تم إنشاؤها',
      RECEIVED: 'مستلمة',
      ARCHIVE_PENDING: 'قيد الأرشفة',
      ARCHIVED: 'مؤرشفة',
    };
    return labels[status] || status;
  };

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
    <Card className="p-6 flex flex-col gap-4">
      <h3 className="text-lg font-semibold">أحدث المراسلات</h3>

      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          لا توجد مراسلات
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
                <div className={`px-2 py-1 rounded text-xs whitespace-nowrap ${getStatusColor(item.status)}`}>
                  {getStatusLabel(item.status)}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <span className="inline-block px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                    {getSourceTypeLabel(item.sourceType)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
