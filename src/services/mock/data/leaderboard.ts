// Mock Leaderboard Data
import type { LeaderboardData, LeaderboardUser } from '@/features/leaderboard/types';

export const mockLeaderboardUsers: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Rajesh Kumar',
    points: 2850,
    streak: 45,
    accuracy: 92,
  },
  {
    rank: 2,
    name: 'Priya Singh',
    points: 2720,
    streak: 38,
    accuracy: 89,
  },
  {
    rank: 3,
    name: 'Amit Patel',
    points: 2680,
    streak: 35,
    accuracy: 87,
  },
  {
    rank: 4,
    name: 'Sneha Sharma',
    points: 2540,
    streak: 32,
    accuracy: 85,
  },
  {
    rank: 5,
    name: 'Arjun Verma',
    points: 2490,
    streak: 28,
    accuracy: 83,
  },
  {
    rank: 6,
    name: 'Divya Nair',
    points: 2380,
    streak: 25,
    accuracy: 81,
  },
  {
    rank: 7,
    name: 'Vikas Rao',
    points: 2250,
    streak: 20,
    accuracy: 79,
  },
  {
    rank: 8,
    name: 'Ananya Gupta',
    points: 2100,
    streak: 18,
    accuracy: 76,
  },
  {
    rank: 9,
    name: 'Rohan Desai',
    points: 1950,
    streak: 15,
    accuracy: 74,
  },
  {
    rank: 10,
    name: 'Pooja Menon',
    points: 1820,
    streak: 12,
    accuracy: 72,
  },
];

export const mockLeaderboardData: LeaderboardData = {
  topUsers: mockLeaderboardUsers,
  currentUserRank: 15,
  currentUserPoints: 1650,
};

// Mock current user leaderboard info
export const mockCurrentUserLeaderboard: LeaderboardUser = {
  rank: 15,
  name: 'Your Name',
  points: 1650,
  streak: 8,
  accuracy: 68,
};
