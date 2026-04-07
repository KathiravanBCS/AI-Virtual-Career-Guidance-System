import React, { useMemo } from 'react';
import {
  Box,
  Text,
  Group,
  Stack,
  Badge,
  Avatar,
  Skeleton,
  ScrollArea,
  ThemeIcon,
  Divider,
  Button,
  useMantineColorScheme,
  useMantineTheme,
  Paper,
} from '@mantine/core';
import {
  IconBook,
  IconCircleCheck,
  IconHelp,
  IconCards,
  IconConfetti,
  IconLogin,
  IconMedal,
  IconActivity,
  IconChevronRight,
} from '@tabler/icons-react';
import type { ActivityLog } from '../types';

interface ActivityFeedProps {
  activities: ActivityLog[] | null;
  loading?: boolean;
  className?: string;
  limit?: number;
}

const ACTIVITY_CONFIG: Record<
  string,
  { icon: React.ComponentType<{ size?: number; stroke?: number }>; label: string; color: string }
> = {
  module_complete:       { icon: IconBook,          label: 'Completed Module',        color: 'blue'   },
  quiz_pass:             { icon: IconCircleCheck,   label: 'Passed Quiz',             color: 'green'  },
  quiz_attempt:          { icon: IconHelp,           label: 'Attempted Quiz',          color: 'yellow' },
  flashcard_read:        { icon: IconCards,          label: 'Viewed Flashcard',        color: 'cyan'   },
  flashcard_set_complete:{ icon: IconConfetti,       label: 'Completed Flashcard Set', color: 'violet' },
  daily_login:           { icon: IconLogin,          label: 'Daily Login',             color: 'teal'   },
  assessment_complete:   { icon: IconMedal,          label: 'Completed Assessment',    color: 'orange' },
};

function formatDate(dateString?: string): string {
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
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading = false,
  className = '',
  limit = 10,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const displayActivities = useMemo(
    () => activities?.slice(0, limit) ?? [],
    [activities, limit]
  );

  const cardBg    = dark ? theme.colors.dark[7]  : theme.white;
  const borderClr = dark ? theme.colors.dark[5]  : theme.colors.gray[2];
  const subText   = dark ? theme.colors.gray[5]  : theme.colors.gray[5];
  const titleClr  = dark ? theme.colors.gray[0]  : theme.colors.dark[7];

  if (loading) {
    return (
      <Stack gap={0} className={className}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Box
            key={i}
            p="md"
            style={{ borderBottom: `1px solid ${borderClr}` }}
          >
            <Group>
              <Skeleton circle height={40} />
              <Box flex={1}>
                <Skeleton height={12} width="55%" mb={8} radius="sm" />
                <Skeleton height={10} width="30%" radius="sm" />
              </Box>
              <Skeleton height={24} width={60} radius="xl" />
            </Group>
          </Box>
        ))}
      </Stack>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Box
        p="xl"
        ta="center"
        className={className}
        style={{
          background: dark
            ? `linear-gradient(135deg, ${theme.colors.dark[7]}, ${theme.colors.dark[6]})`
            : `linear-gradient(135deg, ${theme.colors.gray[0]}, ${theme.white})`,
          borderRadius: theme.radius.md,
        }}
      >
        <ThemeIcon size={56} radius="xl" variant="light" color={primary} mb="md">
          <IconActivity size={28} stroke={1.5} />
        </ThemeIcon>
        <Text fw={600} size="md" c={titleClr} mb={4}>No activities yet</Text>
        <Text size="sm" c={subText}>Start learning to earn points and see your progress here!</Text>
      </Box>
    );
  }

  return (
    <Paper
      radius="lg"
      withBorder
      className={className}
      style={{
        backgroundColor: cardBg,
        borderColor: borderClr,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        px="lg"
        py="md"
        style={{
          borderBottom: `1px solid ${borderClr}`,
          background: dark
            ? `linear-gradient(90deg, ${theme.colors[primary][9]}22, transparent)`
            : `linear-gradient(90deg, ${theme.colors[primary][0]}, transparent)`,
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size={32} radius="md" variant="light" color={primary}>
              <IconActivity size={16} stroke={2} />
            </ThemeIcon>
            <Text fw={700} size="md" c={titleClr}>Recent Activities</Text>
          </Group>
          {activities.length > limit && (
            <Badge variant="light" color={primary} size="sm">
              {limit} of {activities.length}
            </Badge>
          )}
        </Group>
      </Box>

      {/* Feed List */}
      <ScrollArea.Autosize mah={480}>
        <Stack gap={0}>
          {displayActivities.map((activity, idx) => {
            const cfg = ACTIVITY_CONFIG[activity.activity_type];
            const IconComp = cfg?.icon ?? IconMedal;
            const iconColor = cfg?.color ?? primary;
            const label = cfg?.label ?? activity.activity_type;

            return (
              <React.Fragment key={activity.id}>
                <Box
                  px="lg"
                  py="sm"
                  style={{
                    transition: 'background 150ms ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = dark
                      ? theme.colors.dark[6]
                      : theme.colors.gray[0];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                      <ThemeIcon
                        size={40}
                        radius="xl"
                        variant="light"
                        color={iconColor}
                        style={{ flexShrink: 0 }}
                      >
                        <IconComp size={20} stroke={1.8} />
                      </ThemeIcon>
                      <Box style={{ minWidth: 0 }}>
                        <Text size="sm" fw={600} c={titleClr} truncate>
                          {label}
                        </Text>
                        <Text size="xs" c={subText}>
                          {formatDate(activity.created_at)}
                        </Text>
                      </Box>
                    </Group>
                    <Badge
                      size="sm"
                      variant="light"
                      color={primary}
                      radius="xl"
                      style={{ flexShrink: 0 }}
                    >
                      +{activity.points_earned ?? 0} pts
                    </Badge>
                  </Group>
                </Box>
                {idx < displayActivities.length - 1 && (
                  <Divider
                    mx="lg"
                    style={{ borderColor: borderClr }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Stack>
      </ScrollArea.Autosize>

      {/* Footer */}
      {activities.length > limit && (
        <Box
          px="lg"
          py="sm"
          style={{ borderTop: `1px solid ${borderClr}` }}
        >
          <Button
            variant="light"
            color={primary}
            fullWidth
            rightSection={<IconChevronRight size={16} />}
            radius="md"
            size="sm"
          >
            View All Activities
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ActivityFeed;