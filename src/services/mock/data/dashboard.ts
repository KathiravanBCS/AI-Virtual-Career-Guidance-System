// Mock Dashboard Data
import type {
  AINudge,
  LearningPath,
  QuickAction,
  QuizScore,
  RecentActivity,
  UserStats,
} from '@/features/dashboard/types';

export const mockUserStats: UserStats = {
  completedPaths: 3,
  totalModulesCompleted: 12,
  avgQuizScore: 78.5,
};

export const mockQuizScores: QuizScore[] = [
  {
    moduleID: 'module-001',
    moduleName: 'JavaScript Fundamentals',
    score: 85,
    total: 100,
    accuracy: 85,
    date: '2024-02-20',
  },
  {
    moduleID: 'module-002',
    moduleName: 'React Basics',
    score: 78,
    total: 100,
    accuracy: 78,
    date: '2024-02-19',
  },
  {
    moduleID: 'module-003',
    moduleName: 'TypeScript Advanced',
    score: 92,
    total: 100,
    accuracy: 92,
    date: '2024-02-18',
  },
  {
    moduleID: 'module-004',
    moduleName: 'CSS Grid Layout',
    score: 75,
    total: 100,
    accuracy: 75,
    date: '2024-02-17',
  },
  {
    moduleID: 'module-005',
    moduleName: 'REST API Design',
    score: 88,
    total: 100,
    accuracy: 88,
    date: '2024-02-16',
  },
];

export const mockRecentActivity: RecentActivity[] = [
  {
    type: 'quiz',
    moduleID: 'module-001',
    moduleName: 'JavaScript Fundamentals',
    date: '2024-02-20',
    score: 85,
    total: 100,
    accuracy: 85,
  },
  {
    type: 'flashcard',
    moduleID: 'module-002',
    moduleName: 'React Basics',
    date: '2024-02-19',
  },
  {
    type: 'quiz',
    moduleID: 'module-003',
    moduleName: 'TypeScript Advanced',
    date: '2024-02-18',
    score: 92,
    total: 100,
    accuracy: 92,
  },
  {
    type: 'flashcard',
    moduleID: 'module-004',
    moduleName: 'CSS Grid Layout',
    date: '2024-02-17',
  },
];

export const mockLearningPaths: LearningPath[] = [
  {
    $id: 'path-001',
    careerName: 'Full Stack Developer',
    modules: [{ title: 'JavaScript Fundamentals' }, { title: 'React Basics' }, { title: 'Node.js Essentials' }],
    completedModules: [{ title: 'JavaScript Fundamentals' }, { title: 'React Basics' }],
    progress: 67,
    aiNudges: [],
  },
  {
    $id: 'path-002',
    careerName: 'Frontend Developer',
    modules: [{ title: 'HTML & CSS' }, { title: 'JavaScript' }, { title: 'React' }, { title: 'Vue.js' }],
    completedModules: [{ title: 'HTML & CSS' }, { title: 'JavaScript' }],
    progress: 50,
    aiNudges: [],
  },
];

export const mockAINudges: AINudge[] = [
  {
    text: 'Great progress on React! Consider exploring advanced patterns next.',
    type: 'success',
    icon: 'star',
    actionText: 'View Advanced Topics',
  },
  {
    text: 'You have a 5-day learning streak! Keep it up.',
    type: 'info',
    icon: 'flame',
  },
  {
    text: 'Your TypeScript quiz score is excellent. Time for the next module?',
    type: 'tip',
    icon: 'lightbulb',
    actionText: 'Start Next Module',
  },
];

export const mockQuickActions: QuickAction[] = [
  {
    icon: 'book-open',
    label: 'Start Quiz',
    description: 'Test your knowledge',
    path: '/quiz',
    gradient: 'linear-gradient(135deg, #ff9d54 0%, #ff8a30 100%)',
  },
  {
    icon: 'cards',
    label: 'Study Flashcards',
    description: 'Review and memorize',
    path: '/flashcards',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    icon: 'chart-line',
    label: 'View Progress',
    description: 'Track your growth',
    path: '/progress',
    gradient: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
  },
  {
    icon: 'path',
    label: 'Learning Paths',
    description: 'Explore careers',
    path: '/learning-paths',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
];
