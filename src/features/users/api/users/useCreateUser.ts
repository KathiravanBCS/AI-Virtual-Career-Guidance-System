import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import { type CreateUserRequest } from '../../types';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => api.users.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // Don't show success notification on login - it's expected behavior
    },
    onError: (error: any) => {
      // Handle duplicate user (409 Conflict) silently - user already exists
      if (error?.status === 409 || error?.message?.includes('already exists')) {
        console.log('[AUTH] User already exists in database, proceeding with login');
        return;
      }

      notifications.show({
        title: 'Error creating user profile',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
