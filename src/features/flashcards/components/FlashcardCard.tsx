import { Box, Paper, useMantineColorScheme, useMantineTheme } from '@mantine/core';

import { Flashcard } from '../types';

interface FlashcardCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onClick: () => void;
}

export const FlashcardCard: React.FC<FlashcardCardProps> = ({ card, isFlipped, onClick }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Paper
      onClick={onClick}
      p="lg"
      radius="lg"
      withBorder
      style={{
        width: '100%',
        height: '400px',
        cursor: 'pointer',
        perspective: '1000px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        borderColor: theme.colors.gray[colorScheme === 'dark' ? 7 : 2],
      }}
    >
      {/* Front */}
      <Box
        style={{
          width: '100%',
          height: '100%',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backfaceVisibility: 'hidden',
          transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
          transition: 'transform 0.6s',
          position: 'absolute',
          top: 0,
          left: 0,
          color: colorScheme === 'dark' ? theme.colors.gray[0] : 'inherit',
        }}
      >
        <Box style={{ fontSize: '12px', fontWeight: 600, color: theme.colors[theme.primaryColor][5] }}>
          Question {card.id}
        </Box>
        <Box
          style={{
            fontSize: '24px',
            fontWeight: 500,
            textAlign: 'center',
            color: colorScheme === 'dark' ? theme.colors.gray[0] : 'inherit',
          }}
          dangerouslySetInnerHTML={{ __html: card.frontHTML }}
        />
        <Box style={{ fontSize: '12px', textAlign: 'center' }} c="dimmed">
          Click to flip ↓
        </Box>
      </Box>

      {/* Back */}
      <Box
        style={{
          width: '100%',
          height: '100%',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backfaceVisibility: 'hidden',
          transform: isFlipped ? 'rotateX(0deg)' : 'rotateX(-180deg)',
          transition: 'transform 0.6s',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor:
            colorScheme === 'dark' ? theme.colors[theme.primaryColor][9] : theme.colors[theme.primaryColor][0],
          color: colorScheme === 'dark' ? theme.colors[theme.primaryColor][2] : theme.colors[theme.primaryColor][7],
        }}
      >
        <Box
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: colorScheme === 'dark' ? theme.colors[theme.primaryColor][3] : theme.colors[theme.primaryColor][6],
          }}
        >
          Answer
        </Box>
        <Box
          style={{
            fontSize: '16px',
            textAlign: 'center',
            color: colorScheme === 'dark' ? theme.colors[theme.primaryColor][2] : theme.colors[theme.primaryColor][7],
          }}
          dangerouslySetInnerHTML={{ __html: card.backHTML }}
        />
        <Box style={{ fontSize: '12px', textAlign: 'center' }} c="dimmed">
          Click to flip ↑
        </Box>
      </Box>
    </Paper>
  );
};
