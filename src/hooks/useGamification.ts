import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type {
  UserPoints,
  UserStats,
  StreakInfo,
  LeaderboardResponse,
  LeaderboardPeriod,
  ActivityLog,
  LogActivityRequest,
  LogActivityResponse,
  ActivityLogListResponse,
} from '@/features/gamification/types';

interface UseGamificationOptions {
  userId: number;
  enableAutoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseGamificationReturn {
  // Data
  points: UserPoints | null;
  stats: UserStats | null;
  streak: StreakInfo | null;
  leaderboard: LeaderboardResponse | null;
  activities: ActivityLog[];
  
  // Loading states
  loadingPoints: boolean;
  loadingStats: boolean;
  loadingStreak: boolean;
  loadingLeaderboard: boolean;
  loadingActivities: boolean;
  loggingActivity: boolean;
  
  // Errors
  error: string | null;
  
  // Methods
  fetchPoints: () => Promise<void>;
  fetchStats: (days?: number) => Promise<void>;
  fetchStreak: () => Promise<void>;
  fetchLeaderboard: (period: LeaderboardPeriod) => Promise<void>;
  fetchActivities: () => Promise<void>;
  logActivity: (activity: LogActivityRequest) => Promise<LogActivityResponse | null>;
  refreshAll: (days?: number) => Promise<void>;
}

export const useGamification = ({
  userId,
  enableAutoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}: UseGamificationOptions): UseGamificationReturn => {
  // Data states
  const [points, setPoints] = useState<UserPoints | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Loading states
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingStreak, setLoadingStreak] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loggingActivity, setLoggingActivity] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Fetch points - only if userId is valid
  const fetchPoints = async () => {
    if (!userId || userId <= 0) {
      console.log('[useGamification] Skipping fetchPoints - invalid userId:', userId);
      return;
    }
    try {
      setLoadingPoints(true);
      setError(null);
      const response = await api.gamification.points.get(userId);
      setPoints(response);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch points';
      setError(errorMsg);
      console.error('[useGamification] Error fetching points:', err);
    } finally {
      setLoadingPoints(false);
    }
  };

  // Fetch user stats - only if userId is valid
  const fetchStats = async (days?: number) => {
    if (!userId || userId <= 0) {
      console.log('[useGamification] Skipping fetchStats - invalid userId:', userId);
      return;
    }
    try {
      setLoadingStats(true);
      setError(null);
      const response = await api.gamification.userStats.get(userId, days);
      setStats(response);
      console.log('[useGamification] Stats fetched:', response);
      console.log('[useGamification] Stats structure:', {
        user_info: (response as any)?.user_info,
        total_points: (response as any)?.total_points || (response as any)?.user_info?.total_points,
        current_rank: (response as any)?.current_rank || (response as any)?.user_info?.current_rank,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch stats';
      setError(errorMsg);
      console.error('[useGamification] Error fetching stats:', err);
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch streak - only if userId is valid
  const fetchStreak = async () => {
    if (!userId || userId <= 0) {
      console.log('[useGamification] Skipping fetchStreak - invalid userId:', userId);
      return;
    }
    try {
      setLoadingStreak(true);
      setError(null);
      const response = await api.gamification.streak.get(userId);
      setStreak(response);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch streak';
      setError(errorMsg);
      console.error('[useGamification] Error fetching streak:', err);
    } finally {
      setLoadingStreak(false);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async (period: LeaderboardPeriod = 'all_time') => {
    try {
      setLoadingLeaderboard(true);
      setError(null);
      const response = await api.gamification.leaderboard.get(period);
      setLeaderboard(response);
      console.log('[useGamification] Leaderboard fetched:', response);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch leaderboard';
      setError(errorMsg);
      console.error('[useGamification] Error fetching leaderboard:', err);
      setLeaderboard(null);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  // Fetch activities - only if userId is valid
  const fetchActivities = async () => {
    if (!userId || userId <= 0) {
      console.log('[useGamification] Skipping fetchActivities - invalid userId:', userId);
      return;
    }
    try {
      setLoadingActivities(true);
      setError(null);
      const response = await api.gamification.activities.list(userId);
      console.log('[useGamification] Activities raw response:', response);
      // Handle both direct array response and response with data property
      const activitiesData = Array.isArray(response) ? response : response?.data || [];
      console.log('[useGamification] Activities processed:', activitiesData, 'Count:', activitiesData.length);
      setActivities(activitiesData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch activities';
      setError(errorMsg);
      console.error('[useGamification] Error fetching activities:', err);
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Log activity
  const logActivity = async (activity: LogActivityRequest): Promise<LogActivityResponse | null> => {
    try {
      setLoggingActivity(true);
      setError(null);
      const response = await api.gamification.activities.log(activity);
      
      // Refresh points and stats after logging activity
      await Promise.all([fetchPoints(), fetchStats()]);
      
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to log activity';
      setError(errorMsg);
      console.error('[useGamification] Error logging activity:', err);
      return null;
    } finally {
      setLoggingActivity(false);
    }
  };

  // Refresh all data
  const refreshAll = async (days?: number) => {
    try {
      await Promise.all([
        fetchPoints(),
        fetchStats(days),
        fetchStreak(),
        fetchActivities(),
        // fetchLeaderboard('all_time'), // Endpoint not available - 404
      ]);
    } catch (err) {
      console.error('[useGamification] Error refreshing all:', err);
    }
  };

  // Auto-refresh setup - only if userId is valid
  useEffect(() => {
    if (!enableAutoRefresh || !userId || userId <= 0) return;

    const interval = setInterval(() => {
      refreshAll();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, userId]);

  // Initial load - only if userId is valid
  useEffect(() => {
    console.log('[useGamification] Effect triggered with userId:', userId);
    if (userId && userId > 0) {
      console.log('[useGamification] Fetching data for userId:', userId);
      refreshAll();
    } else {
      console.log('[useGamification] Skipping fetch - invalid userId:', userId);
    }
  }, [userId]);

  return {
    points,
    stats,
    streak,
    leaderboard,
    activities,
    loadingPoints,
    loadingStats,
    loadingStreak,
    loadingLeaderboard,
    loadingActivities,
    loggingActivity,
    error,
    fetchPoints,
    fetchStats,
    fetchStreak,
    fetchLeaderboard,
    fetchActivities,
    logActivity,
    refreshAll,
  };
};

export default useGamification;
