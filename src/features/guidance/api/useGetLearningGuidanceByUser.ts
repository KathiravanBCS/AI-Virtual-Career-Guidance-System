import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { LearningGuidanceListResponse } from '../types';

export const useGetLearningGuidanceByUser = (userId?: number) => {
  return useQuery<LearningGuidanceListResponse>({
    queryKey: ['learningGuidances', 'user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const guidances = await api.learningGuidance.getByUser(userId);
      return guidances;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
