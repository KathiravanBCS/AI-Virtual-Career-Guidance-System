import { Box, Paper, Text, Title } from '@mantine/core';

interface FlashcardStatsProps {
  count: number;
}

export const FlashcardStats: React.FC<FlashcardStatsProps> = ({ count }) => {
  return (
    <Paper
      p="lg"
      style={{
        background: '#2a2a2a/70',
        border: '1px solid #3a3a3a',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
      }}
    >
      <Title order={2} mb="md">
        <Box component="span" mr="xs">
          📚
        </Box>
        Flashcards Created
      </Title>
      <Text
        style={{
          fontSize: '48px',
          fontWeight: 700,
          color: '#ff9d54',
          marginTop: '16px',
        }}
      >
        {count}
      </Text>
    </Paper>
  );
};
