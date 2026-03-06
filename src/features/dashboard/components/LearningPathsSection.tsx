import { Box, Button, Center, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { LearningPath } from '../types';

interface LearningPathsSectionProps {
  paths: LearningPath[];
  loading: boolean;
}

export const LearningPathsSection: React.FC<LearningPathsSectionProps> = ({ paths, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Paper
        p="lg"
        style={{
          background: '#2a2a2a/70',
          border: '1px solid #3a3a3a',
          borderRadius: '16px',
          minHeight: '400px',
          animation: 'pulse 2s infinite',
        }}
      />
    );
  }

  return (
    <Paper
      p="lg"
      style={{
        background: '#2a2a2a/70',
        border: '1px solid #3a3a3a',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Group justify="space-between" mb="lg">
        <Title order={2} size="h5" c="white">
          <Box component="span" mr="xs">
            📚
          </Box>
          Your Learning Paths
        </Title>
      </Group>

      {paths.length > 0 ? (
        <Stack gap="md" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {paths.map((path) => (
            <Paper
              key={path.$id}
              p="md"
              style={{
                background: '#1c1b1b/70',
                border: '1px solid #3a3a3a',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#333333';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#1c1b1b/70';
              }}
            >
              <Group justify="space-between" mb="sm">
                <Text fw={500} c="white">
                  {path.careerName}
                </Text>
                <Text
                  size="sm"
                  style={{
                    background: '#3a3a3a',
                    color: '#ff9d54',
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}
                >
                  {path.progress}%
                </Text>
              </Group>

              <Progress
                value={path.progress}
                style={{
                  background: '#3a3a3a',
                  borderRadius: '10px',
                }}
                mb="sm"
                color="#ff9d54"
              />

              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  {path.completedModules?.length || 0}/{path.modules?.length || 0} modules
                </Text>
                <Button
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/learning-path/${path.$id}`);
                  }}
                  style={{
                    background: '#ff9d54',
                    color: 'white',
                  }}
                >
                  Continue
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Center
          style={{
            minHeight: '300px',
            flexDirection: 'column',
          }}
        >
          <Box style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</Box>
          <Title order={3} c="white" mb="xs">
            Start Your Learning Journey
          </Title>
          <Text c="dimmed" size="sm" mb="lg">
            Create your first learning path to begin
          </Text>
          <Button
            onClick={() => navigate('/learning-path')}
            style={{
              background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
              color: 'white',
            }}
          >
            Create Path
          </Button>
        </Center>
      )}
    </Paper>
  );
};
