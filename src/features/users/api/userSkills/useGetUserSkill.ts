import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { UserSkill } from '../../types';

export const useGetUserSkill = (id?: number) => {
  return useQuery<UserSkill>({
    queryKey: ['userSkill', id],
    queryFn: async () => {
      if (!id) throw new Error('Skill ID is required');
      const skill = await api.userSkills.getById(id);
      return skill;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
