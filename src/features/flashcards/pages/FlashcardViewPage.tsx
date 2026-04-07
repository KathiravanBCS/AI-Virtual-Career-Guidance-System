import { useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Paper,
  Progress,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck, IconLayoutCards } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';

import { useGetFlashcardById, useGetFlashcardItems } from '../api';
import { FlashcardCard } from '../components';
import useActivityLogger from '@/hooks/useActivityLogger';
import { useNotification } from '@/features/gamification/context/NotificationContext';

export const FlashcardViewPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const primary = theme.primaryColor;
  const { id } = useParams<{ id: string }>();
  const flashcardId = id ? parseInt(id, 10) : null;

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [visitedCards, setVisitedCards] = useState<Set<number>>(new Set([0]));

  const { showNotification } = useNotification();
  const { logFlashcardSetComplete } = useActivityLogger({ showNotification });

  const { data: flashcard, isLoading: isLoadingFlashcard } = useGetFlashcardById(flashcardId);
  const { data: itemsResponse, isLoading: isLoadingItems } = useGetFlashcardItems(flashcardId);
  const items = Array.isArray(itemsResponse) ? itemsResponse : itemsResponse?.data || [];

  const cards = items.map((item) => ({
    id: item.id,
    flashcard_code: '',
    learning_module_id: flashcardId || 0,
    title: '',
    description: '',
    items_count: 0,
    status: 'active',
    front_html: item.front_html,
    back_html: item.back_html,
  }));

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

  if (!flashcardId) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout title="Invalid Flashcard" titleProps={{ fw: 700, size: 'h2' }} description="Could not load flashcard">
          <Button onClick={() => navigate('/flashcards/generate')} radius="lg">Back to Generate</Button>
        </ListPageLayout>
      </Container>
    );
  }

  if (isLoadingFlashcard || isLoadingItems) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout title="Loading Flashcard" titleProps={{ fw: 700, size: 'h2' }}>
          <Stack gap="lg" align="center" py="xl">
            <Loader size="lg" color={primary} />
            <Text c="dimmed">Loading your flashcards...</Text>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  if (!flashcard || cards.length === 0) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="No Flashcard Found"
          titleProps={{ fw: 700, size: 'h2' }}
          description="Could not find flashcard or no items available"
        >
          <Stack gap="lg" align="center">
            <Button onClick={() => navigate('/flashcards/generate')} radius="lg">Back to Generate</Button>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  const progress = ((currentCardIndex + 1) / cards.length) * 100;
  const isLastCard = currentCardIndex === cards.length - 1;

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title={flashcard.title}
        titleProps={{ fw: 700, size: 'h2' }}
        description={`${cards.length} cards in this collection`}
        actions={
          <Button
            variant="default"
            onClick={() => navigate('/flashcards/generate')}
            radius="lg"
            leftSection={<IconLayoutCards size={16} />}
          >
            Back to Generator
          </Button>
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
              <Progress value={progress} radius="xl" size="sm" color={primary} />
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

            <Text size="sm" c="dimmed" fw={500}>
              {isFlipped ? 'Showing answer' : 'Showing question'}
            </Text>

            {isLastCard ? (
              <Button
                onClick={async () => {
                  await logFlashcardSetComplete(flashcardId || 0);
                  navigate('/flashcards');
                }}
                color={primary}
                radius="lg"
                leftSection={<IconCheck size={16} />}
              >
                Complete Set
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                color={primary}
                radius="lg"
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

export default FlashcardViewPage;