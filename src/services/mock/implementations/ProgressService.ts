// Mock Progress Service
import { mockLearningPathProgress, mockProgressStats, mockQuizProgress } from '../data/progress';
import type { LearningPathProgress, ProgressStats, QuizProgressData } from '../data/progress';
import { delay } from '../utils';

export class ProgressService {
  /**
   * Get progress statistics
   */
  async getProgressStats(): Promise<ProgressStats> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockProgressStats));
  }

  /**
   * Get quiz progress data
   */
  async getQuizProgress(): Promise<QuizProgressData[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockQuizProgress));
  }

  /**
   * Get learning path progress
   */
  async getLearningPathProgress(): Promise<LearningPathProgress[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockLearningPathProgress));
  }

  /**
   * Get all progress data
   */
  async getAllProgressData() {
    const [stats, quizProgress, pathProgress] = await Promise.all([
      this.getProgressStats(),
      this.getQuizProgress(),
      this.getLearningPathProgress(),
    ]);

    return {
      stats,
      quizProgress,
      pathProgress,
    };
  }

  /**
   * Get quiz progress for last N days
   */
  async getQuizProgressForDays(days: number = 30): Promise<QuizProgressData[]> {
    await delay(300);
    return mockQuizProgress.slice(-days);
  }

  /**
   * Get average quiz accuracy
   */
  async getAverageAccuracy(): Promise<number> {
    await delay(200);
    const accuracies = mockQuizProgress.map((q) => q.accuracy);
    if (accuracies.length === 0) return 0;
    const sum = accuracies.reduce((a, b) => a + b, 0);
    return Math.round(sum / accuracies.length);
  }

  /**
   * Get progress for specific path
   */
  async getPathProgress(pathName: string): Promise<LearningPathProgress | null> {
    await delay(300);
    return mockLearningPathProgress.find((p) => p.pathName === pathName) || null;
  }

  /**
   * Update learning path progress
   */
  async updatePathProgress(
    pathName: string,
    completedModules: number,
    totalModules: number
  ): Promise<LearningPathProgress> {
    await delay(400);
    const pathProgress = await this.getPathProgress(pathName);
    if (!pathProgress) {
      throw new Error(`Path not found: ${pathName}`);
    }
    pathProgress.completedModules = completedModules;
    pathProgress.totalModules = totalModules;
    pathProgress.progress = Math.round((completedModules / totalModules) * 100);
    pathProgress.lastUpdated = new Date().toISOString().split('T')[0];
    return pathProgress;
  }
}

export const mockProgressService = new ProgressService();
