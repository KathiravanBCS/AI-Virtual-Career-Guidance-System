import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { CreateRolePermissionRequest, RolePermission } from '../types';

/**
 * Hook to create a new role permission mapping
 * @returns Mutation function and status
 * @example
 * const { mutate: createRolePermission, isPending } = useCreateRolePermission();
 * createRolePermission({ role_id: 1, permission_id: 1, is_active: true });
 */
export const useCreateRolePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<RolePermission, Error, CreateRolePermissionRequest>({
    mutationFn: async (data) => {
      return await api.rolePermissions.create(data);
    },
    onSuccess: () => {
      // Invalidate role permissions list to refetch
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
    },
  });
};
