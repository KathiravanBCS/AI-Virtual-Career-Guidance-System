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

export interface DashboardSummaryUser {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture_url: string | null;
  role_name: string;
  last_login: string | null;
  personality_type: string | null;
  career_goal: string | null;
  years_of_experience: number;
}

export interface DashboardKpis {
  total_points: number;
  current_streak: number;
  longest_streak: number;
  rank: number;
  weekly_points: number;
  monthly_points: number;
  total_learning_paths: number;
  active_learning_paths: number;
  completed_learning_paths: number;
  overall_completion_percentage: number;
  total_modules: number;
  completed_modules: number;
  in_progress_modules: number;
  total_recommendations: number;
  total_user_skills: number;
  total_skill_gaps: number;
  critical_skill_gaps: number;
  total_quizzes: number;
  total_flashcards: number;
  total_chat_sessions: number;
  active_chat_sessions: number;
  total_chat_messages: number;
}

export interface DashboardTopCareerMatch {
  career_title: string;
  match_score: number;
}

export interface DashboardInsights {
  top_career_match: DashboardTopCareerMatch | null;
  skill_alignment_avg: number;
  learning_status_breakdown: Record<string, number>;
  skill_gap_breakdown: Record<string, number>;
  activity_breakdown: Record<string, number>;
}

export interface DashboardActivity {
  id?: number;
  activity_type?: string;
  points_earned?: number;
  created_at?: string;
  reference_type?: string;
  reference_id?: number;
  description?: string;
}

export interface DashboardQuickAction {
  key: string;
  label: string;
  route: string;
  allowed: boolean;
  reason_if_blocked: string | null;
}

export interface DashboardAdminStats {
  [key: string]: unknown;
}

export interface DashboardSummaryResponse {
  generated_at: string;
  user: DashboardSummaryUser;
  kpis: DashboardKpis;
  insights: DashboardInsights;
  recent_activity: DashboardActivity[];
  quick_actions: DashboardQuickAction[];
  admin_stats: DashboardAdminStats | null;
}
