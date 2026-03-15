import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { CreateRoleRequest, Role } from '../types';

/**
 * Hook to create a new role
 * @returns Mutation function and status
 * @example
 * const { mutate: createRole, isPending } = useCreateRole();
 * createRole({ role_name: 'Admin', description: '...', is_active: true });
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<Role, Error, CreateRoleRequest>({
    mutationFn: async (data) => {
      return await api.roles.create(data);
    },
    onSuccess: () => {
      // Invalidate roles list to refetch
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      notifications.show({
        title: 'Success',
        message: 'Role created successfully',
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
