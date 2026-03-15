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
import { IconAlertCircle, IconHelpCircle } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import groqConfig from '@/config/groq.config';
import type { GuidanceWithLearningModules } from '@/features/guidance/types';
import { useGetGuidancesWithModules } from '@/features/learningPath/api/useGetGuidancesWithModules';

import { useGetQuizzes } from '../api';
import { RecentlyCreatedList } from './RecentlyCreatedList';

export const QuizGenerator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { data: guidances = [], isLoading: guidancesLoading } = useGetGuidancesWithModules();
  const { data: quizzesResponse } = useGetQuizzes();

  // Debug: Log guidances data
  useEffect(() => {
    console.log('[QuizGenerator] Guidances loaded:', guidances);
    if (guidances.length > 0) {
      console.log('[QuizGenerator] First guidance modules:', guidances[0]?.learning_modules);
    }
  }, [guidances]);

  // Debug: Log quizzes data
  useEffect(() => {
    console.log('[QuizGenerator] Quizzes response:', quizzesResponse);
  }, [quizzesResponse]);

  // Get quizzes array from response (handle both formats)
  const quizzesList = Array.isArray(quizzesResponse) ? quizzesResponse : quizzesResponse?.data || [];

  // State Management
  const [selectedGuidanceId, setSelectedGuidanceId] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [quizTopic, setQuizTopic] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-select learning path and module from navigation state
  useEffect(() => {
    if (navState.selectedPathId && guidances.length > 0 && !selectedGuidanceId) {
      const pathIdNum = parseInt(navState.selectedPathId.toString(), 10);
      const guidanceToSelect = guidances.find((g) => g.id === pathIdNum);

      if (guidanceToSelect) {
        console.log('[QuizGenerator] Auto-selected guidance:', guidanceToSelect);
        setSelectedGuidanceId(guidanceToSelect.id);

        // Auto-select module if provided
        if (navState.selectedModuleIndex !== undefined && navState.selectedModuleIndex >= 0) {
          const module = guidanceToSelect.learning_modules?.[navState.selectedModuleIndex];
          if (module) {
            console.log('[QuizGenerator] Auto-selected module:', module);
            setSelectedModuleId(module.id);
            setQuizTopic(module.title);
          }
        }
      }
    }
  }, [navState.selectedPathId, navState.selectedModuleIndex, guidances, selectedGuidanceId]);

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
      setQuizTopic('');
    }
  };

  // Handle module selection
  const handleModuleChange = (moduleId: string | null) => {
    if (moduleId && modules) {
      const module = modules.find((m) => m.id === Number(moduleId));
      if (module) {
        setSelectedModuleId(Number(moduleId));
        setQuizTopic(module.title); // Auto-populate topic from module title
      }
    }
  };

  // Generate quiz
  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim() || numQuestions < 1) {
      setError('Please select a module or enter a valid topic and number of questions');
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
      const instructions = groqConfig.getDomainQuizInstructions(domain, category);

      // Generate quiz using the existing function
      // generateQuizData expects: (topic, numQuestions, moduleContent)
      const generatedQuiz = await groqConfig.generateQuizData(
        quizTopic,
        numQuestions,
        selectedModule?.description || ''
      );

      // Navigate to display page with generated quiz
      navigate('/quiz/display', {
        state: {
          quiz: generatedQuiz,
          topic: generatedQuiz.topic || quizTopic,
          moduleName: selectedModule?.title,
          learning_module_id: selectedModuleId,
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quiz';
      setError(errorMessage);
      console.error('Quiz generation error:', err);
      setLoading(false);
    }
  };

  // Handle start over
  const handleStartOver = () => {
    setSelectedGuidanceId(null);
    setSelectedModuleId(null);
    setQuizTopic('');
  };

  if (guidancesLoading) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Generate Quiz"
          titleProps={{ fw: 700, size: 'h2' }}
          description="Select your learning path and module to create AI-powered quiz questions"
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
          title="Generate Quiz"
          titleProps={{ fw: 700, size: 'h2' }}
          description="Select your learning path and module to create AI-powered quiz questions"
        >
          <Alert icon={<IconAlertCircle size={16} />} title="No Learning Paths Found" color="blue">
            Please create a learning guidance first to generate quiz.
          </Alert>
        </ListPageLayout>
      </Container>
    );
  }

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title="Generate Quiz"
        titleProps={{ fw: 700, size: 'h2' }}
        description="Select your learning path and module to create AI-powered quiz questions"
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

              {/* Quiz Topic */}
              {selectedModule && (
                <Box>
                  <Text fw={500} mb="xs">
                    Quiz Topic
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
                      {quizTopic}
                    </Text>
                  </Paper>
                </Box>
              )}

              {/* Number of Questions */}
              {selectedModule && (
                <Box>
                  <Text fw={500} mb="xs">
                    Number of Questions
                  </Text>
                  <Select
                    placeholder="Select number of questions"
                    data={['3', '5', '10', '15', '20'].map((num) => ({ value: num, label: num }))}
                    value={String(numQuestions)}
                    onChange={(val) => setNumQuestions(Number(val))}
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
                    onClick={handleGenerateQuiz}
                    loading={loading}
                    disabled={!quizTopic.trim() || numQuestions < 1}
                  >
                    Generate Quiz
                  </Button>
                )}
              </Group>
            </Stack>
          </Paper>

          {/* Loading State */}
          {loading && (
            <Stack gap="lg" align="center">
              <Loader size="lg" />
              <Text>Generating quiz questions...</Text>
            </Stack>
          )}

          {/* Recently Created Quizzes */}
          <RecentlyCreatedList
            title="Recently Created Quizzes"
            items={quizzesList.map((quiz) => ({
              id: quiz.id,
              title: quiz.title,
              code: quiz.quiz_code,
              status: quiz.status,
              count: quiz.questions_count,
              createdAt: quiz.created_at,
            }))}
            onItemClick={(item) => navigate(`/quiz/view/${item.id}`)}
            icon={IconHelpCircle}
            countLabel="Questions"
          />
        </Stack>
      </ListPageLayout>
    </Container>
  );
};

export default QuizGenerator;
