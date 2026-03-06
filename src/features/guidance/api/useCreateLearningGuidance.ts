import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { CreateLearningGuidanceRequest, LearningGuidanceResponse } from '../types';

export const useCreateLearningGuidance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLearningGuidanceRequest) => api.learningGuidance.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningGuidances'] });
      notifications.show({
        title: 'Success',
        message: 'Learning guidance created successfully',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error creating learning guidance',
        message: error?.message || 'Failed to create learning guidance',
        color: 'red',
      });
    },
  });
};
