import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { FlashcardsListResponse } from '../types';

export const useGetFlashcardsByModule = (moduleId: number | null) => {
  return useQuery<FlashcardsListResponse>({
    queryKey: ['flashcards', 'module', moduleId],
    queryFn: async () => {
      if (!moduleId) throw new Error('Module ID is required');
      return await api.flashcards.getByModule(moduleId);
    },
    enabled: !!moduleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
