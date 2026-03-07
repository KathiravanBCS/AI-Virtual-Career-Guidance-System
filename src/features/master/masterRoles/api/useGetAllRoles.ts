import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllRolesResponse } from '../types';

/**
 * Hook to fetch all roles
 * @returns Query result with array of roles
 * @example
 * const { data: roles, isLoading } = useGetAllRoles();
 */
export const useGetAllRoles = () => {
  return useQuery<GetAllRolesResponse>({
    queryKey: ['roles'],
    queryFn: async () => {
      return await api.roles.getAll();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
