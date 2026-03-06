import { Center, Container, Group, Loader, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';

import { useGetLeaderboardData } from '../api/useLeaderboard';
import { LeaderboardTable } from '../components';

export const LeaderboardPage: React.FC = () => {
  const { data, isLoading } = useGetLeaderboardData();

  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  const leaderboardData = data || {
    topUsers: [],
    currentUserRank: 0,
    currentUserPoints: 0,
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <Title order={1}>Global Leaderboard</Title>
          <Text c="dimmed" mt="xs">
            Compete with learners worldwide
          </Text>
        </div>

        {/* Your Stats */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Paper p="lg" radius="lg" withBorder>
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="sm">
                  Your Rank
                </Text>
                <Title order={2}>#{leaderboardData.currentUserRank}</Title>
              </div>
              <div style={{ fontSize: '48px' }}>🏆</div>
            </Group>
          </Paper>

          <Paper p="lg" radius="lg" withBorder>
            <Group justify="space-between">
              <div>
                <Text c="dimmed" size="sm">
                  Your Points
                </Text>
                <Title order={2}>{leaderboardData.currentUserPoints} pts</Title>
              </div>
              <div style={{ fontSize: '48px' }}>⭐</div>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Leaderboard */}
        <LeaderboardTable users={leaderboardData.topUsers} currentUserRank={leaderboardData.currentUserRank} />
      </Stack>
    </Container>
  );
};

export default LeaderboardPage;
