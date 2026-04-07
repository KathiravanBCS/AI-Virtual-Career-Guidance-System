import { useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck, IconCircleCheck, IconDownload } from '@tabler/icons-react';
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
  const isDark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isFlashcardSaved, setIsFlashcardSaved] = useState<boolean>(false);
  const [visitedCards, setVisitedCards] = useState<Set<number>>(new Set([0]));

  const { cards = [], topic = 'Flashcards', learning_module_id = 0, module_name = '' } =
    (location.state as any) || {};

  const { mutate: createFlashcard, isPending: isCreatingFlashcard } = useCreateFlashcard();
  const { mutate: createFlashcardItem, isPending: isCreatingItem } = useCreateFlashcardItem();
  const { showNotification } = useNotification();
  const { logFlashcardSetComplete } = useActivityLogger({ showNotification });

  const getTitleWithDate = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${module_name || topic} - ${dateStr} ${timeStr}`;
  };

  if (!cards || cards.length === 0) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="No Flashcards"
          titleProps={{ fw: 700, size: 'h2' }}
          description="No flashcards found. Please generate some first."
        >
          <Stack gap="lg" align="center">
            <Button onClick={() => navigate('/flashcards/generate')} radius="lg">
              Generate Flashcards
            </Button>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  const progress = ((currentCardIndex + 1) / cards.length) * 100;
  const isLastCard = currentCardIndex === cards.length - 1;

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setIsFlipped(false);
      const next = currentCardIndex + 1;
      setCurrentCardIndex(next);
      setVisitedCards((prev) => new Set([...prev, next]));
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
        flashcard_code: '',
        learning_module_id: learning_module_id || 0,
        title: getTitleWithDate(),
        description: '',
        status: 'active',
        items_count: cards.length,
      };

      createFlashcard(flashcardData, {
        onSuccess: (createdFlashcard: Flashcard) => {
          cards.forEach((card: any, index: number) => {
            const itemData: CreateFlashcardItemRequest = {
              flashcard_id: createdFlashcard.id || 0,
              front_html: card.frontHTML || card.front_html,
              back_html: card.backHTML || card.back_html,
              item_order: index + 1,
            };
            createFlashcardItem({ flashcardId: createdFlashcard.id || 0, data: itemData });
          });
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
        description={`${cards.length} cards · click to flip between question and answer`}
        actions={
          <Group gap="sm">
            <Button
              variant={isFlashcardSaved ? 'light' : 'default'}
              color={isFlashcardSaved ? 'green' : primary}
              onClick={handleSaveFlashcard}
              loading={isCreatingFlashcard || isCreatingItem}
              disabled={isFlashcardSaved}
              radius="lg"
              leftSection={isFlashcardSaved ? <IconCircleCheck size={16} /> : <IconDownload size={16} />}
            >
              {isFlashcardSaved ? 'Saved' : 'Save Deck'}
            </Button>
            <Button
              variant="default"
              onClick={() => navigate('/flashcards/generate')}
              radius="lg"
            >
              New Deck
            </Button>
          </Group>
        }
      >
        <Stack gap="lg" align="center">
          {/* Progress header */}
          <Box style={{ width: '100%', maxWidth: '720px' }}>
            <Paper
              p="md"
              radius="xl"
              withBorder
              style={{
                backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
              }}
            >
              <Group justify="space-between" mb="sm">
                <Group gap="xs">
                  <Text size="sm" fw={600} c={isDark ? theme.colors.gray[1] : theme.colors.gray[8]}>
                    Card {currentCardIndex + 1}
                  </Text>
                  <Text size="sm" c="dimmed">of {cards.length}</Text>
                </Group>
                <Group gap="xs">
                  {Array.from({ length: cards.length }, (_, i) => (
                    <Box
                      key={i}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor:
                          i === currentCardIndex
                            ? theme.colors[primary][5]
                            : visitedCards.has(i)
                            ? theme.colors[primary][isDark ? 7 : 2]
                            : isDark
                            ? theme.colors.dark[4]
                            : theme.colors.gray[3],
                        transition: 'background-color 0.3s',
                      }}
                    />
                  ))}
                </Group>
                <Badge variant="light" color={primary} size="sm" radius="md">
                  {Math.round(progress)}% done
                </Badge>
              </Group>
              <Progress
                value={progress}
                radius="xl"
                size="sm"
                color={primary}
                style={{ transition: 'all 0.4s ease' }}
              />
            </Paper>
          </Box>

          {/* Flashcard */}
          <Box style={{ width: '100%', maxWidth: '720px' }}>
            <FlashcardCard
              card={cards[currentCardIndex]}
              isFlipped={isFlipped}
              onClick={() => setIsFlipped(!isFlipped)}
            />
          </Box>

          {/* Navigation */}
          <Group justify="space-between" style={{ width: '100%', maxWidth: '720px' }}>
            <Button
              onClick={handlePrev}
              disabled={currentCardIndex === 0}
              variant="default"
              radius="lg"
              leftSection={<IconArrowLeft size={16} />}
            >
              Previous
            </Button>

            <Text fw={500} size="sm" c="dimmed">
              {isFlipped ? 'Showing answer' : 'Showing question'}
            </Text>

            {isLastCard ? (
              <Button
                onClick={async () => {
                  await handleSaveFlashcard();
                  await logFlashcardSetComplete(learning_module_id || 0);
                  navigate('/flashcards');
                }}
                color={primary}
                radius="lg"
                loading={isCreatingFlashcard || isCreatingItem}
                leftSection={<IconCheck size={16} />}
              >
                Complete & Save
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                radius="lg"
                color={primary}
                rightSection={<IconArrowRight size={16} />}
              >
                Next
              </Button>
            )}
          </Group>
        </Stack>
      </ListPageLayout>
    </Container>
  );
};

export default FlashcardDisplayPage;