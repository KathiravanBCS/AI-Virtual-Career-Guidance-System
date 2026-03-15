import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { Quiz } from '../types';

export const useGetQuizById = (quizId: number | null | undefined) => {
  return useQuery<Quiz>({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      if (!quizId) throw new Error('Quiz ID is required');
      return await api.quizzes.getById(quizId);
    },
    enabled: !!quizId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
