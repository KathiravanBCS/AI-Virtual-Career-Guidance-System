import { useState } from 'react';

import { Button, Center, Container, Grid, Group, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';

import { LessonContent, LessonsList } from '../components';
import { ModuleDetail } from '../types';

// Mock data
const MOCK_MODULE: ModuleDetail = {
  id: '3',
  title: 'React',
  description: 'Build interactive UIs with React',
  pathId: '1',
  pathName: 'Full Stack Developer',
  progress: 50,
  completed: false,
  lessons: [
    {
      id: '1',
      title: 'Introduction to React',
      content: 'Learn the basics of React and component-based architecture',
      order: 1,
      completed: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      resources: [
        { title: 'React Documentation', url: 'https://react.dev' },
        { title: 'Getting Started Guide', url: 'https://react.dev/learn' },
      ],
    },
    {
      id: '2',
      title: 'Components and Props',
      content: 'Understand how to create reusable components',
      order: 2,
      completed: true,
    },
    {
      id: '3',
      title: 'State and Hooks',
      content: 'Learn about React state and hooks',
      order: 3,
      completed: false,
    },
  ],
};

export const ModuleDetailsPage: React.FC = () => {
  const { pathId, moduleId } = useParams<{
    pathId: string;
    moduleId: string;
  }>();
  const navigate = useNavigate();

  const [currentLessonId, setCurrentLessonId] = useState(MOCK_MODULE.lessons[0].id);
  const [isLoading] = useState(false);

  const currentLesson = MOCK_MODULE.lessons.find((l) => l.id === currentLessonId);

  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

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
        {/* Header */}
        <Paper
          p="lg"
          style={{
            background: '#2a2a2a/70',
            border: '1px solid #3a3a3a',
            borderRadius: '16px',
          }}
        >
          <Group justify="space-between" mb="lg">
            <div>
              <Text c="dimmed" size="sm">
                {MOCK_MODULE.pathName}
              </Text>
              <Title order={1} style={{ color: '#ff9d54' }}>
                {MOCK_MODULE.title}
              </Title>
            </div>
            <Button variant="default" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          </Group>
        </Paper>

        {/* Content Area */}
        <Grid gutter="lg">
          {/* Main Lesson Content */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            {currentLesson && (
              <Stack gap="lg">
                <LessonContent lesson={currentLesson} />

                {/* Navigation */}
                <Group justify="space-between">
                  <Button
                    variant="default"
                    disabled={currentLesson.order === 1}
                    onClick={() => {
                      const prevLesson = MOCK_MODULE.lessons.find((l) => l.order === currentLesson.order - 1);
                      if (prevLesson) setCurrentLessonId(prevLesson.id);
                    }}
                  >
                    ← Previous
                  </Button>

                  <Text c="dimmed">
                    Lesson {currentLesson.order} of {MOCK_MODULE.lessons.length}
                  </Text>

                  <Button
                    onClick={() => {
                      const nextLesson = MOCK_MODULE.lessons.find((l) => l.order === currentLesson.order + 1);
                      if (nextLesson) setCurrentLessonId(nextLesson.id);
                    }}
                    disabled={currentLesson.order === MOCK_MODULE.lessons.length}
                    style={{
                      background:
                        currentLesson.order === MOCK_MODULE.lessons.length
                          ? '#3a3a3a'
                          : 'linear-gradient(to right, #ff9d54, #ff8a30)',
                      color: 'white',
                    }}
                  >
                    Next →
                  </Button>
                </Group>
              </Stack>
            )}
          </Grid.Col>

          {/* Lessons Sidebar */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper
              p="lg"
              style={{
                background: '#2a2a2a/70',
                border: '1px solid #3a3a3a',
                borderRadius: '16px',
              }}
            >
              <Title order={3} style={{ color: '#ff9d54' }} mb="lg">
                Lessons ({MOCK_MODULE.lessons.length})
              </Title>
              <LessonsList
                lessons={MOCK_MODULE.lessons}
                currentLessonId={currentLessonId}
                onLessonSelect={setCurrentLessonId}
              />
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default ModuleDetailsPage;
