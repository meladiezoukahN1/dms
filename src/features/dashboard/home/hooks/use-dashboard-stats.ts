'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDashboardOverview } from '../api/dashboard.api';

/**
 * Hook to fetch dashboard overview data with React Query
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: fetchDashboardOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10, // Auto-refetch every 10 minutes
    refetchOnWindowFocus: true,
    retry: 3,
  });
}
