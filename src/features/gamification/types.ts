// Activity Types
export type ActivityType =
  | 'module_complete'
  | 'quiz_pass'
  | 'quiz_attempt'
  | 'flashcard_read'
  | 'flashcard_set_complete'
  | 'daily_login'
  | 'assessment_complete';

export type ReferenceType =
  | 'learning_module'
  | 'quiz'
  | 'flashcard'
  | 'assessment'
  | 'user';

export type LeaderboardPeriod =
  | 'all_time'
  | 'weekly'
  | 'monthly'
  | 'yearly';

// User Points
export interface UserPoints {
  user_id: number;
  total_points: number;
  current_streak: number;
  badge_count?: number;
  updated_at?: string;
}

// User Stats (Dashboard)
export interface UserStats {
  user_id: number;
  total_points: number;
  current_rank: number;
  total_users: number;
  weekly_points: number;
  monthly_points: number;
  yearly_points: number;
  current_streak: number;
  longest_streak: number;
  badge_count: number;
  updated_at?: string;
}

// Streak Info
export interface StreakInfo {
  user_id: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  reset_date?: string;
  created_at?: string;
  updated_at?: string;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  user_name: string;
  user_photo?: string;
  total_points: number;
  streak: number;
  is_current_user?: boolean;
  updated_at?: string;
}

// Leaderboard Response
export interface LeaderboardResponse {
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  current_user_rank?: number;
  total_users: number;
  updated_at?: string;
}

// Activity Log Entry
export interface ActivityLog {
  id?: number;
  user_id: number;
  activity_type: ActivityType;
  reference_id: number;
  reference_type: ReferenceType;
  points_earned: number;
  activity_metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Activity Log Request
export interface LogActivityRequest {
  activity_type: ActivityType;
  reference_id: number;
  reference_type: ReferenceType;
  activity_metadata?: Record<string, any>;
}

// Activity Log Response (after posting)
export interface LogActivityResponse {
  id: number;
  user_id: number;
  activity_type: ActivityType;
  points_earned: number;
  new_total_points: number;
  message?: string;
  created_at?: string;
}

// Points Notification
export interface PointsNotification {
  points: number;
  activity_type: ActivityType;
  message: string;
  timestamp: string;
}

// User Stats Response (List)
export interface UserStatsListResponse {
  data: UserStats[];
  total: number;
  page: number;
  per_page: number;
}

// Activity Log List Response
export interface ActivityLogListResponse {
  data: ActivityLog[];
  total: number;
  page: number;
  per_page: number;
}

// Points History (for charts)
export interface PointsHistory {
  date: string;
  points_earned: number;
  cumulative_points: number;
}

// Dashboard Summary
export interface GamificationDashboard {
  userPoints: UserPoints;
  userStats: UserStats;
  streakInfo: StreakInfo;
  recentActivities: ActivityLog[];
  pointsHistory: PointsHistory[];
}
