import React from 'react';
import { useMantineColorScheme, useMantineTheme } from '@mantine/core';
import {
  IconBook,
  IconCheck,
  IconHelp,
  IconCards,
  IconConfetti,
  IconDoorExit,
  IconMedal,
} from '@tabler/icons-react';
import type { ActivityLog } from '../types';

interface ActivityFeedProps {
  activities: ActivityLog[] | null;
  loading?: boolean;
  className?: string;
  limit?: number;
}

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ size: number }>> = {
  module_complete: IconBook,
  quiz_pass: IconCheck,
  quiz_attempt: IconHelp,
  flashcard_read: IconCards,
  flashcard_set_complete: IconConfetti,
  daily_login: IconDoorExit,
  assessment_complete: IconMedal,
};

const ACTIVITY_LABELS: Record<string, string> = {
  module_complete: 'Completed Module',
  quiz_pass: 'Passed Quiz',
  quiz_attempt: 'Attempted Quiz',
  flashcard_read: 'Viewed Flashcard',
  flashcard_set_complete: 'Completed Flashcard Set',
  daily_login: 'Daily Login',
  assessment_complete: 'Completed Assessment',
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading = false,
  className = '',
  limit = 10,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const emptyMessageColor = colorScheme === 'dark'
    ? theme.colors.gray[4]
    : theme.colors.gray[5];

  if (loading) {
    return (
      <div className={`activity-feed loading ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="activity-skeleton">
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-content">
              <div className="skeleton skeleton-text" style={{ width: '60%' }} />
              <div className="skeleton skeleton-text" style={{ width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const displayActivities = activities?.slice(0, limit) || [];

  if (!activities || activities.length === 0) {
    return (
      <div className={`activity-feed empty ${className}`} style={{ padding: '2rem 1rem' }}>
        <p className="empty-message" style={{ color: emptyMessageColor }}>No activities yet. Start learning to earn points!</p>
      </div>
    );
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Just now';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const activityBgColor = colorScheme === 'dark'
    ? theme.colors.dark[7]
    : 'white';

  const activityBorderColor = colorScheme === 'dark'
    ? theme.colors.dark[5]
    : theme.colors.gray[2];

  const activityTitleColor = colorScheme === 'dark'
    ? theme.colors.gray[0]
    : theme.colors.dark[7];

  const activityTimeColor = colorScheme === 'dark'
    ? theme.colors.gray[4]
    : theme.colors.gray[5];

  return (
    <div className={`activity-feed ${className}`}>
      <div className="feed-header">
        <h3 className="feed-title" style={{ color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[7] }}>Recent Activities</h3>
        {activities && activities.length > limit && (
          <p className="feed-subtitle" style={{ color: colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[5] }}>Showing {limit} of {activities.length}</p>
        )}
      </div>

      <div className="activities-list">
        {displayActivities.map((activity) => {
          const IconComponent = ACTIVITY_ICONS[activity.activity_type];
          return (
          <div 
            key={activity.id} 
            className="activity-item"
            style={{
              backgroundColor: activityBgColor,
              borderBottomColor: activityBorderColor,
            }}
          >
            <div className="activity-icon" style={{ color: theme.colors[theme.primaryColor][6] }}>
              {IconComponent ? <IconComponent size={24} /> : <IconMedal size={24} />}
            </div>

            <div className="activity-content">
              <p className="activity-title" style={{ color: activityTitleColor }}>
                {ACTIVITY_LABELS[activity.activity_type] || activity.activity_type}
              </p>
              <p className="activity-time" style={{ color: activityTimeColor }}>
                {formatDate(activity.created_at)}
              </p>
            </div>

            <div className="activity-points">
              <span className="points-badge">
                +{activity.points_earned || 0} pts
              </span>
            </div>
          </div>
        );
        })}
      </div>

      {activities && activities.length > limit && (
        <div className="feed-footer" style={{ 
          backgroundColor: activityBgColor,
          borderTopColor: activityBorderColor,
        }}>
          <button 
            className="view-all-btn"
            style={{
              backgroundColor: theme.colors[theme.primaryColor][6],
              color: 'white',
            }}
          >
            View All Activities
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
