import { Box, Group, Paper, Progress, SimpleGrid, Text, Title } from '@mantine/core';

import { PathDetails } from '../types';

interface PathHeaderProps {
  path: PathDetails;
}

export const PathHeader: React.FC<PathHeaderProps> = ({ path }) => {
  return (
    <Paper
      p="lg"
      style={{
        background: '#2a2a2a/70',
        border: '1px solid #3a3a3a',
        borderRadius: '16px',
      }}
    >
      <Title
        order={1}
        style={{
          background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        mb="md"
      >
        {path.careerName}
      </Title>

      {path.description && (
        <Text c="dimmed" mb="lg">
          {path.description}
        </Text>
      )}

      <Progress value={path.progress} color="#ff9d54" mb="lg" />

      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <Box>
          <Text c="dimmed" size="sm">
            Progress
          </Text>
          <Title order={3} style={{ color: '#ff9d54' }}>
            {path.progress}%
          </Title>
        </Box>
        <Box>
          <Text c="dimmed" size="sm">
            Modules Completed
          </Text>
          <Title order={3} style={{ color: '#ff9d54' }}>
            {path.completedModules?.length || 0}/{path.modules?.length || 0}
          </Title>
        </Box>
        <Box>
          <Text c="dimmed" size="sm">
            Estimated Hours
          </Text>
          <Title order={3} style={{ color: '#ff9d54' }}>
            {path.totalEstimatedHours || '20+'}
          </Title>
        </Box>
        <Box>
          <Text c="dimmed" size="sm">
            Lessons
          </Text>
          <Title order={3} style={{ color: '#ff9d54' }}>
            {path.modules.reduce((sum, m) => sum + (m.lessonCount || 3), 0)}
          </Title>
        </Box>
      </SimpleGrid>
    </Paper>
  );
};
