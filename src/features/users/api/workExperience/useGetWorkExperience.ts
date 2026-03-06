import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { WorkExperience } from '../../types';

export const useGetWorkExperience = (id?: number) => {
  return useQuery<WorkExperience>({
    queryKey: ['workExperience', id],
    queryFn: async () => {
      if (!id) throw new Error('Experience ID is required');
      const experience = await api.workExperience.getById(id);
      return experience;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
