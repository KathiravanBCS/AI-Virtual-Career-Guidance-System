import React from 'react';
import {
  Box,
  Text,
  Group,
  Stack,
  Badge,
  Avatar,
  Skeleton,
  ThemeIcon,
  Paper,
  ScrollArea,
  Divider,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconFlame,
  IconTrophy,
  IconMedal,
  IconUsers,
} from '@tabler/icons-react';
import type { LeaderboardResponse } from '../types';

interface LeaderboardTableProps {
  leaderboard: LeaderboardResponse | null;
  loading?: boolean;
  className?: string;
}

function getRankBadge(rank: number) {
  if (rank === 1) return { color: 'yellow', icon: <IconTrophy size={14} stroke={2} /> };
  if (rank === 2) return { color: 'gray',   icon: <IconMedal  size={14} stroke={2} /> };
  if (rank === 3) return { color: 'orange', icon: <IconMedal  size={14} stroke={2} /> };
  return null;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  leaderboard,
  loading = false,
  className = '',
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const cardBg      = dark ? theme.colors.dark[7]  : theme.white;
  const borderClr   = dark ? theme.colors.dark[5]  : theme.colors.gray[2];
  const headerBg    = dark ? theme.colors.dark[6]  : theme.colors.gray[0];
  const subText     = dark ? theme.colors.gray[5]  : theme.colors.gray[5];
  const titleClr    = dark ? theme.colors.gray[0]  : theme.colors.dark[7];
  const rowHighlight= dark
    ? `${theme.colors[primary][9]}33`
    : `${theme.colors[primary][0]}`;

  if (loading) {
    return (
      <Paper radius="lg" withBorder p={0} className={className} style={{ backgroundColor: cardBg, borderColor: borderClr, overflow: 'hidden' }}>
        <Stack gap={0}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Box key={i} px="lg" py="md" style={{ borderBottom: `1px solid ${borderClr}` }}>
              <Group>
                <Skeleton height={12} width={28} radius="sm" />
                <Skeleton circle height={36} />
                <Box flex={1}>
                  <Skeleton height={12} width="45%" radius="sm" />
                </Box>
                <Skeleton height={12} width={60} radius="sm" />
                <Skeleton height={12} width={40} radius="sm" />
              </Group>
            </Box>
          ))}
        </Stack>
      </Paper>
    );
  }

  if (!leaderboard?.entries?.length) {
    return (
      <Box p="xl" ta="center" className={className}>
        <ThemeIcon size={56} radius="xl" variant="light" color={primary} mb="md">
          <IconUsers size={28} stroke={1.5} />
        </ThemeIcon>
        <Text fw={600} size="md" c={titleClr} mb={4}>No leaderboard data</Text>
        <Text size="sm" c={subText}>Rankings will appear once more users participate.</Text>
      </Box>
    );
  }

  return (
    <Paper
      radius="lg"
      withBorder
      className={className}
      style={{ backgroundColor: cardBg, borderColor: borderClr, overflow: 'hidden' }}
    >
      {/* Column Headers */}
      <Box
        px="lg"
        py="sm"
        style={{
          backgroundColor: headerBg,
          borderBottom: `1px solid ${borderClr}`,
        }}
      >
        <Group justify="space-between">
          <Group gap="xl">
            <Text size="xs" fw={700} c={subText} tt="uppercase" style={{ letterSpacing: '0.6px', width: 32 }}>
              Rank
            </Text>
            <Text size="xs" fw={700} c={subText} tt="uppercase" style={{ letterSpacing: '0.6px' }}>
              Player
            </Text>
          </Group>
          <Group gap="xl">
            <Text size="xs" fw={700} c={subText} tt="uppercase" style={{ letterSpacing: '0.6px', minWidth: 70, textAlign: 'right' }}>
              Points
            </Text>
            <Text size="xs" fw={700} c={subText} tt="uppercase" style={{ letterSpacing: '0.6px', minWidth: 50, textAlign: 'right' }}>
              Streak
            </Text>
          </Group>
        </Group>
      </Box>

      <ScrollArea.Autosize mah={440}>
        <Stack gap={0}>
          {leaderboard.entries.map((entry, idx) => {
            const rankBadge = getRankBadge(entry.rank);
            const isMe = entry.is_current_user;

            return (
              <React.Fragment key={entry.user_id}>
                <Box
                  px="lg"
                  py="sm"
                  style={{
                    backgroundColor: isMe ? rowHighlight : 'transparent',
                    transition: 'background 150ms ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isMe) e.currentTarget.style.background = dark ? theme.colors.dark[6] : theme.colors.gray[0];
                  }}
                  onMouseLeave={(e) => {
                    if (!isMe) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {isMe && (
                    <Box
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        backgroundColor: theme.colors[primary][6],
                        borderRadius: '0 2px 2px 0',
                      }}
                    />
                  )}
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                      {/* Rank */}
                      <Box style={{ width: 32, textAlign: 'center', flexShrink: 0 }}>
                        {rankBadge ? (
                          <ThemeIcon size={28} radius="xl" variant="light" color={rankBadge.color}>
                            {rankBadge.icon}
                          </ThemeIcon>
                        ) : (
                          <Text size="sm" fw={700} c={subText}>
                            #{entry.rank}
                          </Text>
                        )}
                      </Box>

                      {/* Player */}
                      <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                        <Avatar
                          src={entry.user_photo}
                          radius="xl"
                          size={36}
                          color={primary}
                          style={{ flexShrink: 0 }}
                        >
                          {(entry.user_name ?? '?').charAt(0).toUpperCase()}
                        </Avatar>
                        <Box style={{ minWidth: 0 }}>
                          <Group gap={6} align="center" wrap="nowrap">
                            <Text size="sm" fw={600} c={titleClr} truncate>
                              {entry.user_name}
                            </Text>
                            {isMe && (
                              <Badge size="xs" color={primary} variant="light" radius="xl">
                                You
                              </Badge>
                            )}
                          </Group>
                        </Box>
                      </Group>
                    </Group>

                    {/* Points & Streak */}
                    <Group gap="xl" wrap="nowrap" style={{ flexShrink: 0 }}>
                      <Text size="sm" fw={700} c={titleClr} style={{ minWidth: 70, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {entry.total_points?.toLocaleString() ?? 0}
                      </Text>
                      <Box style={{ minWidth: 50, textAlign: 'right' }}>
                        {entry.streak > 0 ? (
                          <Group gap={4} justify="flex-end" wrap="nowrap">
                            <IconFlame size={15} color={theme.colors.orange[5]} />
                            <Text size="sm" fw={600} c={titleClr}>{entry.streak}</Text>
                          </Group>
                        ) : (
                          <Text size="sm" c={subText}>—</Text>
                        )}
                      </Box>
                    </Group>
                  </Group>
                </Box>
                {idx < leaderboard.entries.length - 1 && (
                  <Divider mx="lg" style={{ borderColor: borderClr }} />
                )}
              </React.Fragment>
            );
          })}
        </Stack>
      </ScrollArea.Autosize>

      {/* Footer */}
      <Box
        px="lg"
        py="sm"
        style={{
          borderTop: `1px solid ${borderClr}`,
          backgroundColor: headerBg,
        }}
      >
        <Group gap="xs">
          <ThemeIcon size={18} radius="xl" variant="transparent" color={subText}>
            <IconUsers size={12} />
          </ThemeIcon>
          <Text size="xs" c={subText}>
            {leaderboard.total_users} total users
            {leaderboard.current_user_rank ? ` · Your rank: #${leaderboard.current_user_rank}` : ''}
          </Text>
        </Group>
      </Box>
    </Paper>
  );
};

export default LeaderboardTable;