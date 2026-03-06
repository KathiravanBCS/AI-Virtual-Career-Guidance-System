import { Center, Container, Loader, Stack } from '@mantine/core';
import { useParams } from 'react-router-dom';

import { ModuleList, PathHeader } from '../components';
import { PathDetails } from '../types';

// Mock data
const MOCK_PATH: PathDetails = {
  $id: '1',
  careerName: 'Full Stack Developer',
  description: 'Comprehensive learning path for becoming a full stack developer',
  modules: [
    {
      id: '1',
      title: 'HTML & CSS',
      description: 'Learn the fundamentals of web design',
      completed: true,
      progress: 100,
      lessonCount: 12,
      estimatedTime: '20 hours',
    },
    {
      id: '2',
      title: 'JavaScript',
      description: 'Master JavaScript programming language',
      completed: true,
      progress: 100,
      lessonCount: 15,
      estimatedTime: '30 hours',
    },
    {
      id: '3',
      title: 'React',
      description: 'Build interactive UIs with React',
      completed: false,
      progress: 50,
      lessonCount: 18,
      estimatedTime: '35 hours',
    },
  ],
  completedModules: ['1', '2'],
  progress: 67,
  totalEstimatedHours: 85,
};

export const LearningPathDetailsPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const isLoading = false;

  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

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
        <PathHeader path={MOCK_PATH} />
        <ModuleList modules={MOCK_PATH.modules} pathId={pathId || ''} />
      </Stack>
    </Container>
  );
};

export default LearningPathDetailsPage;
