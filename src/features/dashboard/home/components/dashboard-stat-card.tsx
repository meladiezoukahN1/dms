'use client';

import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DashboardStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  sublabel?: string;
  isPercentage?: boolean;
}

/**
 * Reusable stat card component for dashboard
 */
export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  sublabel,
  isPercentage,
}: DashboardStatCardProps) {
  const displayValue = isPercentage ? `${value}%` : value.toLocaleString('ar-SA');

  return (
    <Card className="p-5 transition-colors hover:bg-accent/40">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold leading-tight text-foreground">{displayValue}</p>
          {sublabel && (
            <p className="text-xs text-muted-foreground">{sublabel}</p>
          )}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
