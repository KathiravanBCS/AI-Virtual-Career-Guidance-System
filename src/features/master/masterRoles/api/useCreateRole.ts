import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

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
    },
  });
};
