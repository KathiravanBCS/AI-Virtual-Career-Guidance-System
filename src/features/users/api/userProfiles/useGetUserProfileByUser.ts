import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { UserProfile } from '../../types';

export const useGetUserProfileByUser = (userId?: number) => {
  return useQuery<UserProfile>({
    queryKey: ['userProfile', 'user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const profile = await api.userProfiles.getByUser(userId);
      return profile;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
