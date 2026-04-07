import React from 'react';
import {
  Box,
  Text,
  Group,
  Badge,
  Skeleton,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconFlame, IconStar } from '@tabler/icons-react';
import type { UserPoints } from '../types';

interface PointsBadgeProps {
  points: UserPoints | null;
  loading?: boolean;
  compact?: boolean;
}

const PointsBadge: React.FC<PointsBadgeProps> = ({
  points,
  loading = false,
  compact = false,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const bg      = dark ? theme.colors.dark[7]  : theme.white;
  const border  = dark ? theme.colors.dark[5]  : theme.colors.gray[2];
  const subText = dark ? theme.colors.gray[4]  : theme.colors.gray[5];
  const valClr  = dark ? theme.colors.gray[0]  : theme.colors.dark[7];

  if (loading) {
    return (
      <Group gap="sm">
        <Skeleton height={compact ? 28 : 40} width={compact ? 80 : 120} radius="xl" />
        <Skeleton height={compact ? 28 : 40} width={60} radius="xl" />
      </Group>
    );
  }

  if (!points) return null;

  if (compact) {
    return (
      <Group gap={6}>
        <Badge
          size="lg"
          variant="light"
          color={primary}
          leftSection={<IconStar size={14} stroke={2} />}
          radius="xl"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {points.total_points?.toLocaleString() ?? 0}
        </Badge>
        {points.current_streak > 0 && (
          <Badge
            size="lg"
            variant="light"
            color="orange"
            leftSection={<IconFlame size={14} stroke={2} />}
            radius="xl"
          >
            {points.current_streak}
          </Badge>
        )}
      </Group>
    );
  }

  return (
    <Group gap="md">
      {/* Points pill */}
      <Box
        px="lg"
        py="sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm,
          backgroundColor: bg,
          border: `1.5px solid ${border}`,
          borderRadius: theme.radius.xl,
          boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <ThemeIcon size={32} radius="xl" variant="light" color={primary}>
          <IconStar size={16} stroke={2} />
        </ThemeIcon>
        <Box>
          <Text size="lg" fw={800} c={valClr} lh={1} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {points.total_points?.toLocaleString() ?? 0}
          </Text>
          <Text size="xs" c={subText} fw={500} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
            Points
          </Text>
        </Box>
      </Box>

      {/* Streak pill */}
      {points.current_streak > 0 && (
        <Box
          px="lg"
          py="sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            backgroundColor: bg,
            border: `1.5px solid ${border}`,
            borderRadius: theme.radius.xl,
            boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <ThemeIcon size={32} radius="xl" variant="light" color="orange">
            <IconFlame size={16} stroke={2} />
          </ThemeIcon>
          <Box>
            <Text size="lg" fw={800} c={valClr} lh={1}>
              {points.current_streak}
            </Text>
            <Text size="xs" c={subText} fw={500} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
              Streak
            </Text>
          </Box>
        </Box>
      )}
    </Group>
  );
};

export default PointsBadge;