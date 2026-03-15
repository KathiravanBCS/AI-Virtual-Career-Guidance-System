import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { QuizQuestion, QuizQuestionsListResponse } from '../types';

export const useGetQuizQuestions = (quizId: number | null | undefined) => {
  return useQuery<QuizQuestionsListResponse>({
    queryKey: ['quizQuestions', quizId],
    queryFn: async () => {
      if (!quizId) throw new Error('Quiz ID is required');
      const response = await api.quizzes.questions.getAll(quizId);

      // Handle both array and wrapped response formats
      if (Array.isArray(response)) {
        return {
          data: response as QuizQuestion[],
          total: response.length,
          page: 1,
          per_page: response.length,
        };
      }

      return response as QuizQuestionsListResponse;
    },
    enabled: !!quizId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
