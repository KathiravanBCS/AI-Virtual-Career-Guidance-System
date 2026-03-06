import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { User } from '../../types';

export const useGetUser = (id?: number) => {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) throw new Error('User ID is required');
      const user = await api.users.getById(id);
      return user;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
