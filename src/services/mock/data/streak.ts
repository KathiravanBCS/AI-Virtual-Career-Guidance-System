// Mock Streak Data
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  lastActivityDate: string;
  activityCalendar: ActivityCalendarDay[];
}

export interface ActivityCalendarDay {
  date: string;
  completed: boolean;
  activity: 'quiz' | 'flashcard' | 'both' | null;
}

// Generate mock 30-day activity calendar
function generateActivityCalendar(): ActivityCalendarDay[] {
  const days: ActivityCalendarDay[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Randomly generate activity patterns (80% activity rate with current streak)
    const isActive = Math.random() > 0.2;
    const activity = isActive
      ? (['quiz', 'flashcard', 'both'][Math.floor(Math.random() * 3)] as 'quiz' | 'flashcard' | 'both')
      : null;

    days.push({
      date: dateStr,
      completed: isActive,
      activity: activity,
    });
  }

  return days;
}

export const mockStreakData: StreakData = {
  currentStreak: 8,
  longestStreak: 45,
  totalDaysActive: 78,
  lastActivityDate: new Date().toISOString().split('T')[0],
  activityCalendar: generateActivityCalendar(),
};
