// Mock Services - Main Export
import { mockCareerSummaryService } from './implementations/CareerSummaryService';
import { mockChatService } from './implementations/ChatService';
import { mockDashboardService } from './implementations/DashboardService';
import { mockFlashcardService } from './implementations/FlashcardService';
import { mockGuidanceService } from './implementations/GuidanceService';
import { mockLeaderboardService } from './implementations/LeaderboardService';
import { mockLearningPathService } from './implementations/LearningPathService';
import { mockProgressService } from './implementations/ProgressService';
import { mockQuizService } from './implementations/QuizService';
import { mockStreakService } from './implementations/StreakService';
import { mockUserService } from './implementations/UserService';

/**
 * Aggregated Mock Services
 * All mock service implementations are exported here
 */
export const MockServices = {
  users: mockUserService,
  dashboard: mockDashboardService,
  quiz: mockQuizService,
  learningPath: mockLearningPathService,
  leaderboard: mockLeaderboardService,
  streak: mockStreakService,
  flashcard: mockFlashcardService,
  progress: mockProgressService,
  careerSummary: mockCareerSummaryService,
  chat: mockChatService,
  guidance: mockGuidanceService,
};

export type MockServicesType = typeof MockServices;

// Re-export individual services
export { mockUserService, MockUserService } from './implementations/UserService';
export { mockDashboardService, DashboardService } from './implementations/DashboardService';
export { mockQuizService, QuizService } from './implementations/QuizService';
export { mockLearningPathService, LearningPathService } from './implementations/LearningPathService';
export { mockLeaderboardService, LeaderboardService } from './implementations/LeaderboardService';
export { mockStreakService, StreakService } from './implementations/StreakService';
export { mockFlashcardService, FlashcardService } from './implementations/FlashcardService';
export { mockProgressService, ProgressService } from './implementations/ProgressService';
export { mockCareerSummaryService, CareerSummaryService } from './implementations/CareerSummaryService';
export { mockChatService, ChatService } from './implementations/ChatService';
export { mockGuidanceService, GuidanceService } from './implementations/GuidanceService';

// Export base class and utilities
export { BaseMockService } from './BaseService';
export * from './utils';
