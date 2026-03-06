export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  lastActivityDate: string;
  streakHistory: Array<{ date: string; completed: boolean }>;
}

export interface StreakStats {
  label: string;
  value: number | string;
  icon: string;
}
