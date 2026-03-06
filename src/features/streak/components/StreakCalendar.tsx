import { Box, Paper, SimpleGrid, Text, Title } from '@mantine/core';

interface StreakCalendarProps {
  history: Array<{ date: string; completed: boolean }>;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ history }) => {
  return (
    <Paper
      p="lg"
      style={{
        background: '#2a2a2a/70',
        border: '1px solid #3a3a3a',
        borderRadius: '16px',
      }}
    >
      <Title order={2} style={{ color: '#ff9d54' }} mb="lg">
        Last 30 Days Activity
      </Title>

      <SimpleGrid cols={{ base: 7, sm: 7 }} spacing="xs">
        {history.map((day, idx) => (
          <Box
            key={idx}
            style={{
              width: '100%',
              aspectRatio: '1',
              background: day.completed ? '#ff9d54' : '#3a3a3a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: day.completed ? 1 : 0.5,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
            title={new Date(day.date).toLocaleDateString()}
          >
            {day.completed ? '✓' : ''}
          </Box>
        ))}
      </SimpleGrid>

      <div style={{ marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box
            style={{
              width: '16px',
              height: '16px',
              background: '#ff9d54',
              borderRadius: '4px',
            }}
          />
          <Text size="sm" c="dimmed">
            Completed
          </Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box
            style={{
              width: '16px',
              height: '16px',
              background: '#3a3a3a',
              borderRadius: '4px',
            }}
          />
          <Text size="sm" c="dimmed">
            Missed
          </Text>
        </div>
      </div>
    </Paper>
  );
};
