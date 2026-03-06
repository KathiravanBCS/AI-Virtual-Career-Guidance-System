import {
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';

import { QuizResults as QuizResultsType } from '../types';

interface QuizResultsProps {
  results: QuizResultsType;
  onStartNew: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ results, onStartNew }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Stack gap="lg">
      <Paper
        p="lg"
        radius="lg"
        withBorder
        style={{
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          borderColor: theme.colors.gray[colorScheme === 'dark' ? 7 : 2],
        }}
      >
        <Title order={2} mb="lg" c={colorScheme === 'dark' ? theme.colors.gray[0] : 'inherit'}>
          Quiz Results
        </Title>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md" mb="lg">
          <Paper
            p="md"
            radius="md"
            withBorder
            style={{
              backgroundColor:
                colorScheme === 'dark' ? theme.colors[theme.primaryColor][9] : theme.colors[theme.primaryColor][0],
              borderColor: theme.colors[theme.primaryColor][3],
            }}
          >
            <Text c="dimmed" size="sm">
              Total Score
            </Text>
            <Title
              order={3}
              c={colorScheme === 'dark' ? theme.colors[theme.primaryColor][2] : theme.colors[theme.primaryColor][7]}
            >
              {results.score} / {results.totalQuestions * 10}
            </Title>
          </Paper>

          <Paper
            p="md"
            radius="md"
            withBorder
            style={{
              backgroundColor: colorScheme === 'dark' ? theme.colors.green[9] : theme.colors.green[0],
              borderColor: theme.colors.green[3],
            }}
          >
            <Text c="dimmed" size="sm">
              Accuracy
            </Text>
            <Title order={3} c={colorScheme === 'dark' ? theme.colors.green[2] : theme.colors.green[7]}>
              {results.accuracy}%
            </Title>
          </Paper>

          <Paper
            p="md"
            radius="md"
            withBorder
            style={{
              backgroundColor: colorScheme === 'dark' ? theme.colors.blue[9] : theme.colors.blue[0],
              borderColor: theme.colors.blue[3],
            }}
          >
            <Text c="dimmed" size="sm">
              Questions
            </Text>
            <Title order={3} c={colorScheme === 'dark' ? theme.colors.blue[2] : theme.colors.blue[7]}>
              {results.totalQuestions}
            </Title>
          </Paper>
        </SimpleGrid>

        <Group justify="center">
          <Button onClick={onStartNew} color={theme.primaryColor}>
            Start New Quiz
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
};
