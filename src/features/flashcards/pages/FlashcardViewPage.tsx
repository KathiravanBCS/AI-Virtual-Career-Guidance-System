import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Container,
  Group,
  Loader,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';

import { useGetFlashcardById, useGetFlashcardItems } from '../api';
import { FlashcardCard } from '../components';
import useActivityLogger from '@/hooks/useActivityLogger';
import { useNotification } from '@/features/gamification/context/NotificationContext';
import { useLoggedInUser } from '@/lib/auth/useLoggedInUser';

export const FlashcardViewPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { id } = useParams<{ id: string }>();
  const flashcardId = id ? parseInt(id, 10) : null;

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const { showNotification } = useNotification();
  const { logFlashcardSetComplete } = useActivityLogger({
    showNotification,
  });
  const { user } = useLoggedInUser();

  // Fetch flashcard details
  const { data: flashcard, isLoading: isLoadingFlashcard } = useGetFlashcardById(flashcardId);
  // Fetch flashcard items
  const { data: itemsResponse, isLoading: isLoadingItems } = useGetFlashcardItems(flashcardId);

  // Extract items array from response (handle both formats)
  const items = Array.isArray(itemsResponse) ? itemsResponse : itemsResponse?.data || [];

  // Convert items to card format for FlashcardCard component
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

  // Debug logging
  console.log('[FlashcardViewPage] currentCardIndex:', currentCardIndex, 'cards.length:', cards.length, 'isLastCard:', currentCardIndex === cards.length - 1);

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

  if (!flashcardId) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Invalid Flashcard"
          titleProps={{ fw: 700, size: 'h2' }}
          description="Could not load flashcard"
        >
          <Button onClick={() => navigate('/flashcards/generate')}>Back to Generate</Button>
        </ListPageLayout>
      </Container>
    );
  }

  if (isLoadingFlashcard || isLoadingItems) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout title="Loading Flashcard" titleProps={{ fw: 700, size: 'h2' }}>
          <Stack gap="lg" align="center">
            <Loader size="lg" />
            <Text>Loading flashcard details...</Text>
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
            <Button onClick={() => navigate('/flashcards/generate')}>Back to Generate</Button>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title={flashcard.title}
        titleProps={{ fw: 700, size: 'h2' }}
        description={`Study these ${cards.length} flashcards from your collection`}
        actions={
          <Button variant="default" color={theme.primaryColor} onClick={() => navigate('/flashcards/generate')}>
            Back to Generator
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

            {currentCardIndex === cards.length - 1 ? (
              <Button
                onClick={async () => {
                  await logFlashcardSetComplete(flashcardId || 0);
                  navigate('/flashcards');
                }}
                color={theme.primaryColor}
              >
                Complete Set
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

export default FlashcardViewPage;
