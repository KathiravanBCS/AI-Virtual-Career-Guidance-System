import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllUserSkillsResponse } from '../../types';

export const useGetUserSkills = () => {
  return useQuery<GetAllUserSkillsResponse>({
    queryKey: ['userSkills'],
    queryFn: async () => {
      const skills = await api.userSkills.getAll();
      return skills;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
