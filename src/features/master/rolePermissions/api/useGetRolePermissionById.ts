import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { RolePermission } from '../types';

/**
 * Hook to fetch a role permission by ID
 * @param rolePermissionId - The role permission ID to fetch
 * @returns Query result with role permission details
 * @example
 * const { data: rolePermission, isLoading } = useGetRolePermissionById(1);
 */
export const useGetRolePermissionById = (rolePermissionId: number | null) => {
  return useQuery<RolePermission>({
    queryKey: ['rolePermission', rolePermissionId],
    queryFn: async () => {
      if (!rolePermissionId) throw new Error('Role Permission ID is required');
      return await api.rolePermissions.getById(rolePermissionId);
    },
    enabled: rolePermissionId !== null, // Only run query if rolePermissionId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
