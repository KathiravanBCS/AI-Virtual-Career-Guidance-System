import React, { useState, useMemo } from 'react';
import {
  Box,
  Text,
  Group,
  Stack,
  Badge,
  Button,
  Paper,
  SimpleGrid,
  ThemeIcon,
  Divider,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconFlame,
  IconTrendingUp,
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
} from '@tabler/icons-react';
import type { StreakInfo } from '../types';

interface StreakCalendarProps {
  streak: StreakInfo | null;
  loading?: boolean;
  className?: string;
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const StreakCalendar: React.FC<StreakCalendarProps> = ({
  streak,
  loading = false,
  className = '',
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(today.getMonth());
  const [year,  setYear]  = useState(today.getFullYear());

  const cardBg    = dark ? theme.colors.dark[7] : theme.white;
  const outerBg   = dark ? theme.colors.dark[6] : theme.colors.gray[0];
  const border    = dark ? theme.colors.dark[5] : theme.colors.gray[2];
  const subText   = dark ? theme.colors.gray[4] : theme.colors.gray[6];
  const titleClr  = dark ? theme.colors.gray[0] : theme.colors.dark[7];
  const cellBg    = dark ? theme.colors.dark[5] : theme.white;
  const p6        = theme.colors[primary][6];
  const hoverBg   = dark ? theme.colors[primary][9] : theme.colors[primary][0];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const calendarCells = useMemo(() => {
    const firstDay   = new Date(year, month, 1).getDay();
    const daysInMo   = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: 42 }, (_, i) => {
      const dayNum       = i - firstDay + 1;
      const inMonth      = dayNum > 0 && dayNum <= daysInMo;
      const isToday      = inMonth
        && dayNum === today.getDate()
        && month  === today.getMonth()
        && year   === today.getFullYear();
      return { dayNum, inMonth, isToday };
    });
  }, [month, year, today]);

  if (loading) {
    return (
      <Box className={className} p="xl" ta="center">
        <Text c={subText}>Loading streak data…</Text>
      </Box>
    );
  }

  return (
    <Box
      className={className}
      style={{
        backgroundColor: outerBg,
        border: `1.5px solid ${border}`,
        borderRadius: theme.radius.xl,
        padding: theme.spacing.xl,
      }}
    >
      {/* Outer header */}
      <Group justify="space-between" align="center" mb="xl">
        <Group gap="sm">
          <ThemeIcon size={36} radius="xl" variant="light" color={primary}>
            <IconCalendar size={18} stroke={2} />
          </ThemeIcon>
          <Text fw={800} size="xl" c={titleClr}>Your Learning Streak</Text>
        </Group>
        <Badge
          size="lg"
          variant="light"
          color={primary}
          leftSection={<IconFlame size={16} />}
          radius="xl"
        >
          Keep it up!
        </Badge>
      </Group>

      <Paper
        radius="xl"
        withBorder
        p="xl"
        style={{ backgroundColor: cardBg, borderColor: border }}
      >
        <Stack gap="xl">
          {/* Stat cards */}
          <SimpleGrid cols={2} spacing="md">
            {[
              { label: 'Current Streak', value: streak?.current_streak ?? 0,  Icon: IconFlame,      color: 'orange' },
              { label: 'Best Streak',    value: streak?.longest_streak ?? 0,  Icon: IconTrendingUp, color: primary  },
            ].map(({ label, value, Icon, color }) => (
              <Paper
                key={label}
                radius="lg"
                withBorder
                p="lg"
                ta="center"
                style={{
                  backgroundColor: outerBg,
                  borderColor: border,
                }}
              >
                <Group justify="center" gap="sm" mb="sm">
                  <ThemeIcon size={40} radius="xl" variant="filled" color={color}>
                    <Icon size={20} stroke={2} />
                  </ThemeIcon>
                  <Text size="sm" fw={600} c={subText}>{label}</Text>
                </Group>
                <Text size="2rem" fw={900} c={p6} lh={1}>
                  {value}
                  <Text component="span" size="md" fw={500} c={subText}> days</Text>
                </Text>
              </Paper>
            ))}
          </SimpleGrid>

          <Divider style={{ borderColor: border }} />

          {/* Calendar */}
          <Box>
            {/* Month nav */}
            <Group justify="center" align="center" gap="lg" mb="md">
              <Button
                variant="subtle"
                color={primary}
                size="compact-sm"
                radius="xl"
                onClick={prevMonth}
                leftSection={<IconChevronLeft size={16} />}
              />
              <Text fw={700} size="lg" c={titleClr} style={{ minWidth: 160, textAlign: 'center' }}>
                {MONTH_NAMES[month]} {year}
              </Text>
              <Button
                variant="subtle"
                color={primary}
                size="compact-sm"
                radius="xl"
                onClick={nextMonth}
                leftSection={<IconChevronRight size={16} />}
              />
            </Group>

            {/* Day headers */}
            <SimpleGrid cols={7} spacing={6} mb={6}>
              {DAY_LABELS.map((d) => (
                <Text key={d} size="xs" fw={700} ta="center" c={subText} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                  {d}
                </Text>
              ))}
            </SimpleGrid>

            {/* Day cells */}
            <SimpleGrid cols={7} spacing={6}>
              {calendarCells.map(({ dayNum, inMonth, isToday }, i) => (
                <Box
                  key={i}
                  style={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: theme.radius.md,
                    backgroundColor: isToday
                      ? p6
                      : inMonth
                        ? cellBg
                        : 'transparent',
                    color: isToday
                      ? 'white'
                      : inMonth
                        ? titleClr
                        : 'transparent',
                    border: inMonth && !isToday ? `1px solid ${border}` : 'none',
                    fontWeight: inMonth ? 600 : 400,
                    fontSize: '0.88rem',
                    cursor: inMonth ? 'pointer' : 'default',
                    transition: 'background 130ms ease',
                    minHeight: 40,
                  }}
                  onMouseEnter={(e) => {
                    if (inMonth && !isToday)
                      e.currentTarget.style.backgroundColor = hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (inMonth && !isToday)
                      e.currentTarget.style.backgroundColor = cellBg;
                  }}
                >
                  {inMonth ? dayNum : ''}
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Legend */}
          <Group justify="center" gap="xl" pt="md" style={{ borderTop: `1px solid ${border}` }}>
            {[
              { color: p6,    label: 'Today'       },
              { color: cellBg, label: 'No activity', bordered: true },
              { color: hoverBg, label: 'Hover'      },
            ].map(({ color, label, bordered }) => (
              <Group key={label} gap={6}>
                <Box
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    backgroundColor: color,
                    border: bordered ? `1px solid ${border}` : 'none',
                  }}
                />
                <Text size="xs" c={subText}>{label}</Text>
              </Group>
            ))}
          </Group>
        </Stack>
      </Paper>
    </Box>
  );
};

export default StreakCalendar;