import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllUserProfilesResponse } from '../../types';

export const useGetUserProfiles = () => {
  return useQuery<GetAllUserProfilesResponse>({
    queryKey: ['userProfiles'],
    queryFn: async () => {
      const profiles = await api.userProfiles.getAll();
      return profiles;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
