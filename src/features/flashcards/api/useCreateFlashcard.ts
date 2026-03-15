import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { CreateFlashcardRequest, Flashcard } from '../types';

export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFlashcardRequest) => api.flashcards.create(data),
    onSuccess: (newFlashcard: Flashcard) => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      queryClient.invalidateQueries({ queryKey: ['flashcards', 'module'] });
      notifications.show({
        title: 'Success',
        message: 'Flashcard created successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error creating flashcard',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
