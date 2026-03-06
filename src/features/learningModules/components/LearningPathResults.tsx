import { useState } from 'react';

import { Badge, Box, Button, Center, Group, Loader, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconBook, IconTrendingUp } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { useCreateLearningModule } from '../api/useCreateLearningModule';
import type { CreateLearningModuleRequest } from '../types';

interface LearningModule {
  title: string;
  description?: string;
  estimatedTime?: string;
  content?: any;
}

interface LearningPathResultsProps {
  modules: (LearningModule | string)[];
  careerGoal: string;
  onBack: () => void;
  learningGuidanceId: number;
}

export function LearningPathResults({ modules, careerGoal, onBack, learningGuidanceId }: LearningPathResultsProps) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const createModule = useCreateLearningModule();

  const handleSaveModules = async () => {
    setIsSaving(true);
    try {
      // Filter out string modules and save only LearningModule objects
      const modulesToSave = modules
        .map((module, index) => {
          if (typeof module === 'string') return null;

          // Convert content to proper object format
          let contentObj: any = {};
          if (typeof module.content === 'string') {
            // Parse string content into object structure
            contentObj = {
              description: module.description || '',
              content: module.content,
            };
          } else if (typeof module.content === 'object') {
            contentObj = module.content;
          } else {
            contentObj = {
              title: module.title,
              description: module.description || '',
            };
          }

          const payload: CreateLearningModuleRequest = {
            title: module.title,
            description: module.description || '',
            estimated_time: module.estimatedTime || '',
            content: contentObj,
            module_order: index,
            completion_percentage: 0,
            learning_guidance_id: learningGuidanceId,
          };

          return payload;
        })
        .filter(Boolean) as CreateLearningModuleRequest[];

      // Create all modules
      for (const moduleData of modulesToSave) {
        await createModule.mutateAsync(moduleData);
      }

      // Navigate to learning paths page after successful save
      navigate(`/learning-path/${learningGuidanceId}`);
    } catch (error) {
      console.error('Error saving modules:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Loader />
          <Text>Saving learning modules...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          {modules.map((module, index) => {
            const isString = typeof module === 'string';
            const title = isString ? module : module.title;
            const description = isString ? undefined : module.description;
            const estimatedTime = isString ? undefined : module.estimatedTime;

            return (
              <Paper
                key={index}
                p="md"
                radius="md"
                withBorder
                style={{
                  transition: 'all 0.2s ease',
                }}
              >
                <Group justify="space-between" align="flex-start" mb="xs">
                  <Group align="flex-start" flex={1}>
                    <ThemeIcon size="lg" radius="md" variant="light">
                      <IconBook size={20} />
                    </ThemeIcon>
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Group justify="space-between" align="center">
                        <Text fw={600} size="sm">
                          {title}
                        </Text>
                        <Badge size="sm" variant="light">
                          Module {index + 1}
                        </Badge>
                      </Group>
                      {description && (
                        <Text size="sm" c="dimmed">
                          {description}
                        </Text>
                      )}
                      {estimatedTime && (
                        <Group gap="xs">
                          <IconTrendingUp size={14} />
                          <Text size="xs" c="dimmed">
                            Est. {estimatedTime}
                          </Text>
                        </Group>
                      )}
                    </Stack>
                  </Group>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      </Paper>

      <Group justify="space-between">
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSaveModules} loading={isSaving}>
          Save Learning Path
        </Button>
      </Group>
    </Stack>
  );
}
