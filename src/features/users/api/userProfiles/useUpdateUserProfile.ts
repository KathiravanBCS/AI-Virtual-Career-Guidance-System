import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { UpdateUserProfileRequest } from '../../types';

interface UpdateUserProfilePayload extends UpdateUserProfileRequest {
  id?: number;
}

export const useUpdateUserProfile = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserProfilePayload) => {
      const profileId = data.id || id;
      if (!profileId) throw new Error('Profile ID is required');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _profileId, ...payload } = data;
      return api.userProfiles.update(profileId, payload);
    },
    onSuccess: (_, variables) => {
      const profileId = variables.id ?? id;
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      if (profileId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['userProfile', profileId] });
      }
      notifications.show({
        title: 'Success',
        message: 'User profile updated successfully',
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
