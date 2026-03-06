import { useQuery } from '@tanstack/react-query';

import { StreakData } from '../types';

export const useGetStreakData = () => {
  return useQuery({
    queryKey: ['streakData'],
    queryFn: async (): Promise<StreakData> => {
      // Mock data - replace with actual API calls when backend is ready
      return {
        currentStreak: 23,
        longestStreak: 47,
        totalDaysActive: 156,
        lastActivityDate: new Date().toISOString(),
        streakHistory: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          completed: Math.random() > 0.3,
        })),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
