import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { RolePermission, UpdateRolePermissionRequest } from '../types';

/**
 * Hook to update a role permission
 * @returns Mutation function and status
 * @example
 * const { mutate: updateRolePermission, isPending } = useUpdateRolePermission();
 * updateRolePermission({ rolePermissionId: 1, data: { is_active: false } });
 */
export const useUpdateRolePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<RolePermission, Error, { rolePermissionId: number; data: Partial<UpdateRolePermissionRequest> }>({
    mutationFn: async ({ rolePermissionId, data }) => {
      return await api.rolePermissions.update(rolePermissionId, data);
    },
    onSuccess: (_, { rolePermissionId }) => {
      // Invalidate both the specific role permission and the role permissions list
      queryClient.invalidateQueries({ queryKey: ['rolePermission', rolePermissionId] });
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      notifications.show({
        title: 'Success',
        message: 'Role permission updated successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
