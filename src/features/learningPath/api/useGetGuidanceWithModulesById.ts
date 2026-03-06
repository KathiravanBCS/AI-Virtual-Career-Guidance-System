import { useQuery } from '@tanstack/react-query';

import type { GuidanceWithLearningModule, GuidanceWithLearningModules } from '@/features/guidance/types';
import { api } from '@/lib/api';

export const useGetGuidanceWithModulesById = (guidanceId: number | null) => {
  return useQuery<GuidanceWithLearningModules>({
    queryKey: ['guidanceWithModules', guidanceId],
    queryFn: async () => {
      if (!guidanceId) throw new Error('Guidance ID is required');
      const response = await api.learningGuidance.getWithModulesById(guidanceId);

      // Handle both wrapped and unwrapped responses
      if (response && 'data' in response && Array.isArray((response as unknown as GuidanceWithLearningModule).data)) {
        return (response as unknown as GuidanceWithLearningModule).data[0];
      }

      return response as unknown as GuidanceWithLearningModules;
    },
    enabled: !!guidanceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
