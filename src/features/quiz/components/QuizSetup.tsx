import {
  Alert,
  Button,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';

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

  return (
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
        {paths.length === 0 && (
          <Alert color="red" title="No Learning Paths Found">
            Create a learning path first to generate quizzes.
          </Alert>
        )}

        <Select
          label="Select Learning Path"
          placeholder="-- Select Learning Path --"
          data={paths.map((p) => ({ value: p.$id, label: p.careerName }))}
          value={selectedPathId}
          onChange={(val) => onPathChange(val || '')}
          disabled={paths.length === 0}
        />

        {modules.length > 0 && (
          <Select
            label="Select Module"
            placeholder="-- Select Module --"
            data={modules.map((m, idx) => ({
              value: idx.toString(),
              label: m.title,
            }))}
            value={selectedModule}
            onChange={(val) => onModuleChange(val || '')}
          />
        )}

        <TextInput
          label="Quiz Topic"
          placeholder="Auto-filled from selected module"
          value={topic}
          readOnly
          style={{
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : 'transparent',
          }}
        />

        <NumberInput
          label="Number of Questions"
          value={numQuestions}
          onChange={(val) => onNumQuestionsChange(typeof val === 'number' ? val : 5)}
          min={1}
          max={10}
        />

        <Button
          onClick={onGenerate}
          color={theme.primaryColor}
          loading={loading}
          disabled={!selectedPathId || !topic || loading}
          fullWidth
        >
          {loading ? 'Generating Quiz...' : 'Generate Quiz'}
        </Button>

        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};
