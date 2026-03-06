import { Center, Container, Loader, SimpleGrid, Stack, Text, Title } from '@mantine/core';

import { useGetStreakData } from '../api/useStreak';
import { StreakCalendar, StreakStatCard } from '../components';
import { StreakStats } from '../types';

export const StreakPage: React.FC = () => {
  const { data, isLoading } = useGetStreakData();

  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  const streakData = data || {
    currentStreak: 0,
    longestStreak: 0,
    totalDaysActive: 0,
    lastActivityDate: new Date().toISOString(),
    streakHistory: [],
  };

  const stats: StreakStats[] = [
    {
      label: 'Current Streak',
      value: `${streakData.currentStreak} days`,
      icon: '🔥',
    },
    {
      label: 'Longest Streak',
      value: `${streakData.longestStreak} days`,
      icon: '⭐',
    },
    {
      label: 'Days Active',
      value: `${streakData.totalDaysActive} days`,
      icon: '📅',
    },
  ];

  return (
    <Container
      size="lg"
      style={{
        background: 'linear-gradient(135deg, #1c1b1b 0%, #252525 100%)',
        minHeight: '100vh',
        borderRadius: '16px',
      }}
      py="xl"
    >
      <Stack gap="lg">
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <Title
            order={1}
            style={{
              background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Your Learning Streak
          </Title>
          <Text c="dimmed" mt="xs">
            Keep your momentum going and maintain your streak
          </Text>
        </div>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          {stats.map((stat, idx) => (
            <StreakStatCard key={idx} stat={stat} />
          ))}
        </SimpleGrid>

        {/* Calendar */}
        <StreakCalendar history={streakData.streakHistory} />
      </Stack>
    </Container>
  );
};

export default StreakPage;
