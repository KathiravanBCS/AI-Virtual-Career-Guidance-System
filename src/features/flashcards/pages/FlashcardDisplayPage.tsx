import { useState } from 'react';

import { Box, Button, Container, Group, Stack, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';

import { FlashcardCard } from '../components';
import { Flashcard } from '../types';

export const FlashcardDisplayPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Get cards and metadata from location state
  const { cards = [], topic = 'Flashcards' } = (location.state as any) || {};

  // If no cards, redirect back to generator
  if (!cards || cards.length === 0) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="No Flashcards"
          titleProps={{ fw: 700, size: 'h2' }}
          description="No flashcards found. Please generate some first."
        >
          <Stack gap="lg" align="center">
            <Button onClick={() => navigate('/flashcards/generate')}>Generate Flashcards</Button>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title={`Flashcards: ${topic}`}
        titleProps={{ fw: 700, size: 'h2' }}
        description={`Study these ${cards.length} flashcards to enhance your learning`}
        actions={
          <Button variant="default" color={theme.primaryColor} onClick={() => navigate('/flashcards/generate')}>
            Generate New
          </Button>
        }
      >
        <Stack
          gap="lg"
          align="center"
          style={{
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
            padding: '2rem',
            borderRadius: '8px',
          }}
        >
          {/* Flashcard Display */}
          <Box style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
            <FlashcardCard
              card={cards[currentCardIndex]}
              isFlipped={isFlipped}
              onClick={() => setIsFlipped(!isFlipped)}
            />
          </Box>

          {/* Navigation */}
          <Group justify="space-between" style={{ width: '100%', maxWidth: '700px' }}>
            <Button onClick={handlePrev} disabled={currentCardIndex === 0} variant="default" color={theme.primaryColor}>
              Previous
            </Button>

            <Text fw={500} size="lg" c={colorScheme === 'dark' ? theme.colors.gray[0] : 'inherit'}>
              {currentCardIndex + 1} / {cards.length}
            </Text>

            <Button
              onClick={handleNext}
              disabled={currentCardIndex === cards.length - 1}
              variant="default"
              color={theme.primaryColor}
            >
              Next
            </Button>
          </Group>

          {/* Card Progress */}
          <Box style={{ width: '100%', maxWidth: '700px', textAlign: 'center' }}>
            <Text c="dimmed" size="sm">
              Click on the card to flip between question and answer
            </Text>
          </Box>
        </Stack>
      </ListPageLayout>
    </Container>
  );
};

export default FlashcardDisplayPage;
