import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { CreateLearningModuleRequest, LearningModule } from '../types';

export const useCreateLearningModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLearningModuleRequest) => api.learningModules.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningModules'] });
      notifications.show({
        title: 'Success',
        message: 'Learning module created successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error creating learning module',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
