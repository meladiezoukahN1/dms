import type { DashboardOverview, ApiResponse } from '../types';
import { appFetch } from '@/lib/api-client';

/**
 * Frontend API client for Dashboard Overview
 */

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const response = await appFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/overview`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    }
  );

  if (!response.ok) {
    throw new Error(`Dashboard API error: ${response.statusText}`);
  }

  const json: ApiResponse<DashboardOverview> = await response.json();

  if (!json.success) {
    throw new Error('Failed to fetch dashboard data');
  }

  return json.data;
}
