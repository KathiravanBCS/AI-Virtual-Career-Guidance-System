import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { CreateQuizRequest, Quiz } from '../types';

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizRequest) => api.quizzes.create(data),
    onSuccess: (newQuiz: Quiz) => {
      // Invalidate query caches to refresh data
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quizzes', 'module'] });
      queryClient.invalidateQueries({ queryKey: ['quiz', newQuiz.id] });

      notifications.show({
        title: 'Success',
        message: 'Quiz created successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error creating quiz',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
