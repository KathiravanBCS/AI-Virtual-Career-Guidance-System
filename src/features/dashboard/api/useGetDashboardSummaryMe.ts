import { useQuery } from '@tanstack/react-query';

import type { DashboardSummaryResponse } from '@/features/dashboard/types';
import { api } from '@/lib/api';

export function useGetDashboardSummaryMe() {
  return useQuery<DashboardSummaryResponse>({
    queryKey: ['dashboard', 'summary', 'me'],
    queryFn: () => api.dashboard.getSummaryMe(),
    staleTime: 60 * 1000,
  });
}
