import { Center, Container, Loader, Stack, Title } from '@mantine/core';

import { useGetProgressData } from '../api/useProgress';
import { FlashcardStats, ProgressChart } from '../components';

export const ProgressPage: React.FC = () => {
  const { data, isLoading, error } = useGetProgressData();

  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <p style={{ color: '#ff6b6b' }}>Failed to load progress data</p>
      </Center>
    );
  }

  const progressData = data || {
    paths: [],
    quizScores: [],
    flashcardCount: 0,
  };

  // Transform data for charts
  const chartData = progressData.paths.map((path) => ({
    topic: path.topicName,
    progress: path.progress,
  }));

  const quizChartData = progressData.quizScores.map((quiz) => ({
    topic: quiz.topic,
    accuracy: parseFloat(quiz.accuracy as string),
  }));

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
        <Title
          order={1}
          style={{
            background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          Learning & Quiz Progress
        </Title>

        <FlashcardStats count={progressData.flashcardCount} />

        {chartData.length > 0 && (
          <ProgressChart title="Learning Path Progress" type="line" data={chartData} dataKey="progress" />
        )}

        {quizChartData.length > 0 && (
          <ProgressChart title="Quiz Accuracy % (Last 5)" type="bar" data={quizChartData} dataKey="accuracy" />
        )}
      </Stack>
    </Container>
  );
};

export default ProgressPage;
