import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { Permission } from '../types';

/**
 * Hook to fetch a permission by ID
 * @param permissionId - The permission ID to fetch
 * @returns Query result with permission details
 * @example
 * const { data: permission, isLoading } = useGetPermissionById(1);
 */
export const useGetPermissionById = (permissionId: number | null) => {
  return useQuery<Permission>({
    queryKey: ['permission', permissionId],
    queryFn: async () => {
      if (!permissionId) throw new Error('Permission ID is required');
      const response = await api.permissions.getById(permissionId);
      // Handle both direct object response and wrapped response
      return (response as any)?.data || (response as unknown as Permission);
    },
    enabled: permissionId !== null, // Only run query if permissionId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
