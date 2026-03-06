import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { SkillGap } from '../../types';

export const useGetSkillGap = (id?: number) => {
  return useQuery<SkillGap>({
    queryKey: ['skillGap', id],
    queryFn: async () => {
      if (!id) throw new Error('Gap ID is required');
      const gap = await api.skillGaps.getById(id);
      return gap;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
