import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllSkillGapsResponse } from '../../types';

export const useGetSkillGaps = () => {
  return useQuery<GetAllSkillGapsResponse>({
    queryKey: ['skillGaps'],
    queryFn: async () => {
      const gaps = await api.skillGaps.getAll();
      return gaps;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
