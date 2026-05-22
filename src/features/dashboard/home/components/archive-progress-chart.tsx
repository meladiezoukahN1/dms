'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface ArchiveProgressChartProps {
  archiveCompletionPercentage: number;
  pendingCount: number;
  archivedCount: number;
}

const chartConfig = {
  archived: {
    label: 'المؤرشف',
    color: 'var(--chart-2)',
  },
  pending: {
    label: 'قيد الأرشفة',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

export function ArchiveProgressChart({
  archiveCompletionPercentage,
  pendingCount,
  archivedCount,
}: ArchiveProgressChartProps) {
  const total = pendingCount + archivedCount;
  const chartData = [
    { label: 'قيد الأرشفة', archived: 0, pending: pendingCount },
    { label: 'المؤرشف', archived: archivedCount, pending: 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>تقدم الأرشفة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">نسبة إنجاز الأرشفة</p>
          <p className="text-2xl font-bold text-foreground">
            {archiveCompletionPercentage.toLocaleString('ar-SA')}%
          </p>
        </div>

        {total === 0 ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">لا توجد بيانات أرشفة</div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-40 w-full">
              <AreaChart accessibilityLayer data={chartData} margin={{ top: 6, right: 8, left: 8, bottom: 6 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stroke="var(--color-pending)"
                  fill="var(--color-pending)"
                  fillOpacity={0.25}
                />
                <Area
                  type="monotone"
                  dataKey="archived"
                  stroke="var(--color-archived)"
                  fill="var(--color-archived)"
                  fillOpacity={0.35}
                />
              </AreaChart>
            </ChartContainer>

            <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
              <div className="rounded-md bg-muted/40 p-2">
                <p className="text-xs text-muted-foreground">مؤرشفة</p>
                <p className="text-lg font-semibold text-foreground">{archivedCount.toLocaleString('ar-SA')}</p>
              </div>
              <div className="rounded-md bg-muted/40 p-2">
                <p className="text-xs text-muted-foreground">قيد الأرشفة</p>
                <p className="text-lg font-semibold text-foreground">{pendingCount.toLocaleString('ar-SA')}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
