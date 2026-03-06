import { useQuery } from '@tanstack/react-query';

import { LearningPath } from '../types';

export const useGetLearningPathsForQuiz = () => {
  return useQuery({
    queryKey: ['learningPathsQuiz'],
    queryFn: async (): Promise<LearningPath[]> => {
      // Mock data - replace with actual API calls when backend is ready
      return [
        {
          $id: '1',
          careerName: 'Full Stack Development',
          modules: [
            {
              title: 'JavaScript Basics',
              description: 'Learn the fundamentals of JavaScript',
            },
            {
              title: 'React Fundamentals',
              description: 'Master React concepts and hooks',
            },
            {
              title: 'Node.js Backend',
              description: 'Build backend services with Node.js',
            },
          ],
        },
        {
          $id: '2',
          careerName: 'Data Science',
          modules: [
            {
              title: 'Python Basics',
              description: 'Learn Python programming',
            },
            {
              title: 'SQL Fundamentals',
              description: 'Master SQL queries and database design',
            },
            {
              title: 'Machine Learning Intro',
              description: 'Introduction to machine learning concepts',
            },
          ],
        },
      ];
    },
    staleTime: 10 * 60 * 1000,
  });
};
