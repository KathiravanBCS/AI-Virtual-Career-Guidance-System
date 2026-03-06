// Mock Leaderboard Service
import type { LeaderboardData, LeaderboardUser } from '@/features/leaderboard/types';

import { mockCurrentUserLeaderboard, mockLeaderboardData, mockLeaderboardUsers } from '../data/leaderboard';
import { delay } from '../utils';

export class LeaderboardService {
  /**
   * Get leaderboard data
   */
  async getLeaderboardData(): Promise<LeaderboardData> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockLeaderboardData));
  }

  /**
   * Get all leaderboard users
   */
  async getAllUsers(): Promise<LeaderboardUser[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockLeaderboardUsers));
  }

  /**
   * Get user by rank
   */
  async getUserByRank(rank: number): Promise<LeaderboardUser> {
    await delay(300);
    const user = mockLeaderboardUsers.find((u) => u.rank === rank);
    if (!user) {
      throw new Error(`User with rank ${rank} not found`);
    }
    return JSON.parse(JSON.stringify(user));
  }

  /**
   * Get top N users
   */
  async getTopUsers(limit: number = 10): Promise<LeaderboardUser[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockLeaderboardUsers.slice(0, limit)));
  }

  /**
   * Get current user leaderboard info
   */
  async getCurrentUserInfo(): Promise<LeaderboardUser> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockCurrentUserLeaderboard));
  }

  /**
   * Get users around current rank
   */
  async getUsersAroundRank(rank: number, range: number = 5): Promise<LeaderboardUser[]> {
    await delay(300);
    const startRank = Math.max(1, rank - range);
    const endRank = rank + range;
    return mockLeaderboardUsers.filter((u) => u.rank >= startRank && u.rank <= endRank);
  }

  /**
   * Search users by name
   */
  async searchUsers(query: string): Promise<LeaderboardUser[]> {
    await delay(400);
    const lowerQuery = query.toLowerCase();
    return mockLeaderboardUsers.filter((u) => u.name.toLowerCase().includes(lowerQuery));
  }
}

export const mockLeaderboardService = new LeaderboardService();
