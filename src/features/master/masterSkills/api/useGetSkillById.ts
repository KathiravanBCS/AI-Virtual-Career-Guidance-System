import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { SkillDetail } from '../types';

/**
 * Hook to fetch a skill by ID
 * @param skillId - The skill ID to fetch
 * @returns Query result with skill details
 * @example
 * const { data: skill, isLoading } = useGetSkillById('1');
 */
export const useGetSkillById = (skillId: string) => {
  return useQuery<SkillDetail>({
    queryKey: ['skill', skillId],
    queryFn: async () => {
      return await api.skills.getById(skillId);
    },
    enabled: !!skillId, // Only run query if skillId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
