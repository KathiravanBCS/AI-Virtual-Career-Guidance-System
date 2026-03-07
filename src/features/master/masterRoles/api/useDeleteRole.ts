import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

/**
 * Hook to delete a role
 * @returns Mutation function and status
 * @example
 * const { mutate: deleteRole, isPending } = useDeleteRole();
 * deleteRole(1);
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (roleId) => {
      await api.roles.delete(roleId);
    },
    onSuccess: (_, roleId) => {
      // Invalidate both the specific role and the roles list
      queryClient.invalidateQueries({ queryKey: ['role', roleId] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};
