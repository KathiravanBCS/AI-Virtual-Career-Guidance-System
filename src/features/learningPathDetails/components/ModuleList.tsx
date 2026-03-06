import { Badge, Button, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { Module } from '../types';

interface ModuleListProps {
  modules: Module[];
  pathId: string;
}

export const ModuleList: React.FC<ModuleListProps> = ({ modules, pathId }) => {
  const navigate = useNavigate();

  return (
    <Stack gap="md">
      {modules.map((module, idx) => (
        <Paper
          key={module.id}
          p="lg"
          style={{
            background: '#2a2a2a/70',
            border: '1px solid #3a3a3a',
            borderRadius: '12px',
          }}
        >
          <Group justify="space-between" mb="md">
            <div>
              <Title order={3} c="white">
                Module {idx + 1}: {module.title}
              </Title>
              <Text c="dimmed" size="sm" mt="xs">
                {module.description}
              </Text>
            </div>
            <Badge
              size="lg"
              style={{
                background: module.completed ? '#10b981' : '#3a3a3a',
                color: module.completed ? 'white' : '#ff9d54',
              }}
            >
              {module.completed ? '✓ Completed' : `${module.progress}%`}
            </Badge>
          </Group>

          <Progress value={module.progress} color="#ff9d54" mb="md" />

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {module.estimatedTime || '2-3 hours'}
            </Text>
            <Button
              size="sm"
              onClick={() => navigate(`/learning-path/${pathId}/module/${module.id}`)}
              style={{
                background: '#ff9d54',
                color: 'white',
              }}
            >
              {module.completed ? 'Review' : 'Start'}
            </Button>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
};
