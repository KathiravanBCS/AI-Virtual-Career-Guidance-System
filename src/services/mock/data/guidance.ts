// Mock Guidance Sessions Data
export interface GuidanceSession {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  status: 'completed' | 'scheduled' | 'in-progress';
  feedback: string;
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockGuidanceSessions: GuidanceSession[] = [
  {
    id: 'session-001',
    title: 'Career Path Assessment',
    description: 'Initial assessment to determine your career goals and learning objectives.',
    date: '2024-02-18',
    duration: 45,
    status: 'completed',
    feedback:
      'You have shown excellent potential in web development. Your JavaScript skills are strong, and you have a good understanding of frontend technologies.',
    recommendations: [
      'Focus on backend development to become a full-stack developer',
      'Practice building projects to apply your knowledge',
      'Consider learning a database technology',
    ],
    createdAt: '2024-02-18T09:00:00Z',
    updatedAt: '2024-02-18T09:45:00Z',
  },
  {
    id: 'session-002',
    title: 'Learning Path Selection',
    description: 'Discussion about the best learning path for your goals.',
    date: '2024-02-20',
    duration: 30,
    status: 'completed',
    feedback:
      'We selected the "Full Stack Developer" path, which aligns well with your interests and current skill level.',
    recommendations: [
      'Start with JavaScript Fundamentals module',
      'Set a daily learning goal of 2 hours',
      'Complete at least one quiz per week',
    ],
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:30:00Z',
  },
  {
    id: 'session-003',
    title: 'Progress Review',
    description: 'Review your progress and adjust learning strategy.',
    date: '2024-02-22',
    duration: 40,
    status: 'scheduled',
    feedback: 'Pending',
    recommendations: ['Scheduled for review on 2024-02-22'],
    createdAt: '2024-02-22T14:00:00Z',
    updatedAt: '2024-02-22T14:00:00Z',
  },
];

export interface GuidanceRecommendation {
  id: string;
  type: 'learning_path' | 'quiz' | 'flashcard' | 'project' | 'skill';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  createdAt: string;
}

export const mockGuidanceRecommendations: GuidanceRecommendation[] = [
  {
    id: 'rec-001',
    type: 'learning_path',
    title: 'Complete Full Stack Developer Path',
    description: 'This path will equip you with both frontend and backend skills needed for modern web development.',
    priority: 'high',
    actionUrl: '/learning-paths/path-001',
    createdAt: '2024-02-20T10:30:00Z',
  },
  {
    id: 'rec-002',
    type: 'project',
    title: 'Build a Todo Application',
    description: 'Create a full-stack todo app to practice React frontend and Node.js backend skills.',
    priority: 'high',
    createdAt: '2024-02-20T10:30:00Z',
  },
  {
    id: 'rec-003',
    type: 'skill',
    title: 'Learn Database Design',
    description: 'Understanding databases is crucial for backend development. Focus on SQL and relationships.',
    priority: 'high',
    createdAt: '2024-02-20T10:30:00Z',
  },
  {
    id: 'rec-004',
    type: 'quiz',
    title: 'Take Advanced React Quiz',
    description: 'Test your knowledge of advanced React patterns and hooks.',
    priority: 'medium',
    actionUrl: '/quiz?module=module-002&difficulty=advanced',
    createdAt: '2024-02-20T10:30:00Z',
  },
  {
    id: 'rec-005',
    type: 'flashcard',
    title: 'Review TypeScript Concepts',
    description: 'Use flashcards to reinforce TypeScript terminology and concepts.',
    priority: 'medium',
    actionUrl: '/flashcards?module=module-003',
    createdAt: '2024-02-20T10:30:00Z',
  },
];

export interface GuidanceGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
  createdAt: string;
  completedAt?: string;
}

export const mockGuidanceGoals: GuidanceGoal[] = [
  {
    id: 'goal-001',
    title: 'Master JavaScript',
    description: 'Complete all JavaScript fundamentals and advanced concepts',
    targetDate: '2024-03-15',
    priority: 'high',
    status: 'completed',
    progress: 100,
    createdAt: '2024-02-01T08:00:00Z',
    completedAt: '2024-02-18T16:30:00Z',
  },
  {
    id: 'goal-002',
    title: 'Learn React',
    description: 'Complete React Basics module and build a simple app',
    targetDate: '2024-04-01',
    priority: 'high',
    status: 'in-progress',
    progress: 75,
    createdAt: '2024-02-15T08:00:00Z',
  },
  {
    id: 'goal-003',
    title: 'Build Full-Stack Project',
    description: 'Create a complete full-stack application from scratch',
    targetDate: '2024-05-15',
    priority: 'high',
    status: 'pending',
    progress: 10,
    createdAt: '2024-02-20T08:00:00Z',
  },
  {
    id: 'goal-004',
    title: 'Maintain 30-day Streak',
    description: 'Keep a consistent 30-day learning streak',
    targetDate: '2024-03-20',
    priority: 'medium',
    status: 'in-progress',
    progress: 26,
    createdAt: '2024-02-20T08:00:00Z',
  },
];
