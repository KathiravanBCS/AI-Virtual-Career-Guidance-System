import { useQuery } from '@tanstack/react-query';

import type { GuidanceWithLearningModule, GuidanceWithLearningModules } from '@/features/guidance/types';
import { api } from '@/lib/api';

/**
 * Hook to fetch all learning guidances with their associated modules
 * Used for flashcard generation and learning path selection
 *
 * @returns Query result with array of learning guidances and their modules
 * @example
 * const { data: guidances, isLoading } = useGetGuidancesWithModules();
 */
export const useGetGuidancesWithModules = () => {
  return useQuery<GuidanceWithLearningModules[]>({
    queryKey: ['guidancesWithModules'],
    queryFn: async () => {
      const response = await api.learningGuidance.getWithModulesAll();

      // Handle different response formats from the API
      if (Array.isArray(response)) {
        return response;
      }

      // If response is wrapped with data property (GuidanceWithLearningModule format)
      if (response && typeof response === 'object' && 'data' in response) {
        const wrappedResponse = response as unknown as GuidanceWithLearningModule;
        return Array.isArray(wrappedResponse.data) ? wrappedResponse.data : [wrappedResponse.data];
      }

      // If response is a single object with learning_modules
      if (response && typeof response === 'object' && 'learning_modules' in response) {
        return [response as GuidanceWithLearningModules];
      }

      return Array.isArray(response) ? response : [response];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
