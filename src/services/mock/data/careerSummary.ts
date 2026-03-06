// Mock Career Summary Data
export interface CareerSummary {
  userId: string;
  careerGoal: string;
  currentLevel: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendedPaths: string[];
  progressSummary: string;
  nextSteps: string[];
  estimatedTimeToGoal: string;
  generatedAt: string;
}

export const mockCareerSummary: CareerSummary = {
  userId: 'user-123',
  careerGoal: 'Full Stack Developer',
  currentLevel: 'Intermediate',
  strengths: [
    'Strong JavaScript fundamentals',
    'Good understanding of React and component architecture',
    'Solid grasp of HTML and CSS',
    'Problem-solving skills',
    'Quick learning ability',
  ],
  areasForImprovement: [
    'Backend development (Node.js, databases)',
    'DevOps and deployment practices',
    'Advanced TypeScript patterns',
    'Testing and debugging',
    'System design concepts',
  ],
  recommendedPaths: [
    'Backend Development with Node.js',
    'Database Design and Optimization',
    'DevOps Fundamentals',
    'Advanced React Patterns',
  ],
  progressSummary:
    'You have made excellent progress in the frontend domain. You have completed 2 learning paths and scored an average of 78.5% in quizzes. Your current focus should be on backend technologies to become a true full stack developer.',
  nextSteps: [
    'Complete the Node.js Essentials module',
    'Start learning relational databases (SQL)',
    'Practice building REST APIs',
    'Explore Docker and containerization',
    'Work on a full-stack project to integrate all skills',
  ],
  estimatedTimeToGoal: '3-4 months',
  generatedAt: new Date().toISOString(),
};

export interface CareerSummaryStats {
  pathsStarted: number;
  pathsCompleted: number;
  modulesCompleted: number;
  totalLearningHours: number;
  averageQuizScore: number;
  longestStreak: number;
  currentStreak: number;
}

export const mockCareerSummaryStats: CareerSummaryStats = {
  pathsStarted: 3,
  pathsCompleted: 1,
  modulesCompleted: 6,
  totalLearningHours: 85,
  averageQuizScore: 78.5,
  longestStreak: 45,
  currentStreak: 8,
};

export const mockModuleCompletion: Record<string, boolean> = {
  'JavaScript Fundamentals': true,
  'React Basics': true,
  'TypeScript Advanced': true,
  'HTML & CSS Fundamentals': true,
  'JavaScript for Web': true,
  'REST API Design': true,
  'Node.js Essentials': false,
  'Database Design': false,
  'DevOps Fundamentals': false,
};
