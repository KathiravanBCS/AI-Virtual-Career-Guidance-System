import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllSkillGapsResponse } from '../../types';

export const useGetSkillGapsByUser = (userId?: number) => {
  return useQuery<GetAllSkillGapsResponse>({
    queryKey: ['skillGaps', 'user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const gaps = await api.skillGaps.getByUser(userId);
      return gaps;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
