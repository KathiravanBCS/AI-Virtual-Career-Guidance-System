import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconAlertCircle, IconBooks, IconHelpCircle, IconListNumbers, IconSparkles, IconWand } from '@tabler/icons-react';

import { LearningPath } from '../types';

interface QuizSetupProps {
  selectedPathId: string;
  paths: LearningPath[];
  selectedModule: string;
  modules: Array<{ title: string }>;
  topic: string;
  numQuestions: number;
  loading: boolean;
  error?: string | null;
  onPathChange: (pathId: string) => void;
  onModuleChange: (module: string) => void;
  onNumQuestionsChange: (num: number) => void;
  onGenerate: () => void;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({
  selectedPathId,
  paths,
  selectedModule,
  modules,
  topic,
  numQuestions,
  loading,
  error,
  onPathChange,
  onModuleChange,
  onNumQuestionsChange,
  onGenerate,
}) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const stepComplete = (step: number) => {
    if (step === 1) return !!selectedPathId;
    if (step === 2) return !!selectedModule;
    return false;
  };

  return (
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
            <IconListNumbers size={20} />
          </ThemeIcon>
          <Box>
            <Text fw={600} size="md">Configure Your Quiz</Text>
            <Text size="xs" c="dimmed">Choose a path and module to auto-generate questions</Text>
          </Box>
        </Group>

        <Divider />

        {/* No paths warning */}
        {paths.length === 0 && (
          <Alert icon={<IconAlertCircle size={16} />} color="blue" radius="lg" title="No Learning Paths Found">
            Create a learning path first to generate quizzes.
          </Alert>
        )}

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
            data={paths.map((p) => ({ value: p.$id, label: p.careerName }))}
            value={selectedPathId || null}
            onChange={(val) => onPathChange(val || '')}
            disabled={paths.length === 0}
            leftSection={<IconBooks size={16} />}
            clearable
            searchable
            styles={{
              input: {
                borderRadius: theme.radius.lg,
                borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
              },
            }}
          />
        </Box>

        {/* Step 2 */}
        {modules.length > 0 && (
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
              data={modules.map((m, idx) => ({ value: idx.toString(), label: m.title }))}
              value={selectedModule || null}
              onChange={(val) => onModuleChange(val || '')}
              leftSection={<IconHelpCircle size={16} />}
              clearable
              styles={{
                input: {
                  borderRadius: theme.radius.lg,
                  borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
                },
              }}
            />
          </Box>
        )}

        {/* Topic preview */}
        {topic && (
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
                  {topic}
                </Text>
              </Group>
            </Paper>
          </Box>
        )}

        {/* Number of questions */}
        {topic && (
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
                  onClick={() => onNumQuestionsChange(n)}
                  style={{ minWidth: '52px' }}
                >
                  {n}
                </Button>
              ))}
            </Group>
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" radius="lg">
            {error}
          </Alert>
        )}

        {/* Generate button */}
        <Button
          onClick={onGenerate}
          color={primary}
          loading={loading}
          disabled={!selectedPathId || !topic || loading}
          radius="lg"
          size="md"
          fullWidth
          rightSection={!loading && <IconWand size={16} />}
        >
          {loading ? 'Generating Quiz...' : `Generate ${numQuestions} Questions`}
        </Button>
      </Stack>
    </Paper>
  );
};