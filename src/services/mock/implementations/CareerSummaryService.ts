// Mock Career Summary Service
import { mockCareerSummary, mockCareerSummaryStats, mockModuleCompletion } from '../data/careerSummary';
import type { CareerSummary, CareerSummaryStats } from '../data/careerSummary';
import { delay } from '../utils';

export class CareerSummaryService {
  /**
   * Get career summary
   */
  async getCareerSummary(): Promise<CareerSummary> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockCareerSummary));
  }

  /**
   * Get career summary statistics
   */
  async getCareerStats(): Promise<CareerSummaryStats> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockCareerSummaryStats));
  }

  /**
   * Get module completion status
   */
  async getModuleCompletion(): Promise<Record<string, boolean>> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockModuleCompletion));
  }

  /**
   * Get all career summary data
   */
  async getAllCareerData() {
    const [summary, stats, completion] = await Promise.all([
      this.getCareerSummary(),
      this.getCareerStats(),
      this.getModuleCompletion(),
    ]);

    return {
      summary,
      stats,
      completion,
    };
  }

  /**
   * Generate PDF summary (mock)
   */
  async generatePDFSummary(): Promise<Blob> {
    await delay(1000);
    // In a real application, this would generate actual PDF
    return new Blob(['Career Summary PDF Content'], { type: 'application/pdf' });
  }

  /**
   * Get recommendations
   */
  async getRecommendations(): Promise<string[]> {
    await delay(300);
    return mockCareerSummary.recommendedPaths;
  }

  /**
   * Get next steps
   */
  async getNextSteps(): Promise<string[]> {
    await delay(300);
    return mockCareerSummary.nextSteps;
  }

  /**
   * Get strengths
   */
  async getStrengths(): Promise<string[]> {
    await delay(300);
    return mockCareerSummary.strengths;
  }

  /**
   * Get areas for improvement
   */
  async getAreasForImprovement(): Promise<string[]> {
    await delay(300);
    return mockCareerSummary.areasForImprovement;
  }

  /**
   * Update career goal
   */
  async updateCareerGoal(newGoal: string): Promise<CareerSummary> {
    await delay(400);
    mockCareerSummary.careerGoal = newGoal;
    mockCareerSummary.generatedAt = new Date().toISOString();
    return JSON.parse(JSON.stringify(mockCareerSummary));
  }
}

export const mockCareerSummaryService = new CareerSummaryService();
