import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllLearningModulesResponse } from '../types';

export const useGetLearningModules = () => {
  return useQuery<GetAllLearningModulesResponse>({
    queryKey: ['learningModules'],
    queryFn: async () => {
      const modules = await api.learningModules.getAll();
      return modules;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
