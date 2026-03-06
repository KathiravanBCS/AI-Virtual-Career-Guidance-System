import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { UpdateLearningGuidanceRequest } from '../types';

interface UpdateLearningGuidancePayload extends UpdateLearningGuidanceRequest {
  id?: number;
}

export const useUpdateLearningGuidance = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateLearningGuidancePayload) => {
      const guidanceId = data.id || id;
      if (!guidanceId) throw new Error('Guidance ID is required');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _guidanceId, ...payload } = data;
      return api.learningGuidance.update(guidanceId, payload);
    },
    onSuccess: (_, variables) => {
      const guidanceId = variables.id ?? id;
      queryClient.invalidateQueries({ queryKey: ['learningGuidances'] });
      if (guidanceId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['learningGuidance', guidanceId] });
      }
      notifications.show({
        title: 'Success',
        message: 'Learning guidance updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update learning guidance',
        color: 'red',
      });
    },
  });
};
