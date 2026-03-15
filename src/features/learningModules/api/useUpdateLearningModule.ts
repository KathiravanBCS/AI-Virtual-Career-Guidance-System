import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { LearningModule, UpdateLearningModuleRequest } from '../types';

export const useUpdateLearningModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: number; data: Partial<UpdateLearningModuleRequest> }) =>
      api.learningModules.update(moduleId, data),
    onSuccess: (_, { moduleId }) => {
      queryClient.invalidateQueries({ queryKey: ['learningModules'] });
      queryClient.invalidateQueries({ queryKey: ['learningModule', moduleId] });
      notifications.show({
        title: 'Success',
        message: 'Learning module updated successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error updating learning module',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
