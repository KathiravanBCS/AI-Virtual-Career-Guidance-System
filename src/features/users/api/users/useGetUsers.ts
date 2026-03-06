import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllUsersResponse } from '../../types';

export const useGetUsers = () => {
  return useQuery<GetAllUsersResponse>({
    queryKey: ['users'],
    queryFn: async () => {
      const users = await api.users.getAll();
      return users;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
