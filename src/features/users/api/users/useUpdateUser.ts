import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import { UpdateUserRequest } from '../../types';

interface UpdateUserPayload extends UpdateUserRequest {
  id?: number;
}

export const useUpdateUser = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserPayload) => {
      const userId = data.id || id;
      if (!userId) throw new Error('User ID is required');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _userId, ...payload } = data;
      return api.users.update(userId, payload);
    },
    onSuccess: (_, variables) => {
      const userId = variables.id ?? id;
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (userId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
      }
      notifications.show({
        title: 'Success',
        message: 'User updated successfully',
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
