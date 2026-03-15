import React, { useState } from 'react';
import { useMantineColorScheme, useMantineTheme } from '@mantine/core';
import useGamification from '@/hooks/useGamification';
import PointsBadge from '../components/PointsBadge';
import DashboardCards from '../components/DashboardCards';
import StreakCalendar from '../components/StreakCalendar';
import LeaderboardTable from '../components/LeaderboardTable';
import ActivityFeed from '../components/ActivityFeed';
import PointsGraph from '../components/PointsGraph';
import type { LeaderboardPeriod } from '../types';
import { useLoggedInUser } from '@/lib/auth/useLoggedInUser';

interface GamificationDashboardProps {
  userId?: number;
  className?: string;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  userId: propUserId,
  className = '',
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const { user: loggedInUser, isLoading: userLoading } = useLoggedInUser();
  const userId = propUserId || loggedInUser?.id;
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>('all_time');

  // Only call useGamification if we have a valid userId
  const {
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
    error,
    fetchLeaderboard,
    logActivity,
  } = useGamification({
    userId: userId || 0,
    enableAutoRefresh: userId ? true : false, // Only enable if we have a userId
    refreshInterval: 60000, // 1 minute
  });

  // Handle leaderboard period change
  const handlePeriodChange = async (period: LeaderboardPeriod) => {
    setLeaderboardPeriod(period);
    await fetchLeaderboard(period);
  };

  const isLoading = loadingPoints || loadingStats || loadingStreak || userLoading;

  // Theme-aware colors
  const sectionBgColor = colorScheme === 'dark' 
    ? theme.colors.dark[6]
    : theme.colors.gray[0];
  
  const sectionBorderColor = colorScheme === 'dark'
    ? theme.colors.dark[5]
    : theme.colors.gray[2];

  // Show loading state while user is being fetched
  if (userLoading) {
    return (
      <div className={`gamification-dashboard ${className}`}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show error if user couldn't be loaded and no prop userId provided
  if (!userId) {
    return (
      <div className={`gamification-dashboard ${className}`}>
        <div className="error-banner">
          <p className="error-message">Unable to load user data. Please ensure you are logged in.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`gamification-dashboard ${className}`}
      style={{
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : '#fafbfc',
        padding: '1.5rem',
        borderRadius: '8px',
        minHeight: '100vh',
      }}
    >
      {error && (
        <div className="error-banner">
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* Header Section */}
      <div className="dashboard-header">
        <h1 
          className="dashboard-title"
          style={{
            color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[7],
          }}
        >
          Gamification
        </h1>
        <PointsBadge points={points} loading={loadingPoints} />
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Stats Cards Section */}
        <section style={{ backgroundColor: sectionBgColor, borderRadius: '8px', padding: '1.5rem' }}>
          <h2 
            className="section-title"
            style={{
              color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[7],
            }}
          >
            Your Stats
          </h2>
          <DashboardCards
            stats={stats}
            streak={streak}
            loading={isLoading}
          />
        </section>

        {/* Streak Calendar Section */}
        <StreakCalendar
          streak={streak}
          loading={loadingStreak}
        />

        {/* Points Graph Section */}
        <section style={{ backgroundColor: sectionBgColor, borderRadius: '8px', padding: '1.5rem' }}>
          <h2 
            className="section-title"
            style={{
              color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[7],
            }}
          >
            Points Progress
          </h2>
          <PointsGraph
            history={null}
            loading={loadingStats}
          />
        </section>

        {/* Leaderboard Section - Hidden if not available */}
        {/* Leaderboard endpoint returns 404, will be enabled when backend implements it */}
        {leaderboard && (
          <section style={{ backgroundColor: sectionBgColor, borderRadius: '8px', overflow: 'hidden' }}>
            <div className="section-header" style={{ backgroundColor: sectionBgColor, borderBottomColor: sectionBorderColor }}>
              <h2 
                className="section-title"
                style={{
                  color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[7],
                }}
              >
                Leaderboard
              </h2>
              
              <div className="period-tabs">
                {(['all_time', 'yearly', 'monthly', 'weekly'] as LeaderboardPeriod[]).map(
                  (period) => (
                    <button
                      key={period}
                      className={`period-tab ${leaderboardPeriod === period ? 'active' : ''}`}
                      onClick={() => handlePeriodChange(period)}
                      style={{
                        backgroundColor: leaderboardPeriod === period ? theme.colors[theme.primaryColor][6] : sectionBgColor,
                        borderColor: leaderboardPeriod === period ? theme.colors[theme.primaryColor][6] : sectionBorderColor,
                        color: leaderboardPeriod === period ? 'white' : colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7],
                      }}
                    >
                      {period === 'all_time' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            <LeaderboardTable
              leaderboard={leaderboard}
              loading={loadingLeaderboard}
            />
          </section>
        )}

        {/* Activity Feed Section */}
        <section style={{ backgroundColor: sectionBgColor, borderRadius: '8px', overflow: 'hidden' }}>
          <ActivityFeed
            activities={activities}
            loading={loadingActivities}
            limit={10}
          />
        </section>
      </div>
    </div>
  );
};

export default GamificationDashboard;
