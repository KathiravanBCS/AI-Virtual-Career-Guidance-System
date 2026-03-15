import { useQuery } from '@tanstack/react-query';

import type { GuidanceWithLearningModules } from '@/features/guidance/types';
import { api } from '@/lib/api';

import { LearningPath } from '../types';

export const useGetLearningPathsForQuiz = () => {
  return useQuery({
    queryKey: ['learningPathsQuiz'],
    queryFn: async (): Promise<LearningPath[]> => {
      try {
        // Fetch learning guidances with their modules from API
        const response = await api.learningGuidance.getWithModulesAll();

        // Handle both array and wrapped response formats
        const guidances = Array.isArray(response) ? response : (response as any).data || [];

        // Transform guidance data to LearningPath format
        const paths: LearningPath[] = guidances.map((guidance: GuidanceWithLearningModules) => ({
          $id: guidance.id.toString(),
          careerName: guidance.career_goal,
          modules: (guidance.learning_modules || []).map((module) => ({
            title: module.title,
            description: module.description || module.title,
          })),
        }));

        return paths;
      } catch (error) {
        console.error('Failed to fetch learning paths for quiz:', error);
        // Return empty array if API fails
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
