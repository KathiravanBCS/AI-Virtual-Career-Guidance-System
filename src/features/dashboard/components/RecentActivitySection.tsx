import { Box, Center, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';

import { RecentActivity } from '../types';

interface RecentActivitySectionProps {
  activities: RecentActivity[];
  loading: boolean;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ activities, loading }) => {
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
      <Title order={2} size="h5" c="white" mb="lg">
        <Box component="span" mr="xs">
          📊
        </Box>
        Recent Quiz Activity
      </Title>

      {activities.length > 0 ? (
        <Stack
          gap="md"
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {activities.map((activity, index) => (
            <Paper
              key={index}
              p="md"
              style={{
                borderLeft: '4px solid #ff9d54',
                background: 'transparent',
              }}
            >
              <Group justify="space-between" mb="xs">
                <Box>
                  <Text fw={500} c="white">
                    {activity.type === 'quiz' ? '📝 Quiz' : '🗂️ Flashcards'}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {activity.moduleName || 'Untitled Module'}
                  </Text>
                </Box>

                {activity.type === 'quiz' && activity.feedback && (
                  <Paper
                    p="xs"
                    style={{
                      background: '#3a3a3a',
                      color: '#ff9d54',
                      borderRadius: '8px',
                      maxWidth: '120px',
                      textAlign: 'center',
                      wordBreak: 'break-word',
                    }}
                  >
                    <Text size="xs">{activity.feedback}</Text>
                  </Paper>
                )}
              </Group>

              <Text size="xs" c="dimmed">
                {formatDate(activity.date)}
              </Text>
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
          <Text c="dimmed" mb="xs">
            No activity recorded yet
          </Text>
          <Text size="sm" c="dimmed">
            Complete quizzes to see your progress
          </Text>
        </Center>
      )}
    </Paper>
  );
};
