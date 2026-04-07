import { useState } from 'react';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Paper,
  RingProgress,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowLeft, IconBook, IconCheck, IconClock, IconDeviceFloppy, IconTrendingUp } from '@tabler/icons-react';
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

export function LearningPathResults({
  modules,
  careerGoal,
  onBack,
  learningGuidanceId,
}: LearningPathResultsProps) {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const primary = theme.colors[theme.primaryColor][6];
  const primaryLight = theme.colors[theme.primaryColor][0];
  const primaryLightDark = `${theme.colors[theme.primaryColor][8]}40`;

  const [isSaving, setIsSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const createModule = useCreateLearningModule();

  const handleSaveModules = async () => {
    setIsSaving(true);
    setSavedCount(0);
    try {
      const modulesToSave = modules
        .map((module, index) => {
          if (typeof module === 'string') return null;

          let contentObj: any = { keyPoints: [], practicalApplications: [] };

          if (Array.isArray(module.content)) {
            const splitIndex = Math.ceil(module.content.length * 0.8);
            contentObj.keyPoints = module.content.slice(0, splitIndex);
            contentObj.practicalApplications = module.content.slice(splitIndex);
          } else if (typeof module.content === 'string') {
            contentObj.keyPoints = [module.content];
          } else if (typeof module.content === 'object' && module.content !== null) {
            contentObj = module.content;
            if (!contentObj.keyPoints) contentObj.keyPoints = [];
            if (!contentObj.practicalApplications) contentObj.practicalApplications = [];
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

      for (const moduleData of modulesToSave) {
        await createModule.mutateAsync(moduleData);
        setSavedCount((c) => c + 1);
      }

      navigate(`/learning-path/${learningGuidanceId}`);
    } catch (error) {
      console.error('Error saving modules:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const totalModules = modules.length;
  const progressPercent = isSaving ? Math.round((savedCount / totalModules) * 100) : 0;

  if (isSaving) {
    return (
      <Center py="xl" style={{ minHeight: 320 }}>
        <Stack align="center" gap="xl">
          <RingProgress
            size={120}
            thickness={8}
            sections={[{ value: progressPercent, color: primary }]}
            label={
              <Text ta="center" fw={600} size="xl" c={primary}>
                {progressPercent}%
              </Text>
            }
          />
          <Stack align="center" gap={4}>
            <Text fw={500}>Saving your learning path…</Text>
            <Text size="sm" c="dimmed">
              {savedCount} of {totalModules} modules saved
            </Text>
          </Stack>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      {/* Header summary card */}
      <Paper
        radius="lg"
        p="lg"
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${theme.colors[theme.primaryColor][9]}, ${theme.colors[theme.primaryColor][8]})`
            : `linear-gradient(135deg, ${theme.colors[theme.primaryColor][6]}, ${theme.colors[theme.primaryColor][5]})`,
          border: 'none',
        }}
      >
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Text size="xs" fw={500} c="rgba(255,255,255,0.65)" tt="uppercase" style={{ letterSpacing: '0.06em' }}>
              Learning path ready
            </Text>
            <Title order={3} c="white" fw={700}>
              {careerGoal}
            </Title>
            <Group gap="xs" mt={4}>
              <ThemeIcon size="xs" radius="xl" color="rgba(255,255,255,0.2)" variant="filled">
                <IconBook size={10} />
              </ThemeIcon>
              <Text size="sm" c="rgba(255,255,255,0.8)">
                {totalModules} modules generated
              </Text>
            </Group>
          </Stack>
          <Box
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: theme.radius.lg,
              padding: '12px 20px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Text size="xl" fw={700} c="white" ta="center">
              {totalModules}
            </Text>
            <Text size="xs" c="rgba(255,255,255,0.7)" ta="center">
              Modules
            </Text>
          </Box>
        </Group>
      </Paper>

      {/* Module list */}
      <Stack gap="sm">
        {modules.map((module, index) => {
          const isString = typeof module === 'string';
          const title = isString ? module : module.title;
          const description = isString ? undefined : module.description;
          const estimatedTime = isString ? undefined : module.estimatedTime;

          return (
            <Paper
              key={index}
              radius="md"
              p="md"
              withBorder
              style={{
                borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
                background: isDark ? theme.colors.dark[7] : 'white',
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = primary;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${primary}30`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = isDark
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2];
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <Group align="flex-start" gap="md" wrap="nowrap">
                {/* Module number badge */}
                <Box
                  style={{
                    minWidth: 40,
                    height: 40,
                    borderRadius: theme.radius.md,
                    background: isDark ? primaryLightDark : primaryLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Text fw={700} size="sm" c={primary}>
                    {index + 1}
                  </Text>
                </Box>

                {/* Content */}
                <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Text fw={600} size="sm" style={{ flex: 1 }} lineClamp={2}>
                      {title}
                    </Text>
                    <Badge
                      size="xs"
                      variant="light"
                      color={theme.primaryColor}
                      radius="sm"
                      style={{ flexShrink: 0, marginLeft: 8 }}
                    >
                      Module {index + 1}
                    </Badge>
                  </Group>

                  {description && (
                    <Text size="xs" c="dimmed" lineClamp={2}>
                      {description}
                    </Text>
                  )}

                  {estimatedTime && (
                    <Group gap={4} mt={2}>
                      <IconClock size={12} style={{ color: theme.colors.gray[5] }} />
                      <Text size="xs" c="dimmed">
                        {estimatedTime}
                      </Text>
                    </Group>
                  )}
                </Stack>
              </Group>
            </Paper>
          );
        })}
      </Stack>

      {/* Actions */}
      <Paper
        radius="md"
        p="md"
        style={{
          background: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
          border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <IconTrendingUp size={16} style={{ color: theme.colors.gray[5] }} />
            <Text size="sm" c="dimmed">
              Review your path before saving
            </Text>
          </Group>
          <Group gap="sm">
            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconArrowLeft size={16} />}
              onClick={onBack}
              size="sm"
            >
              Back
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleSaveModules}
              loading={isSaving}
              size="sm"
              style={{ background: primary }}
            >
              Save Learning Path
            </Button>
          </Group>
        </Group>
      </Paper>
    </Stack>
  );
}