import { useQuery } from '@tanstack/react-query';

import { LearningPath, QuizScore, RecentActivity, UserStats } from '../types';

interface DashboardData {
  paths: LearningPath[];
  flashcardCount: number;
  quizScores: QuizScore[];
  userStats: UserStats;
  recentActivity: RecentActivity[];
  averageAccuracy: number;
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  // Mock data - replace with actual API calls when backend is ready
  const mockPaths: LearningPath[] = [
    {
      $id: '1',
      careerName: 'Full Stack Development',
      modules: [],
      completedModules: [],
      progress: 65,
      aiNudges: [],
    },
    {
      $id: '2',
      careerName: 'Data Science',
      modules: [],
      completedModules: [],
      progress: 25,
      aiNudges: [],
    },
  ];

  const mockQuizScores: QuizScore[] = [
    {
      moduleID: '1',
      moduleName: 'JavaScript Basics',
      score: 8,
      total: 10,
      accuracy: '80.0',
      date: new Date().toISOString(),
    },
    {
      moduleID: '2',
      moduleName: 'React Fundamentals',
      score: 9,
      total: 10,
      accuracy: '90.0',
      date: new Date().toISOString(),
    },
  ];

  const mockRecentActivity: RecentActivity[] = [
    {
      type: 'quiz',
      moduleID: '1',
      moduleName: 'JavaScript Basics',
      date: new Date().toISOString(),
      score: 8,
      total: 10,
      feedback: 'Great progress!',
    },
    {
      type: 'quiz',
      moduleID: '2',
      moduleName: 'React Fundamentals',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      score: 9,
      total: 10,
      feedback: 'Excellent work!',
    },
  ];

  return {
    paths: mockPaths,
    flashcardCount: 150,
    quizScores: mockQuizScores,
    userStats: {
      completedPaths: 1,
      totalModulesCompleted: 5,
      avgQuizScore: '85.0',
    },
    recentActivity: mockRecentActivity,
    averageAccuracy: 85,
  };
};

export const useGetDashboardData = () => {
  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
