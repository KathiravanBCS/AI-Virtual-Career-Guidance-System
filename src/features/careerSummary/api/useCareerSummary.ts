import { useQuery } from '@tanstack/react-query';

import { Assessment, CareerPath, UserData, LearningGuidanceData, CareerSummaryResponse } from '../types';
import { generateCareerSummaryFromLearningGuidance } from '../../../config/groq.config';
import { api } from '../../../lib/api';
import { API_ENDPOINTS } from '../../../lib/api-endpoints';

/**
 * Fetch learning guidance data from the backend API
 * Uses the endpoint: /api/v1/learning-guidance/guidance/learning-modules/all
 */
export const useGetLearningGuidanceData = (userId?: string | number) => {
  return useQuery({
    queryKey: ['learningGuidanceData', userId],
    queryFn: async () => {
      try {
        // Fetch from backend API using the correct endpoint
        const response = await api.learningGuidance.getWithModulesAll();
        return response as LearningGuidanceData;
      } catch (error) {
        console.error('Failed to fetch learning guidance data:', error);
        // Fallback to mock data if API fails
        return getMockLearningData();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  });
};

/**
 * Generate career summaries from learning guidance data
 * Calls the GROQ AI to generate personalized summaries
 */
export const useGenerateCareerSummaries = (learningData: LearningGuidanceData | null) => {
  return useQuery({
    queryKey: ['careerSummaries', learningData?.id],
    queryFn: async () => {
      if (!learningData) return null;

      try {
        // Generate summary using AI
        const summaryText = await generateCareerSummaryFromLearningGuidance({
          name: learningData.name,
          age: learningData.age,
          career_goal: learningData.career_goal,
          current_skills: learningData.current_skills,
          interests: learningData.interests,
          assessment_answers: learningData.assessment_answers,
          completion_percentage: learningData.completion_percentage,
          learning_modules: learningData.learning_modules,
        });

        // Calculate module statistics
        const modulesData = {
          total: learningData.learning_modules.length,
          completed: learningData.learning_modules.filter((m) => m.status === 'completed').length,
          active: learningData.learning_modules.filter((m) => m.status === 'active').length,
          pending: learningData.learning_modules.filter((m) => m.status === 'pending').length,
        };

        const response: CareerSummaryResponse = {
          careerPath: learningData.learning_modules.length > 0 ? learningData.learning_modules[0] : null,
          summaryText,
          generatedAt: new Date().toISOString(),
          modulesData,
        };

        return response;
      } catch (error) {
        console.error('Failed to generate career summaries:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!learningData,
  });
};

/**
 * Legacy hook for backward compatibility
 * Fetches career summary data from the backend
 */
export const useGetCareerSummaryData = () => {
  return useQuery({
    queryKey: ['careerSummaryData'],
    queryFn: async () => {
      // Mock data - replace with actual API calls when backend is ready
      const userData: UserData = {
        name: 'John Doe',
        careerGoal: 'Become a Full Stack Developer',
        interests: ['Web Development', 'Machine Learning', 'Cloud Computing'],
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      };

      const careerPaths: CareerPath[] = [
        {
          $id: '1',
          careerName: 'Full Stack Development',
          modules: ['Module 1', 'Module 2', 'Module 3'],
          completedModules: ['Module 1', 'Module 2'],
          progress: 65,
          recommendedSkills: ['JavaScript', 'React', 'Node.js'],
        },
        {
          $id: '2',
          careerName: 'Data Science',
          modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4'],
          completedModules: ['Module 1'],
          progress: 25,
          recommendedSkills: ['Python', 'SQL', 'Machine Learning'],
        },
      ];

      const assessments: Assessment[] = [
        {
          moduleID: '1',
          moduleName: 'JavaScript Basics',
          score: 85,
          feedback: 'Accuracy: 85%',
        },
        {
          moduleID: '2',
          moduleName: 'React Fundamentals',
          score: 78,
          feedback: 'Accuracy: 78%',
        },
      ];

      return {
        user: userData,
        paths: careerPaths,
        assessments,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Mock learning guidance data for development/testing
 */
function getMockLearningData(): LearningGuidanceData {
  return {
    id: 7,
    name: 'Kathiravan V',
    age: 23,
    career_goal: 'Backend Developer for Medical Devices',
    current_skills: ['SQL', 'database', 'Database Design'],
    interests: ['Data Science', 'Web Development', 'DevOps', 'Backend Development'],
    assessment_answers: {
      '1': 'Solving puzzles or figuring out how things work',
      '2': 'Thinking about goals, money, or future plan',
      '3': 'Organiser or leader',
      '4': 'Imagination and originality',
      '5': 'Designing or creating something meaningful',
      '6': 'Emotional, artistic, or creative stories',
      '7': 'Fast-paced and goal-driven',
      '8': 'Through words, art, or visuals',
      '9': 'Leadership',
      '10': 'Creating meaningful ideas',
    },
    learning_guidance_code: 'LG-2026-00007',
    user_id: 1,
    status: 'in_progress',
    completion_percentage: 71,
    created_at: '2026-04-07T12:54:09.198109',
    updated_at: '2026-04-07T12:55:52.460011',
    learning_modules: [
      {
        id: 24,
        title: 'Introduction to Backend Development for Medical Devices',
        description:
          'This module introduces the fundamentals of backend development, medical device regulations, and the role of a backend developer in the medical device industry.',
        estimated_time: '4-5 hours',
        content: { keyPoints: [], practicalApplications: [] },
        module_order: 0,
        completion_percentage: 100,
        status: 'completed',
        learning_module_code: 'LM-2026-00024',
        learning_guidance_id: 7,
        created_at: '2026-04-07T12:54:30.663080',
        updated_at: '2026-04-07T12:54:45.235760',
      },
      {
        id: 25,
        title: 'Data Management for Medical Devices',
        description:
          'This module builds on existing database skills, focusing on data management for medical devices.',
        estimated_time: '5-6 hours',
        content: { keyPoints: [], practicalApplications: [] },
        module_order: 1,
        completion_percentage: 100,
        status: 'completed',
        learning_module_code: 'LM-2026-00025',
        learning_guidance_id: 7,
        created_at: '2026-04-07T12:54:30.907958',
        updated_at: '2026-04-07T12:54:51.310062',
      },
    ],
  };
}
