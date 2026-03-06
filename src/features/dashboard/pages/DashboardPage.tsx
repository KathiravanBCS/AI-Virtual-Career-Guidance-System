import { Alert, Center, Container, Grid, Loader, Stack } from '@mantine/core';

import { useGetDashboardData } from '../api/useGetDashboardData';
import { LearningPathsSection, QuickActionsGrid, RecentActivitySection, WelcomeSection } from '../components';
import { QuickAction } from '../types';

const quickActions: QuickAction[] = [
  {
    icon: '📚',
    label: 'New Path',
    description: 'Start a learning journey',
    path: '/learning-path',
    gradient: 'linear-gradient(to right, #ff9d54, #ff8a30)',
  },
  {
    icon: '🗂️',
    label: 'Flashcards',
    description: 'Create study cards',
    path: '/flashcards',
    gradient: 'linear-gradient(to right, #ff9d54, #ff8a30)',
  },
  {
    icon: '📝',
    label: 'Quiz',
    description: 'Test your knowledge',
    path: '/quiz',
    gradient: 'linear-gradient(to right, #ff9d54, #ff8a30)',
  },
  {
    icon: '📈',
    label: 'Progress',
    description: 'Track your growth',
    path: '/progress',
    gradient: 'linear-gradient(to right, #ff9d54, #ff8a30)',
  },
];

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useGetDashboardData();

  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="lg">
        <Alert title="Error" color="red" mt="xl">
          Failed to load dashboard data. Please try again later.
        </Alert>
      </Container>
    );
  }

  const dashboardData = data || {
    paths: [],
    flashcardCount: 0,
    quizScores: [],
    userStats: { completedPaths: 0, totalModulesCompleted: 0, avgQuizScore: 0 },
    recentActivity: [],
    averageAccuracy: 0,
  };

  return (
    <Container
      size="xl"
      style={{
        background: 'linear-gradient(135deg, #1c1b1b 0%, #252525 100%)',
        minHeight: '100vh',
        borderRadius: '16px',
      }}
      py="xl"
    >
      <Stack gap="lg">
        {/* Welcome Section */}
        <WelcomeSection
          userName="Learner"
          currentStreak={23}
          averageAccuracy={dashboardData.averageAccuracy}
          isLoading={isLoading}
          pathsCount={dashboardData.paths.length}
          completedPaths={dashboardData.userStats.completedPaths}
          totalModulesCompleted={dashboardData.userStats.totalModulesCompleted}
        />

        {/* Quick Actions */}
        <QuickActionsGrid actions={quickActions} />

        {/* Main Content Grid */}
        <Grid>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <LearningPathsSection paths={dashboardData.paths} loading={isLoading} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <RecentActivitySection activities={dashboardData.recentActivity} loading={isLoading} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default DashboardPage;
