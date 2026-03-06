import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllWorkExperienceResponse } from '../../types';

export const useGetWorkExperiences = () => {
  return useQuery<GetAllWorkExperienceResponse>({
    queryKey: ['workExperiences'],
    queryFn: async () => {
      const experiences = await api.workExperience.getAll();
      return experiences;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
