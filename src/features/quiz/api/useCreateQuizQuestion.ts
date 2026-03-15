import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { CreateQuizQuestionRequest, QuizQuestion } from '../types';

export const useCreateQuizQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: number; data: CreateQuizQuestionRequest }) =>
      api.quizzes.questions.create(quizId, data),
    onSuccess: (newQuestion: QuizQuestion) => {
      // Invalidate relevant query caches
      queryClient.invalidateQueries({ queryKey: ['quizQuestions', newQuestion.quiz_id] });
      queryClient.invalidateQueries({
        queryKey: ['quiz', newQuestion.quiz_id],
      });

      // Only show notification if this is a single question creation
      // (not part of batch creation during save flow)
      if (!queryClient.getQueryData(['batchCreating'])) {
        notifications.show({
          title: 'Success',
          message: 'Quiz question created successfully',
          color: 'green',
        });
      }
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error creating quiz question',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
