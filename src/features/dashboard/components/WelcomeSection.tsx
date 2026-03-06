import { ReactNode } from 'react';

import { Badge, Box, Group, Paper, SimpleGrid, Text, Title } from '@mantine/core';

interface WelcomeSectionProps {
  userName: string;
  currentStreak: number;
  averageAccuracy: number | string;
  isLoading: boolean;
  pathsCount: number;
  completedPaths: number;
  totalModulesCompleted: number;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName,
  currentStreak,
  averageAccuracy,
  isLoading,
  pathsCount,
  completedPaths,
  totalModulesCompleted,
}) => {
  return (
    <Box
      component="section"
      style={{
        background: 'linear-gradient(135deg, #2a2a2a 0%, #252525 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid #3a3a3a',
        overflow: 'hidden',
      }}
      p="xl"
    >
      <Box style={{ position: 'relative', zIndex: 1 }}>
        <Group justify="space-between" mb="lg" grow>
          <Box>
            <Title
              order={1}
              style={{
                background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              size="h2"
            >
              Welcome back, {userName?.split(' ')[0] || 'Learner'}! 👋
            </Title>
            <Text c="dimmed" mt="xs">
              Your learning journey continues today
            </Text>
          </Box>

          <Group gap="sm">
            <Badge
              size="md"
              variant="light"
              p="sm"
              style={{
                background: '#3a3a3a',
                color: '#ff9d54',
              }}
              leftSection="🔥"
            >
              {currentStreak} day streak
            </Badge>

            {isLoading ? (
              <Box
                style={{
                  width: '100px',
                  height: '32px',
                  background: '#3a3a3a',
                  borderRadius: '8px',
                  animation: 'pulse 2s infinite',
                }}
              />
            ) : (
              <Badge
                size="md"
                variant="light"
                p="sm"
                style={{
                  background: '#3a3a3a',
                  color: '#ff9d54',
                }}
              >
                Avg Quiz: {averageAccuracy}%
              </Badge>
            )}
          </Group>
        </Group>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          <Paper
            p="md"
            style={{
              background: '#2a2a2a',
              border: '1px solid #3a3a3a',
              borderRadius: '12px',
            }}
          >
            <Text c="dimmed" size="sm">
              Paths Progress
            </Text>
            <Title order={2} size="h4" mt="xs">
              {pathsCount}
            </Title>
          </Paper>

          <Paper
            p="md"
            style={{
              background: '#2a2a2a',
              border: '1px solid #3a3a3a',
              borderRadius: '12px',
            }}
          >
            <Text c="dimmed" size="sm">
              Paths Completed
            </Text>
            <Title order={2} size="h4" mt="xs">
              {completedPaths}
            </Title>
          </Paper>

          <Paper
            p="md"
            style={{
              background: '#2a2a2a',
              border: '1px solid #3a3a3a',
              borderRadius: '12px',
            }}
          >
            <Text c="dimmed" size="sm">
              Modules Completed
            </Text>
            <Title order={2} size="h4" mt="xs">
              {totalModulesCompleted}
            </Title>
          </Paper>

          <Paper
            p="md"
            style={{
              background: '#2a2a2a',
              border: '1px solid #3a3a3a',
              borderRadius: '12px',
            }}
          >
            <Text c="dimmed" size="sm">
              Success Rate
            </Text>
            <Title order={2} size="h4" mt="xs">
              {averageAccuracy}%
            </Title>
          </Paper>
        </SimpleGrid>
      </Box>
    </Box>
  );
};
