import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllPermissionsResponse } from '../types';

/**
 * Hook to fetch all permissions
 * @returns Query result with array of permissions
 * @example
 * const { data: permissions, isLoading } = useGetAllPermissions();
 */
export const useGetAllPermissions = () => {
  return useQuery<GetAllPermissionsResponse>({
    queryKey: ['permissions'],
    queryFn: async () => {
      return await api.permissions.getAll();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
