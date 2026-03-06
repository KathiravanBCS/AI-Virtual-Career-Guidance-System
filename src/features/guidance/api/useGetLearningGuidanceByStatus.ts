import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { LearningGuidanceListResponse } from '../types';

export const useGetLearningGuidanceByStatus = (status?: string) => {
  return useQuery<LearningGuidanceListResponse>({
    queryKey: ['learningGuidances', 'status', status],
    queryFn: async () => {
      if (!status) throw new Error('Status filter is required');
      const guidances = await api.learningGuidance.getByStatus(status);
      return guidances;
    },
    enabled: !!status,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
