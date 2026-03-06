import { Box, Group, Paper, Text, Title } from '@mantine/core';

import { StreakStats } from '../types';

interface StreakStatCardProps {
  stat: StreakStats;
}

export const StreakStatCard: React.FC<StreakStatCardProps> = ({ stat }) => {
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
      <Group justify="space-between">
        <div>
          <Text c="dimmed" size="sm">
            {stat.label}
          </Text>
          <Title order={2} style={{ color: '#ff9d54' }}>
            {stat.value}
          </Title>
        </div>
        <Box style={{ fontSize: '48px' }}>{stat.icon}</Box>
      </Group>
    </Paper>
  );
};
