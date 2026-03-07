import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

/**
 * Hook to delete a permission
 * @returns Mutation function and status
 * @example
 * const { mutate: deletePermission, isPending } = useDeletePermission();
 * deletePermission(1);
 */
export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (permissionId) => {
      await api.permissions.delete(permissionId);
    },
    onSuccess: (_, permissionId) => {
      // Invalidate both the specific permission and the permissions list
      queryClient.invalidateQueries({ queryKey: ['permission', permissionId] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};
