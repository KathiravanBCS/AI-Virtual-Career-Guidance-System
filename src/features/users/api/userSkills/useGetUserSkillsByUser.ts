import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllUserSkillsResponse } from '../../types';

export const useGetUserSkillsByUser = (userId?: number) => {
  return useQuery<GetAllUserSkillsResponse>({
    queryKey: ['userSkills', 'user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const skills = await api.userSkills.getByUser(userId);
      return skills;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
