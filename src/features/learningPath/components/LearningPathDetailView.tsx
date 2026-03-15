import { useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconClock,
  IconFiles,
  IconFileText,
  IconHelpCircle,
  IconQuestionMark,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { useGetFlashcardsByModule } from '@/features/flashcards/api';
import { RecentlyCreatedList } from '@/features/flashcards/components';
import type { GuidanceWithLearningModules } from '@/features/guidance/types';
import { useGetLearningModules } from '@/features/learningModules/api/useGetLearningModules';
import { useUpdateLearningModule } from '@/features/learningModules/api/useUpdateLearningModule';
import { useGetQuizzesByModule } from '@/features/quiz/api';
import { RecentlyCreatedList as QuizRecentlyCreatedList } from '@/features/quiz/components';
import useActivityLogger from '@/hooks/useActivityLogger';
import { useNotification } from '@/features/gamification/context/NotificationContext';

interface LearningPathDetailViewProps {
  guidance: GuidanceWithLearningModules;
  onBack?: () => void;
}

export const LearningPathDetailView: React.FC<LearningPathDetailViewProps> = ({ guidance, onBack }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const primaryColor = theme.colors[theme.primaryColor]?.[6] || theme.primaryColor;
  const [selectedModuleId, setSelectedModuleId] = useState<number>(guidance.learning_modules[0]?.id || 0);
  const [showContentModal, setShowContentModal] = useState(false);
  const [modalModuleIndex, setModalModuleIndex] = useState(0);
  const [modules, setModules] = useState(guidance.learning_modules);

  const { refetch: refetchModules } = useGetLearningModules();
  const { mutate: updateModule, isPending } = useUpdateLearningModule();
  const { showNotification } = useNotification();
  const { logModuleComplete } = useActivityLogger({
    showNotification,
  });

  // Fetch flashcards for selected module
  const { data: flashcardsResponse } = useGetFlashcardsByModule(selectedModuleId);
  const flashcardsList = Array.isArray(flashcardsResponse) ? flashcardsResponse : flashcardsResponse?.data || [];

  // Fetch quizzes for selected module
  const { data: quizzesResponse } = useGetQuizzesByModule(selectedModuleId);
  const quizzesList = Array.isArray(quizzesResponse) ? quizzesResponse : quizzesResponse?.data || [];

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title={guidance.career_goal}
        titleProps={{ fw: 700, size: 'h2' }}
        description={`By ${guidance.name} • Age ${guidance.age}`}
        actions={
          onBack && (
            <Button variant="light" size="sm" leftSection={<IconArrowLeft size={16} />} onClick={onBack}>
              Back
            </Button>
          )
        }
      >
        <Grid gutter="lg">
          {/* Left Sidebar - Module List */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: `rgba(255, 255, 255, 0.7)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid rgba(0, 0, 0, 0.05)`,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Title
                order={4}
                mb="md"
                style={{
                  color: primaryColor,
                }}
              >
                Career Modules
              </Title>
              <ScrollArea>
                <Stack gap="sm">
                  {modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedModuleId(module.id)}
                      style={{
                        background: selectedModuleId === module.id ? `${primaryColor}15` : `rgba(0, 0, 0, 0.02)`,
                        border: `1.5px solid ${selectedModuleId === module.id ? primaryColor : 'rgba(0, 0, 0, 0.1)'}`,
                        borderRadius: '12px',
                        padding: '12px',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                      }}
                    >
                      <Group gap="md" wrap="nowrap">
                        <ThemeIcon
                          variant={selectedModuleId === module.id ? 'filled' : 'light'}
                          size="lg"
                          radius="md"
                          style={{
                            backgroundColor: selectedModuleId === module.id ? primaryColor : 'rgba(0, 0, 0, 0.05)',
                            color: selectedModuleId === module.id ? 'white' : primaryColor,
                          }}
                        >
                          <Text fw={600} size="sm">
                            {index + 1}
                          </Text>
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                          <Text size="sm" fw={500} lineClamp={2} style={{ color: '#222' }}>
                            {module.title}
                          </Text>
                        </div>
                      </Group>
                    </motion.div>
                  ))}
                </Stack>
              </ScrollArea>
            </motion.div>
          </Grid.Col>

          {/* Right Content - Module Details */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            {selectedModule && (
              <Stack gap="lg">
                {/* Module Metadata */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: `rgba(255, 255, 255, 0.7)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid rgba(0, 0, 0, 0.05)`,
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Grid gutter="md">
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <div>
                        <Text size="xs" fw={500} style={{ color: '#666' }}>
                          Module Code
                        </Text>
                        <Text size="sm" fw={600} style={{ color: '#222' }}>
                          {selectedModule.learning_module_code}
                        </Text>
                      </div>
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <div>
                        <Text size="xs" fw={500} style={{ color: '#666' }}>
                          Status
                        </Text>
                        <Badge
                          variant="light"
                          size="sm"
                          style={{
                            backgroundColor: `${primaryColor}20`,
                            color: primaryColor,
                            border: `1px solid ${primaryColor}`,
                          }}
                        >
                          {selectedModule.status}
                        </Badge>
                      </div>
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <div>
                        <Text size="xs" fw={500} style={{ color: '#666' }}>
                          Module Order
                        </Text>
                        <Text size="sm" fw={600} style={{ color: primaryColor }}>
                          {selectedModule.module_order + 1}
                        </Text>
                      </div>
                    </Grid.Col>
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <div>
                        <Text size="xs" fw={500} style={{ color: '#666' }}>
                          Progress
                        </Text>
                        <Text size="sm" fw={600} style={{ color: primaryColor }}>
                          {selectedModule.completion_percentage}%
                        </Text>
                      </div>
                    </Grid.Col>
                  </Grid>
                </motion.div>

                {/* Module Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{
                    background: `rgba(255, 255, 255, 0.7)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid rgba(0, 0, 0, 0.05)`,
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Stack gap="md">
                    <Group justify="space-between" align="flex-start">
                      <div style={{ flex: 1 }}>
                        <Title order={3} style={{ color: primaryColor }}>
                          {selectedModule.title}
                        </Title>
                        <Group gap="sm" mt="xs">
                          <Group gap={4} style={{ color: '#666' }}>
                            <IconClock size={16} />
                            <Text size="sm">{selectedModule.estimated_time}</Text>
                          </Group>
                          {selectedModule.completion_percentage > 0 && (
                            <Badge variant="dot" size="sm" style={{ backgroundColor: primaryColor, color: 'white' }}>
                              {selectedModule.completion_percentage}% Complete
                            </Badge>
                          )}
                        </Group>
                      </div>
                      <Group gap="sm">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            style={{
                              backgroundColor: 'rgba(0, 0, 0, 0.05)',
                              color: '#333',
                              border: `1px solid rgba(0, 0, 0, 0.1)`,
                            }}
                            onClick={() => {
                              const moduleIndex = guidance.learning_modules.findIndex((m) => m.id === selectedModuleId);
                              navigate(`/learning-path/${guidance.id}/module/${moduleIndex}`);
                            }}
                          >
                            View Content
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={async () => {
                              if (selectedModule) {
                                updateModule(
                                  {
                                    moduleId: selectedModule.id,
                                    data: {
                                      completion_percentage: 100,
                                      status: 'completed',
                                    },
                                  },
                                  {
                                    onSuccess: async () => {
                                      setModules(
                                        modules.map((m) =>
                                          m.id === selectedModule.id
                                            ? { ...m, completion_percentage: 100, status: 'completed' }
                                            : m
                                        )
                                      );
                                      await refetchModules();
                                      // Log module completion for points
                                      await logModuleComplete(selectedModule.id);
                                    },
                                  }
                                );
                              }
                            }}
                            disabled={selectedModule?.completion_percentage === 100}
                            loading={isPending}
                            style={{
                              backgroundColor: primaryColor,
                              color: 'white',
                            }}
                          >
                            {selectedModule?.completion_percentage === 100 ? '✓ Completed' : 'Mark Complete'}
                          </Button>
                        </motion.div>
                      </Group>
                    </Group>
                  </Stack>
                </motion.div>

                {/* Description Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{
                    background: `rgba(255, 255, 255, 0.7)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid rgba(0, 0, 0, 0.05)`,
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Group gap="sm" mb="md">
                    <IconFileText size={20} style={{ color: primaryColor }} />
                    <Title order={4} style={{ color: primaryColor }}>
                      Description
                    </Title>
                  </Group>
                  <Text style={{ whiteSpace: 'pre-wrap', color: '#555' }}>{selectedModule.description}</Text>
                  {selectedModule.content && selectedModule.content.content ? (
                    <Box
                      mt="md"
                      p="md"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        border: `1px solid rgba(0, 0, 0, 0.1)`,
                        borderRadius: '12px',
                      }}
                    >
                      <Text size="sm" style={{ whiteSpace: 'pre-wrap', color: '#666' }}>
                        {typeof selectedModule.content.content === 'string'
                          ? selectedModule.content.content
                          : JSON.stringify(selectedModule.content.content)}
                      </Text>
                    </Box>
                  ) : null}
                </motion.div>

                {/* Knowledge Check Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{
                    background: `rgba(255, 255, 255, 0.7)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid rgba(0, 0, 0, 0.05)`,
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Group gap="sm" mb="md">
                    <IconQuestionMark size={20} style={{ color: primaryColor }} />
                    <Title order={4} style={{ color: primaryColor }}>
                      Knowledge Check
                    </Title>
                  </Group>
                  <Text mb="lg" style={{ color: '#555' }}>
                    Test your knowledge of this module with a quick quiz.
                  </Text>
                  <Group gap="md">
                    <Button
                      onClick={() => {
                        const moduleIndex = guidance.learning_modules.findIndex((m) => m.id === selectedModuleId);
                        navigate(`/quiz`, {
                          state: {
                            selectedPathId: guidance.id,
                            selectedModuleIndex: moduleIndex,
                            from: {
                              pathname: window.location.pathname,
                              hash: window.location.hash,
                            },
                          },
                        });
                      }}
                      style={{
                        backgroundColor: primaryColor,
                        color: 'white',
                      }}
                    >
                      Take Quiz
                    </Button>
                    <Button
                      onClick={() => {
                        const moduleIndex = guidance.learning_modules.findIndex((m) => m.id === selectedModuleId);
                        navigate(`/flashcards/generate`, {
                          state: {
                            selectedPathId: guidance.id,
                            selectedModuleIndex: moduleIndex,
                            from: {
                              pathname: window.location.pathname,
                              hash: window.location.hash,
                            },
                          },
                        });
                      }}
                      variant="light"
                      style={{
                        color: primaryColor,
                        borderColor: `${primaryColor}40`,
                      }}
                    >
                      Generate Flashcards
                    </Button>
                  </Group>
                </motion.div>

                {/* Flashcards Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <RecentlyCreatedList
                    title={`Flashcards`}
                    items={flashcardsList.map((fc) => ({
                      id: fc.id,
                      title: fc.title,
                      code: fc.flashcard_code,
                      status: fc.status,
                      count: fc.items_count,
                      createdAt: fc.created_at,
                    }))}
                    onItemClick={(item) =>
                      navigate(`/flashcards/view/${item.id}`, {
                        state: {
                          from: {
                            pathname: window.location.pathname,
                            hash: window.location.hash,
                          },
                        },
                      })
                    }
                    icon={IconFiles}
                    countLabel="Items"
                    emptyMessage="No flashcards created for this module yet. Click 'Generate Flashcards' to create some."
                  />
                </motion.div>

                {/* Quizzes Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <QuizRecentlyCreatedList
                    title={`Quizzes`}
                    items={quizzesList.map((quiz) => ({
                      id: quiz.id,
                      title: quiz.title,
                      code: quiz.quiz_code,
                      status: quiz.status,
                      count: quiz.questions_count,
                      createdAt: quiz.created_at,
                    }))}
                    onItemClick={(item) =>
                      navigate(`/quiz/view/${item.id}`, {
                        state: {
                          from: {
                            pathname: window.location.pathname,
                            hash: window.location.hash,
                          },
                        },
                      })
                    }
                    icon={IconHelpCircle}
                    countLabel="Questions"
                    emptyMessage="No quizzes created for this module yet. Click 'Generate Quiz' to create some."
                  />
                </motion.div>
              </Stack>
            )}
          </Grid.Col>
        </Grid>
      </ListPageLayout>
    </Container>
  );
};

export default LearningPathDetailView;
