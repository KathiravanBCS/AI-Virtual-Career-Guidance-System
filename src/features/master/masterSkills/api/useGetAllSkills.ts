import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllSkillsResponse } from '../types';

/**
 * Hook to fetch all skills
 * @returns Query result with array of skills
 * @example
 * const { data: skills, isLoading } = useGetAllSkills();
 */
export const useGetAllSkills = () => {
  return useQuery<GetAllSkillsResponse>({
    queryKey: ['skills'],
    queryFn: async () => {
      return await api.skills.getAll();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
