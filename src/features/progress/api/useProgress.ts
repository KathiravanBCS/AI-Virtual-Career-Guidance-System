import { useQuery } from '@tanstack/react-query';

import { ProgressData } from '../types';

export const useGetProgressData = () => {
  return useQuery({
    queryKey: ['progressData'],
    queryFn: async (): Promise<ProgressData> => {
      // Mock data - replace with actual API calls when backend is ready
      return {
        paths: [
          { topicName: 'Full Stack Development', progress: 65 },
          { topicName: 'Data Science', progress: 25 },
          { topicName: 'Cloud Computing', progress: 40 },
        ],
        quizScores: [
          { topic: 'JavaScript Basics', accuracy: '85.00' },
          { topic: 'React Fundamentals', accuracy: '78.00' },
          { topic: 'Python Basics', accuracy: '92.00' },
          { topic: 'SQL Fundamentals', accuracy: '88.00' },
          { topic: 'Node.js Backend', accuracy: '80.00' },
        ],
        flashcardCount: 150,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
