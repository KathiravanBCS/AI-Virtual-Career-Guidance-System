/**
 * React Query Hook for AI-powered Career Guidance using Groq
 * Generates personalized career analysis based on user interests
 */

import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

import { getErrorMessage } from '@/lib/utils/errorHandler';
import { 
  generatePersonalizedCareerGuidance, 
  generateCareerSkillsAnalysis,
  generateCompanyRecommendations,
  generateCareerRecommendations,
  generateJobMarketTrendAnalysis 
} from '@/config/groq.config';

import {
  UserInterests,
  AICareerGuidance,
  AIGeneratedSkill,
  AIGeneratedCompany,
  AIRecommendation,
  AIJobMarketTrend,
} from '../types';

// ============= MUTATION HOOKS =============

export function useGenerateAICareerGuidance() {
  return useMutation({
    mutationFn: async (userInterests: UserInterests): Promise<AICareerGuidance> => {
      try {
        // Generate all components in parallel
        const [guidance, skills, companies, recommendations, trends] = await Promise.all([
          generatePersonalizedCareerGuidance(userInterests),
          generateCareerSkillsAnalysis(userInterests),
          generateCompanyRecommendations(userInterests),
          generateCareerRecommendations(userInterests),
          generateJobMarketTrendAnalysis(userInterests),
        ]);

        return {
          userInterests,
          recommendedCareers: guidance.recommendedCareers,
          skills: skills.skills,
          companies: companies.companies,
          recommendations: recommendations.recommendations,
          marketTrends: trends.trends,
          guidance: guidance.guidance,
          summary: guidance.summary,
        };
      } catch (error) {
        throw new Error(`Failed to generate career guidance: ${getErrorMessage(error)}`);
      }
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Career guidance generated successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useGenerateCareerSkills() {
  return useMutation({
    mutationFn: async (userInterests: UserInterests): Promise<AIGeneratedSkill[]> => {
      try {
        const result = await generateCareerSkillsAnalysis(userInterests);
        return result.skills;
      } catch (error) {
        throw new Error(`Failed to generate career skills: ${getErrorMessage(error)}`);
      }
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useGenerateCompanyRecommendations() {
  return useMutation({
    mutationFn: async (userInterests: UserInterests): Promise<AIGeneratedCompany[]> => {
      try {
        const result = await generateCompanyRecommendations(userInterests);
        return result.companies;
      } catch (error) {
        throw new Error(`Failed to generate company recommendations: ${getErrorMessage(error)}`);
      }
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useGenerateCareerRecommendations() {
  return useMutation({
    mutationFn: async (userInterests: UserInterests): Promise<AIRecommendation[]> => {
      try {
        const result = await generateCareerRecommendations(userInterests);
        return result.recommendations;
      } catch (error) {
        throw new Error(`Failed to generate recommendations: ${getErrorMessage(error)}`);
      }
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useGenerateJobMarketTrends() {
  return useMutation({
    mutationFn: async (userInterests: UserInterests): Promise<AIJobMarketTrend[]> => {
      try {
        const result = await generateJobMarketTrendAnalysis(userInterests);
        return result.trends;
      } catch (error) {
        throw new Error(`Failed to generate job market trends: ${getErrorMessage(error)}`);
      }
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}
