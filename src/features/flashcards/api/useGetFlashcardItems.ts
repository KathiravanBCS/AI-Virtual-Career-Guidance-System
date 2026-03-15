import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { FlashcardItemsListResponse } from '../types';

export const useGetFlashcardItems = (flashcardId: number | null) => {
  return useQuery<FlashcardItemsListResponse>({
    queryKey: ['flashcardItems', flashcardId],
    queryFn: async () => {
      if (!flashcardId) throw new Error('Flashcard ID is required');
      return await api.flashcards.items.getAll(flashcardId);
    },
    enabled: !!flashcardId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
