import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetLearningModuleByIdResponse } from '../types';

export const useGetLearningModuleById = (moduleId: number | null) => {
  return useQuery<GetLearningModuleByIdResponse>({
    queryKey: ['learningModule', moduleId],
    queryFn: async () => {
      if (!moduleId) throw new Error('Module ID is required');
      const module = await api.learningModules.getById(moduleId);
      return module;
    },
    enabled: !!moduleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
