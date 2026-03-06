import { useQuery } from '@tanstack/react-query';

import { LeaderboardData } from '../types';

// Mock implementation - replace with actual API call
export const useGetLeaderboardData = () => {
  return useQuery({
    queryKey: ['leaderboardData'],
    queryFn: async (): Promise<LeaderboardData> => {
      // Mock data
      return {
        topUsers: [
          { rank: 1, name: 'Alex Chen', points: 4500, streak: 45, accuracy: 95.5 },
          { rank: 2, name: 'Sarah Johnson', points: 4200, streak: 38, accuracy: 92.3 },
          { rank: 3, name: 'Mike Davis', points: 3900, streak: 32, accuracy: 88.7 },
          { rank: 4, name: 'Emily Wilson', points: 3500, streak: 25, accuracy: 85.2 },
          { rank: 5, name: 'John Smith', points: 3200, streak: 20, accuracy: 82.1 },
        ],
        currentUserRank: 12,
        currentUserPoints: 2100,
      };
    },
    staleTime: 10 * 60 * 1000,
  });
};
