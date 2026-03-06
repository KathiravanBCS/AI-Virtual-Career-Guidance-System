import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { LearningGuidanceListResponse } from '../types';

export const useGetLearningGuidances = () => {
  return useQuery<LearningGuidanceListResponse>({
    queryKey: ['learningGuidances'],
    queryFn: async () => {
      const guidances = await api.learningGuidance.getAll();
      return guidances;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
