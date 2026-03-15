import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { CreateFlashcardItemRequest, FlashcardItem } from '../types';

interface CreateFlashcardItemParams {
  flashcardId: number;
  data: CreateFlashcardItemRequest;
}

export const useCreateFlashcardItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flashcardId, data }: CreateFlashcardItemParams) => api.flashcards.items.create(flashcardId, data),
    onSuccess: (newItem: FlashcardItem) => {
      queryClient.invalidateQueries({ queryKey: ['flashcardItems', newItem.flashcard_id] });
      queryClient.invalidateQueries({ queryKey: ['flashcard', newItem.flashcard_id] });
      notifications.show({
        title: 'Success',
        message: 'Flashcard item created successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error creating flashcard item',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
