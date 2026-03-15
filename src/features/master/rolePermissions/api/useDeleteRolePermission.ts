import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

/**
 * Hook to delete a role permission
 * @returns Mutation function and status
 * @example
 * const { mutate: deleteRolePermission, isPending } = useDeleteRolePermission();
 * deleteRolePermission(1);
 */
export const useDeleteRolePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (rolePermissionId) => {
      await api.rolePermissions.delete(rolePermissionId);
    },
    onSuccess: (_, rolePermissionId) => {
      // Invalidate both the specific role permission and the role permissions list
      queryClient.invalidateQueries({ queryKey: ['rolePermission', rolePermissionId] });
      queryClient.invalidateQueries({ queryKey: ['rolePermissions'] });
      notifications.show({
        title: 'Success',
        message: 'Role permission deleted successfully',
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
