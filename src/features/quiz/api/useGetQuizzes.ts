import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { Quiz, QuizzesListResponse } from '../types';

export const useGetQuizzes = () => {
  return useQuery<QuizzesListResponse>({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const response = await api.quizzes.getAll();

      // Handle both array and wrapped response formats
      if (Array.isArray(response)) {
        return {
          data: response as Quiz[],
          total: response.length,
          page: 1,
          per_page: response.length,
        };
      }

      // If already wrapped, return as is
      return response as QuizzesListResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
