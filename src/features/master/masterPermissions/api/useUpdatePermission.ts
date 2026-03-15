import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { Permission, UpdatePermissionRequest } from '../types';

/**
 * Hook to update a permission
 * @returns Mutation function and status
 * @example
 * const { mutate: updatePermission, isPending } = useUpdatePermission();
 * updatePermission({ permissionId: 1, data: { action: 'read', ... } });
 */
export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<Permission, Error, { permissionId: number; data: Partial<UpdatePermissionRequest> }>({
    mutationFn: async ({ permissionId, data }) => {
      return await api.permissions.update(permissionId, data);
    },
    onSuccess: (_, { permissionId }) => {
      // Invalidate both the specific permission and the permissions list
      queryClient.invalidateQueries({ queryKey: ['permission', permissionId] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      notifications.show({
        title: 'Success',
        message: 'Permission updated successfully',
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
