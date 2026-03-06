import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

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
    onError: (error: any) => {
      notifications.show({
        title: 'Error creating learning module',
        message: error?.message || 'Failed to create learning module',
        color: 'red',
      });
    },
  });
};
