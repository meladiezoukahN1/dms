import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/server/core/middleware/with-error-handler';
import { SessionService } from '@/server/modules/auth/session/service';
import { DashboardOverviewService } from '@/server/modules/dashboard/overview/service';

async function handler(req: NextRequest): Promise<NextResponse> {
  await SessionService.getCurrentSessionUser(req);

  const dashboardData = await DashboardOverviewService.getDashboardOverview();

  return NextResponse.json({
    success: true,
    data: dashboardData,
  });
}

export const GET = withErrorHandler(handler);
