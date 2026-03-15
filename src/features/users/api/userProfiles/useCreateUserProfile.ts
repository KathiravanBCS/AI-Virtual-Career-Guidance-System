import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { CreateUserProfileRequest } from '../../types';

export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserProfileRequest) => api.userProfiles.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', 'user', variables.user_id] });
      notifications.show({
        title: 'Success',
        message: 'User profile created successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error creating user profile',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
