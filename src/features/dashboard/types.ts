// Dashboard feature types
export interface UserStats {
  completedPaths: number;
  totalModulesCompleted: number;
  avgQuizScore: number | string;
}

export interface QuizScore {
  id?: number;
  moduleID: string;
  moduleName: string;
  score: number;
  total: number;
  accuracy: string | number;
  date: string;
}

export interface RecentActivity {
  type: 'quiz' | 'flashcard';
  moduleID: string;
  moduleName: string;
  date: string;
  score?: number;
  total?: number;
  accuracy?: number;
  feedback?: string | null;
}

export interface LearningPath {
  $id: string;
  careerName: string;
  modules: unknown[];
  completedModules: unknown[];
  progress: number;
  aiNudges: unknown[];
}

export interface AINudge {
  text: string;
  type: 'tip' | 'warning' | 'success' | 'info';
  icon: string;
  actionText?: string;
}

export interface QuickAction {
  icon: string;
  label: string;
  description: string;
  path: string;
  gradient: string;
}

export interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  path: string;
  stats: string;
}
