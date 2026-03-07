import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { Role } from '../types';

/**
 * Hook to fetch a role by ID
 * @param roleId - The role ID to fetch
 * @returns Query result with role details
 * @example
 * const { data: role, isLoading } = useGetRoleById(1);
 */
export const useGetRoleById = (roleId: number | null) => {
  return useQuery<Role>({
    queryKey: ['role', roleId],
    queryFn: async () => {
      if (!roleId) throw new Error('Role ID is required');
      const response = await api.roles.getById(roleId);
      // Handle both direct object response and wrapped response
      return (response as any)?.data || (response as unknown as Role);
    },
    enabled: roleId !== null, // Only run query if roleId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
