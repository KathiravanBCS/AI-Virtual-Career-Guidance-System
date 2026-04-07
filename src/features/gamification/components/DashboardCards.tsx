import React from 'react';
import {
  Box,
  Text,
  Group,
  SimpleGrid,
  Skeleton,
  ThemeIcon,
  Paper,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
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

interface CardConfig {
  label: string;
  value: string | number;
  Icon: React.ComponentType<{ size?: number; stroke?: number }>;
  color: string;
  isLoading: boolean;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  stats,
  streak,
  loading = false,
  className = '',
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const cardBg     = dark ? theme.colors.dark[7] : theme.white;
  const borderClr  = dark ? theme.colors.dark[5] : theme.colors.gray[2];
  const labelClr   = dark ? theme.colors.gray[4] : theme.colors.gray[6];
  const valueClr   = dark ? theme.colors.gray[0] : theme.colors.dark[7];

  // Extract values
  const totalPoints  = (stats as any)?.user_info?.total_points ?? stats?.total_points ?? 0;
  const currentRank  = (stats as any)?.user_info?.rank ?? (stats as any)?.current_rank ?? null;

  const cards: CardConfig[] = [
    {
      label: 'Total Points',
      value: typeof totalPoints === 'number' ? totalPoints.toLocaleString() : totalPoints,
      Icon: IconStar,
      color: primary,
      isLoading: loading && !stats,
    },
    {
      label: 'Current Rank',
      value: currentRank ? `#${currentRank}` : 'Unranked',
      Icon: IconTrophy,
      color: 'yellow',
      isLoading: loading && !stats,
    },
    {
      label: 'Weekly Points',
      value: stats?.weekly_points?.toLocaleString() ?? 0,
      Icon: IconTrendingUp,
      color: 'teal',
      isLoading: loading && !stats,
    },
    {
      label: 'Monthly Points',
      value: stats?.monthly_points?.toLocaleString() ?? 0,
      Icon: IconChartBar,
      color: 'cyan',
      isLoading: loading && !stats,
    },
    {
      label: 'Current Streak',
      value: streak?.current_streak ?? 0,
      Icon: IconFlame,
      color: 'orange',
      isLoading: loading && !streak,
    },
    {
      label: 'Longest Streak',
      value: streak?.longest_streak ?? 0,
      Icon: IconRocket,
      color: 'violet',
      isLoading: loading && !streak,
    },
    {
      label: 'Yearly Points',
      value: stats?.yearly_points?.toLocaleString() ?? 0,
      Icon: IconTarget,
      color: 'blue',
      isLoading: loading && !stats,
    },
    {
      label: 'Total Badges',
      value: stats?.badge_count ?? 0,
      Icon: IconMedal,
      color: 'green',
      isLoading: loading && !stats,
    },
  ];

  return (
    <SimpleGrid
      cols={{ base: 2, sm: 2, md: 4 }}
      spacing="md"
      className={className}
    >
      {cards.map(({ label, value, Icon, color, isLoading }) => (
        <Paper
          key={label}
          radius="lg"
          withBorder
          p="lg"
          style={{
            backgroundColor: cardBg,
            borderColor: borderClr,
            transition: 'transform 150ms ease, box-shadow 150ms ease',
            cursor: 'default',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = dark
              ? `0 8px 24px rgba(0,0,0,0.4)`
              : `0 8px 24px rgba(0,0,0,0.08)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Group justify="space-between" align="flex-start" mb="md">
            <ThemeIcon
              size={44}
              radius="xl"
              variant="light"
              color={color}
            >
              <Icon size={22} stroke={1.8} />
            </ThemeIcon>
          </Group>

          {isLoading ? (
            <>
              <Skeleton height={28} width="70%" mb={8} radius="sm" />
              <Skeleton height={12} width="50%" radius="sm" />
            </>
          ) : (
            <>
              <Text
                size="xl"
                fw={800}
                c={valueClr}
                lh={1.1}
                mb={4}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {value}
              </Text>
              <Text size="xs" c={labelClr} fw={500} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                {label}
              </Text>
            </>
          )}
        </Paper>
      ))}
    </SimpleGrid>
  );
};

export default DashboardCards;