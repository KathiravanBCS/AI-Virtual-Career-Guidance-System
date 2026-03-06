import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllSkillGapsResponse } from '../../types';

export const useGetSkillGapsByUserAndCareer = (userId?: number, careerId?: number) => {
  return useQuery<GetAllSkillGapsResponse>({
    queryKey: ['skillGaps', 'user', userId, 'career', careerId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      if (!careerId) throw new Error('Career ID is required');
      const gaps = await api.skillGaps.getByUserAndCareer(userId, careerId);
      return gaps;
    },
    enabled: !!userId && !!careerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
