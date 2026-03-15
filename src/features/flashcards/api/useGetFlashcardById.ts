import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { Flashcard } from '../types';

export const useGetFlashcardById = (flashcardId: number | null) => {
  return useQuery<Flashcard>({
    queryKey: ['flashcard', flashcardId],
    queryFn: async () => {
      if (!flashcardId) throw new Error('Flashcard ID is required');
      return await api.flashcards.getById(flashcardId);
    },
    enabled: !!flashcardId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
