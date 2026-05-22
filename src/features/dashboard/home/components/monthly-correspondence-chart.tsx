'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { MonthlyCorrespondenceData } from '../types';

interface MonthlyCorrespondenceChartProps {
  data: MonthlyCorrespondenceData[];
}

const chartConfig = {
  digitalGenerated: {
    label: 'مراسلات رقمية',
    color: 'var(--chart-1)',
  },
  scannedPhysical: {
    label: 'مراسلات ممسوحة',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function MonthlyCorrespondenceChart({
  data,
}: MonthlyCorrespondenceChartProps) {
  const chartData = data.map((item) => ({
    monthLabel: `${item.month}`,
    digitalGenerated: item.digitalGenerated,
    scannedPhysical: item.scannedPhysical,
  }));

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>المراسلات الشهرية</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            لا توجد بيانات
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>المراسلات الشهرية</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="digitalGenerated" fill="var(--color-digitalGenerated)" radius={4} />
            <Bar dataKey="scannedPhysical" fill="var(--color-scannedPhysical)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
