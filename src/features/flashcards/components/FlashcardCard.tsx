import { Box, Paper, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconRotate } from '@tabler/icons-react';

import { Flashcard } from '../types';

interface FlashcardCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onClick: () => void;
}

export const FlashcardCard: React.FC<FlashcardCardProps> = ({ card, isFlipped, onClick }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  // Normalize front/back HTML from both camelCase and snake_case formats
  const frontHtml = (card.front_html || (card as any).frontHTML || '').trim();
  const backHtml = (card.back_html || (card as any).backHTML || '').trim();

  return (
    <Box
      onClick={onClick}
      style={{
        width: '100%',
        height: '420px',
        cursor: 'pointer',
        perspective: '1200px',
        position: 'relative',
      }}
    >
      {/* Inner container that flips */}
      <Box
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Front Face */}
        <Paper
          radius="xl"
          withBorder
          style={{
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '36px',
            backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
            borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
            boxShadow: isDark
              ? `0 8px 32px rgba(0,0,0,0.4)`
              : `0 4px 24px rgba(0,0,0,0.08)`,
            overflow: 'hidden',
          }}
        >
          {/* Accent bar top */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.colors[primary][5]}, ${theme.colors[primary][3]})`,
              borderRadius: '12px 12px 0 0',
            }}
          />

          {/* Question label */}
          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'auto' }}>
            <Box
              style={{
                background: isDark ? theme.colors[primary][9] : theme.colors[primary][0],
                border: `1px solid ${theme.colors[primary][isDark ? 7 : 2]}`,
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: theme.colors[primary][isDark ? 3 : 6],
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Question {card.id}
            </Box>
          </Box>

          {/* Question text */}
          <Box
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 0',
            }}
            dangerouslySetInnerHTML={{ __html: frontHtml }}
          />

          {/* Flip hint */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: isDark ? theme.colors.gray[5] : theme.colors.gray[5],
              fontSize: '12px',
              marginTop: 'auto',
            }}
          >
            <IconRotate size={14} />
            <Text size="xs" c="dimmed">Click to reveal answer</Text>
          </Box>
        </Paper>

        {/* Back Face */}
        <Paper
          radius="xl"
          style={{
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '36px',
            background: isDark
              ? `linear-gradient(135deg, ${theme.colors[primary][9]}, ${theme.colors[primary][8]})`
              : `linear-gradient(135deg, ${theme.colors[primary][0]}, ${theme.colors[primary][1]})`,
            borderColor: theme.colors[primary][isDark ? 7 : 3],
            overflow: 'hidden',
            boxShadow: isDark
              ? `0 8px 32px rgba(0,0,0,0.5)`
              : `0 4px 24px ${theme.colors[primary][1]}`,
          }}
        >
          {/* Decorative circle */}
          <Box
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: isDark
                ? `${theme.colors[primary][7]}40`
                : `${theme.colors[primary][2]}60`,
            }}
          />

          {/* Answer label */}
          <Box style={{ marginBottom: 'auto' }}>
            <Box
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: isDark ? `${theme.colors[primary][7]}50` : `${theme.colors[primary][2]}80`,
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: theme.colors[primary][isDark ? 2 : 7],
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Answer
            </Box>
          </Box>

          {/* Answer text */}
          <Box
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '17px',
              lineHeight: 1.6,
              color: theme.colors[primary][isDark ? 1 : 8],
              textAlign: 'center',
              padding: '16px 0',
            }}
            dangerouslySetInnerHTML={{ __html: backHtml }}
          />

          {/* Flip back hint */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '12px',
              color: theme.colors[primary][isDark ? 4 : 5],
              marginTop: 'auto',
            }}
          >
            <IconRotate size={14} />
            <Text size="xs" style={{ color: 'inherit' }}>Click to go back</Text>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};