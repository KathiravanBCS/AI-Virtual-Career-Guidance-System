import React, { useState } from 'react';
import { useMantineColorScheme, useMantineTheme, Box, Button, Group, Stack, Text, Badge, Card } from '@mantine/core';
import { IconFlame, IconTrendingUp, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import type { StreakInfo } from '../types';

interface StreakCalendarProps {
  streak: StreakInfo | null;
  loading?: boolean;
  className?: string;
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({
  streak,
  loading = false,
  className = '',
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Theme-aware colors
  const cardBgColor = colorScheme === 'dark'
    ? theme.colors.dark[6]
    : theme.colors.gray[0];

  const headerBgColor = colorScheme === 'dark'
    ? theme.colors.dark[7]
    : 'white';

  const textColor = colorScheme === 'dark'
    ? theme.colors.gray[0]
    : theme.colors.dark[7];

  const secondaryTextColor = colorScheme === 'dark'
    ? theme.colors.gray[4]
    : theme.colors.gray[6];

  const borderColor = colorScheme === 'dark'
    ? theme.colors.dark[5]
    : theme.colors.gray[2];

  const primaryColor = theme.colors[theme.primaryColor][6];

  const calendarBgColor = colorScheme === 'dark'
    ? theme.colors.dark[7]
    : theme.colors.gray[0];

  const calendarCellHoverColor = colorScheme === 'dark'
    ? `${theme.colors[theme.primaryColor][8]}40`
    : theme.colors[theme.primaryColor][0];

  if (loading) {
    return (
      <div className={`streak-calendar ${className}`}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: secondaryTextColor }}>Loading streak data...</p>
        </div>
      </div>
    );
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - 5 + i).toString());

  return (
    <Box
      style={{
        backgroundColor: cardBgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '2rem',
      }}
      className={`streak-calendar ${className}`}
    >
      {/* Outer Header - Full Width */}
      <Group justify="space-between" align="center" mb="2rem">
        <Box>
          <Text
            size="2rem"
            fw={700}
            style={{ color: primaryColor }}
          >
            Your Learning Streak
          </Text>
        </Box>
        <Badge
          size="xl"
          variant="light"
          color={theme.primaryColor}
          leftSection={<IconFlame size={20} />}
          p="lg"
          style={{
            backgroundColor: colorScheme === 'dark'
              ? `${theme.colors[theme.primaryColor][8]}30`
              : `${theme.colors[theme.primaryColor][0]}`,
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Keep it up!
        </Badge>
      </Group>

      {/* Card with content - Full Width */}
      <Card
        style={{
          backgroundColor: headerBgColor,
          border: `2px solid ${borderColor}`,
          borderRadius: '16px',
        }}
        p="2rem"
      >
        <Stack gap="2rem">
          {/* Title and Description */}
          <Box ta="center">
            <Text
              size="1.5rem"
              fw={700}
              style={{ color: primaryColor }}
            >
              Learning Streak
            </Text>
            <Text
              size="md"
              style={{ color: secondaryTextColor, marginTop: '0.5rem' }}
            >
              Track your daily learning progress
            </Text>
          </Box>

          {/* Streak Stats - Larger */}
          <Group grow>
            <Box
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
                border: `2px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <Group justify="center" gap={8} mb="1rem">
                <Box
                  style={{
                    backgroundColor: primaryColor,
                    padding: '0.75rem',
                    borderRadius: '8px',
                  }}
                >
                  <IconFlame size={24} color="white" />
                </Box>
                <Text
                  size="md"
                  fw={600}
                  style={{ color: secondaryTextColor }}
                >
                  Current Streak
                </Text>
              </Group>
              <Text
                size="2rem"
                fw={700}
                style={{ color: primaryColor }}
              >
                {streak?.current_streak || 0} Days
              </Text>
            </Box>

            <Box
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
                border: `2px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <Group justify="center" gap={8} mb="1rem">
                <Box
                  style={{
                    backgroundColor: primaryColor,
                    padding: '0.75rem',
                    borderRadius: '8px',
                  }}
                >
                  <IconTrendingUp size={24} color="white" />
                </Box>
                <Text
                  size="md"
                  fw={600}
                  style={{ color: secondaryTextColor }}
                >
                  Best Streak
                </Text>
              </Group>
              <Text
                size="2rem"
                fw={700}
                style={{ color: primaryColor }}
              >
                {streak?.longest_streak || 0} Days
              </Text>
            </Box>
          </Group>

          {/* Calendar */}
          <Box
            style={{
              backgroundColor: calendarBgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              padding: '2rem',
            }}
          >
            {/* Month and Year Navigation */}
            <Group justify="center" gap="lg" mb="1.5rem">
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    if (month === 0) {
                      setMonth(11);
                      setYear(year - 1);
                    } else {
                      setMonth(month - 1);
                    }
                  }}
                  p={0}
                  style={{
                    color: primaryColor,
                  }}
                >
                  <IconChevronLeft size={18} />
                </Button>

                <Text fw={700} size="lg" style={{ color: textColor, minWidth: '180px', textAlign: 'center' }}>
                  {monthNames[month]} {year}
                </Text>

                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    if (month === 11) {
                      setMonth(0);
                      setYear(year + 1);
                    } else {
                      setMonth(month + 1);
                    }
                  }}
                  p={0}
                  style={{
                    color: primaryColor,
                  }}
                >
                  <IconChevronRight size={18} />
                </Button>
              </Group>

            {/* Weekday Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '1rem' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text
                  key={day}
                  size="md"
                  fw={700}
                  ta="center"
                  style={{ color: secondaryTextColor, paddingBottom: '0.5rem' }}
                >
                  {day}
                </Text>
              ))}
            </div>

            {/* Calendar Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {Array.from({ length: 42 }).map((_, i) => {
                  const firstDay = new Date(year, month, 1).getDay();
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const dayNum = i - firstDay + 1;
                  const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
                  const isToday = isCurrentMonth && dayNum === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                  
                  return (
              <Box
                key={i}
                onClick={() => {
                  if (isCurrentMonth) {
                    setSelectedDate(new Date(year, month, dayNum));
                  }
                }}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isToday
                    ? primaryColor
                    : isCurrentMonth
                      ? colorScheme === 'dark'
                        ? theme.colors.dark[6]
                        : 'white'
                      : 'transparent',
                  color: isToday
                    ? 'white'
                    : isCurrentMonth
                      ? textColor
                      : secondaryTextColor,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '8px',
                  cursor: isCurrentMonth ? 'pointer' : 'default',
                  fontWeight: isCurrentMonth ? 600 : 400,
                  transition: 'all 200ms',
                  fontSize: '1.1rem',
                  minHeight: '50px',
                }}
                onMouseEnter={(e) => {
                  if (isCurrentMonth && !isToday) {
                    e.currentTarget.style.backgroundColor = calendarCellHoverColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (isCurrentMonth && !isToday) {
                    e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                      ? theme.colors.dark[6]
                      : 'white';
                  }
                }}
              >
                {isCurrentMonth ? dayNum : ''}
              </Box>
            );
          })}
            </div>

            {/* Legend */}
            <Group justify="center" gap="2rem" mt="1.5rem" pt="1.5rem" style={{ borderTop: `1px solid ${borderColor}` }}>
                <Group gap={6}>
                  <Box
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: primaryColor,
                      borderRadius: '2px',
                    }}
                  />
                  <Text size="xs" style={{ color: secondaryTextColor }}>
                    Today
                  </Text>
                </Group>
                <Group gap={6}>
                  <Box
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: borderColor,
                      borderRadius: '2px',
                    }}
                  />
                  <Text size="xs" style={{ color: secondaryTextColor }}>
                    No activity
                  </Text>
                </Group>
              </Group>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

export default StreakCalendar;
