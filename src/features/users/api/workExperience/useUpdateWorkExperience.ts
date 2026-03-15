import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { UpdateWorkExperienceRequest } from '../../types';

interface UpdateWorkExperiencePayload extends UpdateWorkExperienceRequest {
  id?: number;
}

export const useUpdateWorkExperience = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateWorkExperiencePayload) => {
      const experienceId = data.id || id;
      if (!experienceId) throw new Error('Experience ID is required');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _experienceId, ...payload } = data;
      return api.workExperience.update(experienceId, payload);
    },
    onSuccess: (_, variables) => {
      const experienceId = variables.id ?? id;
      queryClient.invalidateQueries({ queryKey: ['workExperiences'] });
      if (experienceId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['workExperience', experienceId] });
      }
      notifications.show({
        title: 'Success',
        message: 'Work experience updated successfully',
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
