import { useState } from 'react';

import { Box, Button, Container, Group, Stack, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';

import { useCreateFlashcard, useCreateFlashcardItem } from '../api';
import { FlashcardCard } from '../components';
import type { CreateFlashcardItemRequest, CreateFlashcardRequest, Flashcard } from '../types';
import useActivityLogger from '@/hooks/useActivityLogger';
import { useNotification } from '@/features/gamification/context/NotificationContext';

export const FlashcardDisplayPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isFlashcardSaved, setIsFlashcardSaved] = useState<boolean>(false);

  // Get cards and metadata from location state
  const { cards = [], topic = 'Flashcards', learning_module_id = 0, module_name = '' } = (location.state as any) || {};

  // Hooks for creating flashcards and items
  const { mutate: createFlashcard, isPending: isCreatingFlashcard } = useCreateFlashcard();
  const { mutate: createFlashcardItem, isPending: isCreatingItem } = useCreateFlashcardItem();
  const { showNotification } = useNotification();
  const { logFlashcardSetComplete } = useActivityLogger({
    showNotification,
  });

  // Generate title with module name, current date and time
  const getTitleWithDate = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${module_name || topic} - ${dateStr} ${timeStr}`;
  };

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

  const handleSaveFlashcard = async () => {
    try {
      const flashcardData: CreateFlashcardRequest = {
        // Auto-generated from backend
        flashcard_code: '',
        // Passed from generator form
        learning_module_id: learning_module_id || 0,
        // Module name with current date
        title: getTitleWithDate(),
        // Always active, no description
        description: '',
        status: 'active',
        items_count: cards.length,
      };

      // Create the flashcard first
      createFlashcard(flashcardData, {
        onSuccess: (createdFlashcard: Flashcard) => {
          // After flashcard is created, create all the items
          cards.forEach((card: any, index: number) => {
            const itemData: CreateFlashcardItemRequest = {
              flashcard_id: createdFlashcard.id || 0,
              front_html: card.frontHTML || card.front_html,
              back_html: card.backHTML || card.back_html,
              item_order: index + 1,
            };
            createFlashcardItem({
              flashcardId: createdFlashcard.id || 0,
              data: itemData,
            });
          });

          // Mark flashcard as saved
          setIsFlashcardSaved(true);
        },
      });
    } catch (error) {
      console.error('Error saving flashcard:', error);
    }
  };

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title={`Flashcards: ${topic}`}
        titleProps={{ fw: 700, size: 'h2' }}
        description={`Study these ${cards.length} flashcards to enhance your learning`}
        actions={
          <Group>
            <Button
              variant="default"
              color={theme.primaryColor}
              onClick={handleSaveFlashcard}
              loading={isCreatingFlashcard || isCreatingItem}
              disabled={isFlashcardSaved || isCreatingFlashcard || isCreatingItem}
            >
              {isFlashcardSaved ? 'Saved Successfully' : 'Save Flashcard'}
            </Button>
            <Button variant="default" color={theme.primaryColor} onClick={() => navigate('/flashcards/generate')}>
              Generate New
            </Button>
          </Group>
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

            {currentCardIndex === cards.length - 1 ? (
              <Button
                onClick={async () => {
                  await handleSaveFlashcard();
                  await logFlashcardSetComplete(learning_module_id || 0);
                  navigate('/flashcards');
                }}
                color={theme.primaryColor}
                loading={isCreatingFlashcard || isCreatingItem}
              >
                Complete & Save
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentCardIndex === cards.length - 1}
                variant="default"
                color={theme.primaryColor}
              >
                Next
              </Button>
            )}
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
