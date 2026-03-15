import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { Flashcard, FlashcardsListResponse } from '../types';

export const useGetFlashcards = () => {
  return useQuery<FlashcardsListResponse>({
    queryKey: ['flashcards'],
    queryFn: async () => {
      const response = await api.flashcards.getAll();

      // Handle both array and wrapped response formats
      if (Array.isArray(response)) {
        return {
          data: response as Flashcard[],
          total: response.length,
          page: 1,
          per_page: response.length,
        };
      }

      // If already wrapped, return as is
      return response as FlashcardsListResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
