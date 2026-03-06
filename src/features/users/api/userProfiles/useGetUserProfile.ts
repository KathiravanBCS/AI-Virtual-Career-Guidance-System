import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { UserProfile } from '../../types';

export const useGetUserProfile = (id?: number) => {
  return useQuery<UserProfile>({
    queryKey: ['userProfile', id],
    queryFn: async () => {
      if (!id) throw new Error('Profile ID is required');
      const profile = await api.userProfiles.getById(id);
      return profile;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
