// Mock Streak Service
import { mockStreakData } from '../data/streak';
import type { ActivityCalendarDay, StreakData } from '../data/streak';
import { delay } from '../utils';

export class StreakService {
  /**
   * Get streak data
   */
  async getStreakData(): Promise<StreakData> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockStreakData));
  }

  /**
   * Get current streak
   */
  async getCurrentStreak(): Promise<number> {
    await delay(200);
    return mockStreakData.currentStreak;
  }

  /**
   * Get longest streak
   */
  async getLongestStreak(): Promise<number> {
    await delay(200);
    return mockStreakData.longestStreak;
  }

  /**
   * Get total days active
   */
  async getTotalDaysActive(): Promise<number> {
    await delay(200);
    return mockStreakData.totalDaysActive;
  }

  /**
   * Get activity calendar
   */
  async getActivityCalendar(): Promise<ActivityCalendarDay[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockStreakData.activityCalendar));
  }

  /**
   * Get activity for specific date
   */
  async getActivityForDate(date: string): Promise<ActivityCalendarDay | null> {
    await delay(200);
    return mockStreakData.activityCalendar.find((day) => day.date === date) || null;
  }

  /**
   * Log activity for today
   */
  async logActivityForToday(activity: 'quiz' | 'flashcard' | 'both'): Promise<ActivityCalendarDay> {
    await delay(400);
    const today = new Date().toISOString().split('T')[0];
    const existingDay = mockStreakData.activityCalendar.find((day) => day.date === today);

    if (existingDay) {
      existingDay.completed = true;
      existingDay.activity = activity;
    } else {
      mockStreakData.activityCalendar.push({
        date: today,
        completed: true,
        activity,
      });
    }

    mockStreakData.lastActivityDate = today;
    return {
      date: today,
      completed: true,
      activity,
    };
  }

  /**
   * Check if streak is still active
   */
  async isStreakActive(): Promise<boolean> {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const todayActivity = mockStreakData.activityCalendar.find((day) => day.date === today);
    const yesterdayActivity = mockStreakData.activityCalendar.find((day) => day.date === yesterday);

    return (todayActivity?.completed ?? false) || (yesterdayActivity?.completed ?? false);
  }
}

export const mockStreakService = new StreakService();
