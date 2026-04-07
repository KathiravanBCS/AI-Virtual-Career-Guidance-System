import { useEffect, useState } from 'react';

import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconBooks,
  IconBrain,
  IconHelpCircle,
  IconListCheck,
  IconSparkles,
  IconWand,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import groqConfig from '@/config/groq.config';
import { useGetGuidancesWithModules } from '@/features/learningPath/api/useGetGuidancesWithModules';

import { useGetQuizzes } from '../api';
import { RecentlyCreatedList } from './RecentlyCreatedList';

export const QuizGenerator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const { data: guidances = [], isLoading: guidancesLoading } = useGetGuidancesWithModules();
  const { data: quizzesResponse } = useGetQuizzes();

  const quizzesList = Array.isArray(quizzesResponse) ? quizzesResponse : quizzesResponse?.data || [];

  const [selectedGuidanceId, setSelectedGuidanceId] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [quizTopic, setQuizTopic] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navState.selectedPathId && guidances.length > 0 && !selectedGuidanceId) {
      const pathIdNum = parseInt(navState.selectedPathId.toString(), 10);
      const guidanceToSelect = guidances.find((g) => g.id === pathIdNum);
      if (guidanceToSelect) {
        setSelectedGuidanceId(guidanceToSelect.id);
        if (navState.selectedModuleIndex !== undefined && navState.selectedModuleIndex >= 0) {
          const module = guidanceToSelect.learning_modules?.[navState.selectedModuleIndex];
          if (module) {
            setSelectedModuleId(module.id);
            setQuizTopic(module.title);
          }
        }
      }
    }
  }, [navState.selectedPathId, navState.selectedModuleIndex, guidances, selectedGuidanceId]);

  const selectedGuidance = guidances.find((g) => g.id === selectedGuidanceId);
  const modules = selectedGuidance?.learning_modules || [];
  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  const guidanceOptions = guidances.map((guidance) => ({
    value: String(guidance.id),
    label: `${guidance.name} — ${guidance.career_goal}`,
  }));

  const moduleOptions =
    modules.length > 0
      ? modules.map((module) => ({ value: String(module.id), label: module.title }))
      : [];

  const handleGuidanceChange = (guidanceId: string | null) => {
    if (guidanceId) {
      setSelectedGuidanceId(Number(guidanceId));
      setSelectedModuleId(null);
      setQuizTopic('');
    }
  };

  const handleModuleChange = (moduleId: string | null) => {
    if (moduleId && modules) {
      const module = modules.find((m) => m.id === Number(moduleId));
      if (module) {
        setSelectedModuleId(Number(moduleId));
        setQuizTopic(module.title);
      }
    }
  };

  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim() || numQuestions < 1) {
      setError('Please select a module to generate a quiz');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const generatedQuiz = await groqConfig.generateQuizData(
        quizTopic,
        numQuestions,
        selectedModule?.description || ''
      );
      navigate('/quiz/display', {
        state: {
          quiz: generatedQuiz,
          topic: generatedQuiz.topic || quizTopic,
          moduleName: selectedModule?.title,
          learning_module_id: selectedModuleId,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setSelectedGuidanceId(null);
    setSelectedModuleId(null);
    setQuizTopic('');
    setError(null);
  };

  const stepComplete = (step: number) => {
    if (step === 1) return !!selectedGuidanceId;
    if (step === 2) return !!selectedModuleId;
    return false;
  };

  if (guidancesLoading) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Generate Quiz"
          titleProps={{ fw: 700, size: 'h2' }}
          description="Select your learning path and module to create AI-powered quiz questions"
        >
          <Stack gap="xl" align="center" py="xl">
            <Loader size="lg" color={primary} />
            <Text c="dimmed">Loading your learning paths...</Text>
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
          <Paper p="xl" radius="xl" withBorder style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
            <ThemeIcon size={56} radius="xl" variant="light" color={primary} mb="md">
              <IconBrain size={28} />
            </ThemeIcon>
            <Title order={4} mb="xs">No Learning Paths Found</Title>
            <Text c="dimmed" size="sm">Create a learning guidance first to generate quizzes.</Text>
          </Paper>
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
        <Stack gap="xl">
          {/* Main config card */}
          <Paper
            p="xl"
            radius="xl"
            withBorder
            style={{
              backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <Stack gap="lg">
              {/* Header */}
              <Group gap="sm">
                <ThemeIcon size={40} radius="lg" variant="light" color={primary}>
                  <IconListCheck size={20} />
                </ThemeIcon>
                <Box>
                  <Text fw={600} size="md">Configure Your Quiz</Text>
                  <Text size="xs" c="dimmed">Choose a path and module to auto-generate questions</Text>
                </Box>
              </Group>

              <Divider />

              {/* Step 1 */}
              <Box>
                <Group gap="xs" mb="xs">
                  <Badge
                    variant={stepComplete(1) ? 'filled' : 'light'}
                    color={stepComplete(1) ? 'green' : primary}
                    size="sm"
                    radius="sm"
                  >
                    Step 1
                  </Badge>
                  <Text fw={500} size="sm">Select Learning Path</Text>
                </Group>
                <Select
                  placeholder="Choose your learning path..."
                  data={guidanceOptions}
                  value={selectedGuidanceId ? String(selectedGuidanceId) : null}
                  onChange={handleGuidanceChange}
                  clearable
                  searchable
                  leftSection={<IconBooks size={16} />}
                  styles={{
                    input: {
                      borderRadius: theme.radius.lg,
                      borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
                    },
                  }}
                />
              </Box>

              {/* Step 2 */}
              {selectedGuidance && modules.length > 0 && (
                <Box>
                  <Group gap="xs" mb="xs">
                    <Badge
                      variant={stepComplete(2) ? 'filled' : 'light'}
                      color={stepComplete(2) ? 'green' : primary}
                      size="sm"
                      radius="sm"
                    >
                      Step 2
                    </Badge>
                    <Text fw={500} size="sm">Select Module</Text>
                  </Group>
                  <Select
                    placeholder="Choose a module..."
                    data={moduleOptions}
                    value={selectedModuleId ? String(selectedModuleId) : null}
                    onChange={handleModuleChange}
                    clearable
                    searchable
                    leftSection={<IconHelpCircle size={16} />}
                    styles={{
                      input: {
                        borderRadius: theme.radius.lg,
                        borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
                      },
                    }}
                  />
                </Box>
              )}

              {selectedGuidance && modules.length === 0 && (
                <Alert icon={<IconAlertCircle size={16} />} title="No Modules Available" color="yellow" radius="lg">
                  This learning path doesn't have any modules yet.
                </Alert>
              )}

              {/* Topic preview */}
              {selectedModule && (
                <Box>
                  <Group gap="xs" mb="xs">
                    <Badge variant="light" color={primary} size="sm" radius="sm">Topic</Badge>
                    <Text fw={500} size="sm">Quiz Topic</Text>
                  </Group>
                  <Paper
                    p="sm"
                    radius="lg"
                    style={{
                      background: isDark
                        ? `linear-gradient(135deg, ${theme.colors[primary][9]}, ${theme.colors[primary][8]})`
                        : `linear-gradient(135deg, ${theme.colors[primary][0]}, ${theme.colors[primary][1]})`,
                      border: `1px solid ${theme.colors[primary][isDark ? 7 : 2]}`,
                    }}
                  >
                    <Group gap="xs">
                      <IconSparkles size={16} color={theme.colors[primary][isDark ? 3 : 6]} />
                      <Text fw={500} c={isDark ? theme.colors[primary][2] : theme.colors[primary][7]} size="sm">
                        {quizTopic}
                      </Text>
                    </Group>
                  </Paper>
                </Box>
              )}

              {/* Step 3: Number of questions */}
              {selectedModule && (
                <Box>
                  <Group gap="xs" mb="xs">
                    <Badge variant="light" color={primary} size="sm" radius="sm">Step 3</Badge>
                    <Text fw={500} size="sm">Number of Questions</Text>
                  </Group>
                  <Group gap="sm">
                    {[3, 5, 10, 15, 20].map((n) => (
                      <Button
                        key={n}
                        size="sm"
                        radius="lg"
                        variant={numQuestions === n ? 'filled' : 'light'}
                        color={primary}
                        onClick={() => setNumQuestions(n)}
                        style={{ minWidth: '52px' }}
                      >
                        {n}
                      </Button>
                    ))}
                  </Group>
                </Box>
              )}

              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  radius="lg"
                  onClose={() => setError(null)}
                  withCloseButton
                >
                  {error}
                </Alert>
              )}

              {/* Actions */}
              <Group justify="space-between" pt="xs">
                <Button variant="subtle" color="gray" onClick={handleStartOver} size="sm">
                  Clear
                </Button>
                {selectedModule && (
                  <Button
                    color={primary}
                    onClick={handleGenerateQuiz}
                    loading={loading}
                    disabled={!quizTopic.trim()}
                    radius="lg"
                    rightSection={!loading && <IconWand size={16} />}
                    size="md"
                  >
                    {loading ? 'Generating...' : `Generate ${numQuestions} Questions`}
                  </Button>
                )}
              </Group>
            </Stack>
          </Paper>

          {/* Loading overlay */}
          {loading && (
            <Paper
              p="xl"
              radius="xl"
              withBorder
              style={{
                textAlign: 'center',
                borderColor: theme.colors[primary][isDark ? 7 : 2],
                background: isDark
                  ? `${theme.colors[primary][9]}30`
                  : `${theme.colors[primary][0]}`,
              }}
            >
              <Loader size="md" color={primary} mb="md" />
              <Text fw={500} c={isDark ? theme.colors[primary][2] : theme.colors[primary][7]}>
                Crafting your quiz questions...
              </Text>
              <Text size="xs" c="dimmed" mt={4}>This may take a few seconds</Text>
            </Paper>
          )}

          {/* Recently Created */}
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