import { useEffect, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import groqConfig from '@/config/groq.config';
import { useGetGuidancesWithModules } from '@/features/learningPath/api/useGetGuidancesWithModules';

export const FlashcardGenerator: React.FC = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { data: guidances = [], isLoading: guidancesLoading } = useGetGuidancesWithModules();

  // Debug: Log guidances data
  useEffect(() => {
    console.log('[FlashcardGenerator] Guidances loaded:', guidances);
    if (guidances.length > 0) {
      console.log('[FlashcardGenerator] First guidance modules:', guidances[0]?.learning_modules);
    }
  }, [guidances]);

  // State Management
  const [selectedGuidanceId, setSelectedGuidanceId] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [flashcardTopic, setFlashcardTopic] = useState<string>('');
  const [numCards, setNumCards] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Derived State
  const selectedGuidance = guidances.find((g) => g.id === selectedGuidanceId);
  const modules = selectedGuidance?.learning_modules || [];
  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  // Format guidance options for select
  const guidanceOptions = guidances.map((guidance) => ({
    value: String(guidance.id),
    label: `${guidance.name} - ${guidance.career_goal}`,
  }));

  // Format module options for select - only if modules exist
  const moduleOptions =
    modules && modules.length > 0
      ? modules.map((module) => ({
          value: String(module.id),
          label: module.title,
        }))
      : [];

  // Handle guidance selection
  const handleGuidanceChange = (guidanceId: string | null) => {
    if (guidanceId) {
      setSelectedGuidanceId(Number(guidanceId));
      setSelectedModuleId(null);
      setFlashcardTopic('');
    }
  };

  // Handle module selection
  const handleModuleChange = (moduleId: string | null) => {
    if (moduleId && modules) {
      const module = modules.find((m) => m.id === Number(moduleId));
      if (module) {
        setSelectedModuleId(Number(moduleId));
        setFlashcardTopic(module.title); // Auto-populate topic from module title
      }
    }
  };

  // Generate flashcards
  const handleGenerateCards = async () => {
    if (!flashcardTopic.trim() || numCards < 1) {
      setError('Please select a module or enter a valid topic and number of cards');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get domain-specific instructions
      const domain =
        typeof selectedModule?.content === 'object' && selectedModule?.content?.domain
          ? String(selectedModule.content.domain)
          : 'technology';
      const category =
        typeof selectedModule?.content === 'object' && selectedModule?.content?.category
          ? String(selectedModule.content.category)
          : 'general';
      const instructions = groqConfig.getDomainFlashcardInstructions(domain, category);

      // Generate flashcards using the existing function
      const generatedCards = await groqConfig.generateFlashcards(flashcardTopic, numCards, {
        domainSpecific: true,
      });

      // Navigate to display page with generated cards
      navigate('/flashcards/display', {
        state: {
          cards: generatedCards,
          topic: flashcardTopic,
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate flashcards';
      setError(errorMessage);
      console.error('Flashcard generation error:', err);
      setLoading(false);
    }
  };

  // Handle start over
  const handleStartOver = () => {
    setSelectedGuidanceId(null);
    setSelectedModuleId(null);
    setFlashcardTopic('');
  };

  if (guidancesLoading) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Generate Flashcards"
          titleProps={{ fw: 700, size: 'h2' }}
          description="Select your learning path and module to create AI-powered flashcards"
        >
          <Stack gap="lg" align="center">
            <Loader size="lg" />
            <Text>Loading learning paths...</Text>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  if (!guidances || guidances.length === 0) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Generate Flashcards"
          titleProps={{ fw: 700, size: 'h2' }}
          description="Select your learning path and module to create AI-powered flashcards"
        >
          <Alert icon={<IconAlertCircle size={16} />} title="No Learning Paths Found" color="blue">
            Please create a learning guidance first to generate flashcards.
          </Alert>
        </ListPageLayout>
      </Container>
    );
  }

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title="Generate Flashcards"
        titleProps={{ fw: 700, size: 'h2' }}
        description="Select your learning path and module to create AI-powered flashcards"
      >
        <Stack gap="lg">
          {/* Controls */}
          <Paper
            p="lg"
            radius="lg"
            withBorder
            style={{
              backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              borderColor: theme.colors.gray[colorScheme === 'dark' ? 7 : 2],
            }}
          >
            <Stack gap="md">
              {/* Select Learning Path */}
              <Box>
                <Text fw={500} mb="xs">
                  Select Learning Path
                </Text>
                <Select
                  placeholder="Choose your learning path"
                  data={guidanceOptions}
                  value={selectedGuidanceId ? String(selectedGuidanceId) : null}
                  onChange={handleGuidanceChange}
                  clearable
                  searchable
                />
              </Box>

              {/* Select Module */}
              {selectedGuidance && modules.length > 0 && (
                <Box>
                  <Text fw={500} mb="xs">
                    Select Module
                  </Text>
                  <Select
                    placeholder="Choose a module"
                    data={moduleOptions}
                    value={selectedModuleId ? String(selectedModuleId) : null}
                    onChange={handleModuleChange}
                    clearable
                    searchable
                    disabled={modules.length === 0}
                  />
                </Box>
              )}
              {selectedGuidance && modules.length === 0 && (
                <Alert icon={<IconAlertCircle size={16} />} title="No Modules" color="yellow">
                  This learning path has no modules yet.
                </Alert>
              )}

              {/* Flashcard Topic */}
              {selectedModule && (
                <Box>
                  <Text fw={500} mb="xs">
                    Flashcard Topic
                  </Text>
                  <Paper
                    p="sm"
                    withBorder
                    style={{
                      backgroundColor:
                        colorScheme === 'dark'
                          ? theme.colors[theme.primaryColor][9]
                          : theme.colors[theme.primaryColor][0],
                      borderColor: theme.colors[theme.primaryColor][3],
                    }}
                  >
                    <Text
                      c={
                        colorScheme === 'dark'
                          ? theme.colors[theme.primaryColor][2]
                          : theme.colors[theme.primaryColor][7]
                      }
                    >
                      {flashcardTopic}
                    </Text>
                  </Paper>
                </Box>
              )}

              {/* Number of Cards */}
              {selectedModule && (
                <Box>
                  <Text fw={500} mb="xs">
                    Number of Cards
                  </Text>
                  <Select
                    placeholder="Select number of cards"
                    data={['3', '5', '10', '15', '20'].map((num) => ({ value: num, label: num }))}
                    value={String(numCards)}
                    onChange={(val) => setNumCards(Number(val))}
                  />
                </Box>
              )}

              {/* Error Alert */}
              {error && (
                <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                  {error}
                </Alert>
              )}

              {/* Action Buttons */}
              <Group justify="flex-end">
                <Button variant="default" onClick={handleStartOver}>
                  Clear
                </Button>
                {selectedModule && (
                  <Button
                    color={theme.primaryColor}
                    onClick={handleGenerateCards}
                    loading={loading}
                    disabled={!flashcardTopic.trim() || numCards < 1}
                  >
                    Generate Cards
                  </Button>
                )}
              </Group>
            </Stack>
          </Paper>

          {/* Loading State */}
          {loading && (
            <Stack gap="lg" align="center">
              <Loader size="lg" />
              <Text>Generating flashcards...</Text>
            </Stack>
          )}
        </Stack>
      </ListPageLayout>
    </Container>
  );
};

export default FlashcardGenerator;
