import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { FlashcardItem } from '../types';

interface UseGetFlashcardItemByIdParams {
  flashcardId: number | null;
  itemId: number | null;
}

export const useGetFlashcardItemById = ({ flashcardId, itemId }: UseGetFlashcardItemByIdParams) => {
  return useQuery<FlashcardItem>({
    queryKey: ['flashcardItem', flashcardId, itemId],
    queryFn: async () => {
      if (!flashcardId || !itemId) throw new Error('Flashcard ID and Item ID are required');
      return await api.flashcards.items.getById(flashcardId, itemId);
    },
    enabled: !!flashcardId && !!itemId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
