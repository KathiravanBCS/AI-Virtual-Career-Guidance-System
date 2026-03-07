import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { CreatePermissionRequest, Permission } from '../types';

/**
 * Hook to create a new permission
 * @returns Mutation function and status
 * @example
 * const { mutate: createPermission, isPending } = useCreatePermission();
 * createPermission({ action: 'read', description: '...', is_active: true });
 */
export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<Permission, Error, CreatePermissionRequest>({
    mutationFn: async (data) => {
      return await api.permissions.create(data);
    },
    onSuccess: () => {
      // Invalidate permissions list to refetch
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};
