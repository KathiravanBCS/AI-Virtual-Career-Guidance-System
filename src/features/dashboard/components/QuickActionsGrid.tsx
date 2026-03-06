import { Box, Group, Paper, SimpleGrid, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import { QuickAction } from '../types';

interface QuickActionsGridProps {
  actions: QuickAction[];
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ actions }) => {
  const navigate = useNavigate();

  return (
    <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
      {actions.map((action, index) => (
        <Paper
          key={index}
          component="button"
          onClick={() => navigate(action.path)}
          p="lg"
          style={{
            background: '#2a2a2a/60',
            border: '1px solid #3a3a3a',
            borderRadius: '16px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 25px rgba(255, 157, 84, 0.1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <Box style={{ fontSize: '32px', marginBottom: '8px' }}>{action.icon}</Box>
          <Title order={3} size="h5" c="white">
            {action.label}
          </Title>
          <Text size="sm" c="dimmed" mt="xs">
            {action.description}
          </Text>
        </Paper>
      ))}
    </SimpleGrid>
  );
};
