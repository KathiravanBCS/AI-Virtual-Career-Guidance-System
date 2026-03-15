import React from 'react';
import { useMantineColorScheme, useMantineTheme } from '@mantine/core';
import {
  IconStar,
  IconTrophy,
  IconTrendingUp,
  IconChartBar,
  IconFlame,
  IconRocket,
  IconTarget,
  IconMedal,
} from '@tabler/icons-react';
import type { UserStats, StreakInfo } from '../types';

interface DashboardCardsProps {
  stats: UserStats | null;
  streak: StreakInfo | null;
  loading?: boolean;
  className?: string;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  stats,
  streak,
  loading = false,
  className = '',
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const cardBgColor = colorScheme === 'dark'
    ? theme.colors.dark[7]
    : 'white';

  const cardBorderColor = colorScheme === 'dark'
    ? theme.colors.dark[5]
    : theme.colors.gray[2];

  const cardIconColor = theme.colors[theme.primaryColor][6];

  const cardLabelColor = colorScheme === 'dark'
    ? theme.colors.gray[4]
    : theme.colors.gray[5];

  const cardValueColor = colorScheme === 'dark'
    ? theme.colors.gray[0]
    : theme.colors.dark[7];

  const renderCard = (
    title: string,
    value: string | number,
    Icon?: React.ComponentType<{ size: number; className?: string; style?: React.CSSProperties }>,
    isLoading = false
  ) => (
    <div 
      className="dashboard-card"
      style={{
        backgroundColor: cardBgColor,
        borderColor: cardBorderColor,
      }}
    >
      {Icon && <Icon size={32} className="card-icon" style={{ color: cardIconColor }} />}
      <div className="card-content">
        <p className="card-label" style={{ color: cardLabelColor }}>{title}</p>
        {isLoading ? (
          <div className="skeleton skeleton-text" style={{ width: '80px' }} />
        ) : (
          <p className="card-value" style={{ color: cardValueColor }}>{value}</p>
        )}
      </div>
    </div>
  );

  // Extract values from nested structures in the stats response
  const totalPoints = (stats as any)?.user_info?.total_points || stats?.total_points || 0;
  const currentRank = (stats as any)?.user_info?.rank || (stats as any)?.current_rank || null;

  return (
    <div className={`dashboard-cards ${className}`}>
      {renderCard(
        'Total Points',
        typeof totalPoints === 'number' ? totalPoints.toLocaleString() : totalPoints,
        IconStar,
        loading && !stats
      )}

      {renderCard(
        'Current Rank',
        currentRank ? `#${currentRank}` : 'Unranked',
        IconTrophy,
        loading && !stats
      )}

      {renderCard(
        'Weekly Points',
        stats?.weekly_points?.toLocaleString() || 0,
        IconTrendingUp,
        loading && !stats
      )}

      {renderCard(
        'Monthly Points',
        stats?.monthly_points?.toLocaleString() || 0,
        IconChartBar,
        loading && !stats
      )}

      {renderCard(
        'Current Streak',
        streak?.current_streak || 0,
        IconFlame,
        loading && !streak
      )}

      {renderCard(
        'Longest Streak',
        streak?.longest_streak || 0,
        IconRocket,
        loading && !streak
      )}

      {renderCard(
        'Yearly Points',
        stats?.yearly_points?.toLocaleString() || 0,
        IconTarget,
        loading && !stats
      )}

      {renderCard(
        'Total Badges',
        stats?.badge_count || 0,
        IconMedal,
        loading && !stats
      )}
    </div>
  );
};

export default DashboardCards;
