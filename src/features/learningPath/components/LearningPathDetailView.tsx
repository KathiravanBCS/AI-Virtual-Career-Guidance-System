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
import { IconArrowLeft, IconClock, IconFileText, IconQuestionMark } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import type { GuidanceWithLearningModules } from '@/features/guidance/types';
import { useGetLearningModules } from '@/features/learningModules/api/useGetLearningModules';
import { useUpdateLearningModule } from '@/features/learningModules/api/useUpdateLearningModule';

import ModuleContentCard from './ModuleContentCard';

interface LearningPathDetailViewProps {
  guidance: GuidanceWithLearningModules;
  onBack?: () => void;
}

export const LearningPathDetailView: React.FC<LearningPathDetailViewProps> = ({ guidance, onBack }) => {
  const theme = useMantineTheme();
  const primaryColor = theme.colors[theme.primaryColor]?.[6] || theme.primaryColor;
  const [selectedModuleId, setSelectedModuleId] = useState<number>(guidance.learning_modules[0]?.id || 0);
  const [showContentModal, setShowContentModal] = useState(false);
  const [modalModuleIndex, setModalModuleIndex] = useState(0);
  const [modules, setModules] = useState(guidance.learning_modules);

  const { refetch: refetchModules } = useGetLearningModules();
  const { mutate: updateModule, isPending } = useUpdateLearningModule();

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
                            setModalModuleIndex(moduleIndex);
                            setShowContentModal(true);
                          }}
                        >
                          View Content
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => {
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
                          Mark Complete
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    style={{
                      backgroundColor: primaryColor,
                      color: 'white',
                    }}
                  >
                    Take Quiz
                  </Button>
                </motion.div>
              </motion.div>
            </Stack>
          )}
        </Grid.Col>
      </Grid>

      {/* Content Modal */}
      <Modal
        opened={showContentModal}
        onClose={() => setShowContentModal(false)}
        title={selectedModule?.title}
        size="xl"
        radius="lg"
        fullScreen
      >
        <ModuleContentCard
          moduleTitle={selectedModule?.title || ''}
          moduleIndex={modalModuleIndex}
          moduleId={selectedModule?.id || 0}
          onComplete={async () => {
            await refetchModules();
            if (selectedModule) {
              setModules(
                modules.map((m) =>
                  m.id === selectedModule.id ? { ...m, completion_percentage: 100, status: 'completed' } : m
                )
              );
            }
            setShowContentModal(false);
          }}
        />
      </Modal>
      </ListPageLayout>
      </Container>
      );
      };

export default LearningPathDetailView;
