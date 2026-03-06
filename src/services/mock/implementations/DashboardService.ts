// Mock Dashboard Service
import type { LearningPath, QuizScore, RecentActivity, UserStats } from '@/features/dashboard/types';

import { BaseMockService } from '../BaseService';
import { mockLearningPaths, mockQuizScores, mockRecentActivity, mockUserStats } from '../data/dashboard';

export class DashboardService extends BaseMockService<QuizScore, Partial<QuizScore>, Partial<QuizScore>> {
  constructor() {
    super(mockQuizScores, 1000, 300);
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    await this.delay(300);
    return JSON.parse(JSON.stringify(mockUserStats));
  }

  /**
   * Get quiz scores
   */
  async getQuizScores(): Promise<QuizScore[]> {
    return this.getAll();
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(): Promise<RecentActivity[]> {
    await this.delay(300);
    return JSON.parse(JSON.stringify(mockRecentActivity));
  }

  /**
   * Get learning paths
   */
  async getLearningPaths(): Promise<LearningPath[]> {
    await this.delay(300);
    return JSON.parse(JSON.stringify(mockLearningPaths));
  }

  /**
   * Get dashboard data (all together)
   */
  async getDashboardData() {
    const [stats, scores, activity, paths] = await Promise.all([
      this.getUserStats(),
      this.getQuizScores(),
      this.getRecentActivity(),
      this.getLearningPaths(),
    ]);

    return {
      stats,
      scores,
      activity,
      paths,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockDashboardService = new DashboardService();
