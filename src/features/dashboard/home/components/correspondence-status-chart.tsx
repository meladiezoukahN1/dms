'use client';

import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { StatusDistribution } from '../types';

interface CorrespondenceStatusChartProps {
  data: StatusDistribution;
}

const chartConfig = {
  DRAFT: { label: 'مسودة', color: 'var(--chart-5)' },
  GENERATED: { label: 'تم إنشاؤها', color: 'var(--chart-1)' },
  RECEIVED: { label: 'مستلمة', color: 'var(--chart-2)' },
  ARCHIVE_PENDING: { label: 'قيد الأرشفة', color: 'var(--chart-3)' },
  ARCHIVED: { label: 'مؤرشفة', color: 'var(--chart-4)' },
} satisfies ChartConfig;

export function CorrespondenceStatusChart({
  data,
}: CorrespondenceStatusChartProps) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const chartData = [
    { status: 'DRAFT', value: data.DRAFT, fill: 'var(--color-DRAFT)' },
    { status: 'GENERATED', value: data.GENERATED, fill: 'var(--color-GENERATED)' },
    { status: 'RECEIVED', value: data.RECEIVED, fill: 'var(--color-RECEIVED)' },
    { status: 'ARCHIVE_PENDING', value: data.ARCHIVE_PENDING, fill: 'var(--color-ARCHIVE_PENDING)' },
    { status: 'ARCHIVED', value: data.ARCHIVED, fill: 'var(--color-ARCHIVED)' },
  ];

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>توزيع حالات المراسلات</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex h-64 items-center justify-center text-muted-foreground">لا توجد بيانات</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>توزيع حالات المراسلات</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <PieChart accessibilityLayer>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="status"
                  formatter={(value) =>
                    typeof value === 'number'
                      ? value.toLocaleString('ar-SA')
                      : String(value ?? '')
                  }
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={56}
              outerRadius={86}
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
