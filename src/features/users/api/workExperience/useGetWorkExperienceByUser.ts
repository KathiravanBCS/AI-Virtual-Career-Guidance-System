import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllWorkExperienceResponse } from '../../types';

export const useGetWorkExperienceByUser = (userId?: number) => {
  return useQuery<GetAllWorkExperienceResponse>({
    queryKey: ['workExperience', 'user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const experiences = await api.workExperience.getByUser(userId);
      return experiences;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
