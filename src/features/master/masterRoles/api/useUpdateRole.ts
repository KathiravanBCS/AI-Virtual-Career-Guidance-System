import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { Role, UpdateRoleRequest } from '../types';

/**
 * Hook to update a role
 * @returns Mutation function and status
 * @example
 * const { mutate: updateRole, isPending } = useUpdateRole();
 * updateRole({ roleId: 1, data: { role_name: 'Admin', ... } });
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<Role, Error, { roleId: number; data: Partial<UpdateRoleRequest> }>({
    mutationFn: async ({ roleId, data }) => {
      return await api.roles.update(roleId, data);
    },
    onSuccess: (_, { roleId }) => {
      // Invalidate both the specific role and the roles list
      queryClient.invalidateQueries({ queryKey: ['role', roleId] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};
