import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { GetAllRolePermissionsResponse } from '../types';

/**
 * Hook to fetch all role permissions
 * @returns Query result with array of role permissions
 * @example
 * const { data: rolePermissions, isLoading } = useGetAllRolePermissions();
 */
export const useGetAllRolePermissions = () => {
  return useQuery<GetAllRolePermissionsResponse>({
    queryKey: ['rolePermissions'],
    queryFn: async () => {
      return await api.rolePermissions.getAll();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
