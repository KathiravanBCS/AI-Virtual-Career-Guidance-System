import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { LearningGuidanceResponse } from '../types';

export const useGetLearningGuidance = (id?: number) => {
  return useQuery<LearningGuidanceResponse>({
    queryKey: ['learningGuidance', id],
    queryFn: async () => {
      if (!id) throw new Error('Guidance ID is required');
      const response = await api.learningGuidance.getById(id);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
