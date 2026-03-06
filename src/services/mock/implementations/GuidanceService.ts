// Mock Guidance Service
import { mockGuidanceGoals, mockGuidanceRecommendations, mockGuidanceSessions } from '../data/guidance';
import type { GuidanceGoal, GuidanceRecommendation, GuidanceSession } from '../data/guidance';
import { delay } from '../utils';

export class GuidanceService {
  /**
   * Get all guidance sessions
   */
  async getSessions(): Promise<GuidanceSession[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockGuidanceSessions));
  }

  /**
   * Get session by ID
   */
  async getSessionById(sessionId: string): Promise<GuidanceSession> {
    await delay(300);
    const session = mockGuidanceSessions.find((s) => s.id === sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }
    return JSON.parse(JSON.stringify(session));
  }

  /**
   * Get completed sessions
   */
  async getCompletedSessions(): Promise<GuidanceSession[]> {
    await delay(300);
    return mockGuidanceSessions.filter((s) => s.status === 'completed');
  }

  /**
   * Get scheduled sessions
   */
  async getScheduledSessions(): Promise<GuidanceSession[]> {
    await delay(300);
    return mockGuidanceSessions.filter((s) => s.status === 'scheduled');
  }

  /**
   * Get recommendations
   */
  async getRecommendations(): Promise<GuidanceRecommendation[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockGuidanceRecommendations));
  }

  /**
   * Get recommendation by ID
   */
  async getRecommendationById(recId: string): Promise<GuidanceRecommendation> {
    await delay(300);
    const recommendation = mockGuidanceRecommendations.find((r) => r.id === recId);
    if (!recommendation) {
      throw new Error(`Recommendation not found: ${recId}`);
    }
    return JSON.parse(JSON.stringify(recommendation));
  }

  /**
   * Get recommendations by type
   */
  async getRecommendationsByType(
    type: 'learning_path' | 'quiz' | 'flashcard' | 'project' | 'skill'
  ): Promise<GuidanceRecommendation[]> {
    await delay(300);
    return mockGuidanceRecommendations.filter((r) => r.type === type);
  }

  /**
   * Get high priority recommendations
   */
  async getHighPriorityRecommendations(): Promise<GuidanceRecommendation[]> {
    await delay(300);
    return mockGuidanceRecommendations.filter((r) => r.priority === 'high');
  }

  /**
   * Get goals
   */
  async getGoals(): Promise<GuidanceGoal[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockGuidanceGoals));
  }

  /**
   * Get goal by ID
   */
  async getGoalById(goalId: string): Promise<GuidanceGoal> {
    await delay(300);
    const goal = mockGuidanceGoals.find((g) => g.id === goalId);
    if (!goal) {
      throw new Error(`Goal not found: ${goalId}`);
    }
    return JSON.parse(JSON.stringify(goal));
  }

  /**
   * Get active goals
   */
  async getActiveGoals(): Promise<GuidanceGoal[]> {
    await delay(300);
    return mockGuidanceGoals.filter((g) => g.status !== 'completed');
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(goalId: string, progress: number): Promise<GuidanceGoal> {
    await delay(400);
    const goal = await this.getGoalById(goalId);
    goal.progress = Math.min(100, Math.max(0, progress));
    if (goal.progress === 100 && goal.status !== 'completed') {
      goal.status = 'completed';
      goal.completedAt = new Date().toISOString();
    }
    return goal;
  }

  /**
   * Create new goal
   */
  async createGoal(
    title: string,
    description: string,
    targetDate: string,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<GuidanceGoal> {
    await delay(400);
    const newGoal: GuidanceGoal = {
      id: `goal-${Date.now()}`,
      title,
      description,
      targetDate,
      priority,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    mockGuidanceGoals.push(newGoal);
    return newGoal;
  }

  /**
   * Get guidance summary
   */
  async getGuidanceSummary() {
    const [sessions, recommendations, goals] = await Promise.all([
      this.getSessions(),
      this.getRecommendations(),
      this.getGoals(),
    ]);

    return {
      completedSessions: sessions.filter((s) => s.status === 'completed').length,
      scheduledSessions: sessions.filter((s) => s.status === 'scheduled').length,
      totalRecommendations: recommendations.length,
      highPriorityRecs: recommendations.filter((r) => r.priority === 'high').length,
      activeGoals: goals.filter((g) => g.status === 'in-progress').length,
      completedGoals: goals.filter((g) => g.status === 'completed').length,
    };
  }
}

export const mockGuidanceService = new GuidanceService();
