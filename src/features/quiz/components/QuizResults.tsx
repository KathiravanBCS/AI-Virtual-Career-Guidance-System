import {
  Box,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconCheck,
  IconRefresh,
  IconTargetArrow,
  IconTrophy,
  IconX,
} from '@tabler/icons-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { QuizResults as QuizResultsType } from '../types';

interface QuizResultsProps {
  results: QuizResultsType;
  onStartNew: () => void;
}

const getScoreConfig = (accuracy: number) => {
  if (accuracy >= 80) return { color: 'green', label: 'Excellent!', emoji: '🏆' };
  if (accuracy >= 60) return { color: 'blue', label: 'Good Job!', emoji: '👍' };
  if (accuracy >= 40) return { color: 'yellow', label: 'Keep Going!', emoji: '💪' };
  return { color: 'red', label: 'Needs Practice', emoji: '📚' };
};

export const QuizResults: React.FC<QuizResultsProps> = ({ results, onStartNew }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const accuracyNum = typeof results.accuracy === 'string' ? parseFloat(results.accuracy) || 0 : (results.accuracy ?? 0);
  const totalQuestions = Number(results.totalQuestions || 0);
  const config = getScoreConfig(accuracyNum);
  const correct = totalQuestions > 0 ? Math.round((accuracyNum / 100) * totalQuestions) : 0;
  const incorrect = Math.max(0, totalQuestions - correct);

  const pieData = [
    { name: 'Correct', value: correct },
    { name: 'Incorrect', value: incorrect },
  ];

  const pieColors = [
    theme.colors.green[isDark ? 4 : 5],
    isDark ? theme.colors.dark[3] : theme.colors.gray[3],
  ];

  return (
    <Stack gap="xl">
      {/* Hero score card */}
      <Paper
        p="xl"
        radius="xl"
        withBorder
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${theme.colors.dark[7]}, ${theme.colors.dark[6]})`
            : `linear-gradient(135deg, ${theme.white}, ${theme.colors.gray[0]})`,
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
          boxShadow: isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.08)',
          textAlign: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Decorative background circle */}
        <Box
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `${theme.colors[config.color][isDark ? 9 : 1]}`,
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />

        <ThemeIcon size={64} radius="xl" variant="light" color={config.color} mb="md" mx="auto">
          <IconTrophy size={32} />
        </ThemeIcon>

        <Text size="4xl" mb="xs" style={{ lineHeight: 1 }}>
          {config.emoji}
        </Text>
        <Title order={2} mb="xs" c={isDark ? theme.colors.gray[0] : theme.colors.gray[9]}>
          {config.label}
        </Title>
        <Text
          size="xl"
          fw={700}
          c={theme.colors[config.color][isDark ? 3 : 6]}
          mb="sm"
        >
          {results.accuracy}% accuracy
        </Text>
        <Text size="sm" c="dimmed">
          {correct} of {results.totalQuestions} questions answered correctly
        </Text>
      </Paper>

      {/* Stats grid */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {/* Score */}
        <Paper
          p="lg"
          radius="xl"
          withBorder
          style={{
            backgroundColor: isDark ? theme.colors[primary][9] : theme.colors[primary][0],
            borderColor: theme.colors[primary][isDark ? 7 : 2],
          }}
        >
          <Group gap="md">
            <ThemeIcon size={44} radius="lg" color={primary} variant="light">
              <IconTargetArrow size={22} />
            </ThemeIcon>
            <Box>
              <Text size="xs" c="dimmed" fw={500} tt="uppercase" style={{ letterSpacing: '0.05em' }}>
                Total Score
              </Text>
              <Title
                order={3}
                c={isDark ? theme.colors[primary][2] : theme.colors[primary][7]}
              >
                {results.score} pts
              </Title>
            </Box>
          </Group>
        </Paper>

        {/* Correct */}
        <Paper
          p="lg"
          radius="xl"
          withBorder
          style={{
            backgroundColor: isDark ? theme.colors.green[9] : theme.colors.green[0],
            borderColor: theme.colors.green[isDark ? 7 : 2],
          }}
        >
          <Group gap="md">
            <ThemeIcon size={44} radius="lg" color="green" variant="light">
              <IconCheck size={22} />
            </ThemeIcon>
            <Box>
              <Text size="xs" c="dimmed" fw={500} tt="uppercase" style={{ letterSpacing: '0.05em' }}>
                Correct
              </Text>
              <Title order={3} c={isDark ? theme.colors.green[2] : theme.colors.green[7]}>
                {correct} / {results.totalQuestions}
              </Title>
            </Box>
          </Group>
        </Paper>

        {/* Wrong */}
        <Paper
          p="lg"
          radius="xl"
          withBorder
          style={{
            backgroundColor: isDark ? theme.colors.red[9] : theme.colors.red[0],
            borderColor: theme.colors.red[isDark ? 7 : 2],
          }}
        >
          <Group gap="md">
            <ThemeIcon size={44} radius="lg" color="red" variant="light">
              <IconX size={22} />
            </ThemeIcon>
            <Box>
              <Text size="xs" c="dimmed" fw={500} tt="uppercase" style={{ letterSpacing: '0.05em' }}>
                Incorrect
              </Text>
              <Title order={3} c={isDark ? theme.colors.red[2] : theme.colors.red[7]}>
                {incorrect} / {results.totalQuestions}
              </Title>
            </Box>
          </Group>
        </Paper>
      </SimpleGrid>

      {/* Pie chart */}
      <Paper
        p="xl"
        radius="xl"
        withBorder
        style={{
          backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
          borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
        }}
      >
        <Title order={4} mb="lg" c={isDark ? theme.colors.gray[0] : theme.colors.gray[9]}>
          Score Breakdown
        </Title>
        <Group justify="center" gap="xl" align="center">
          <Box style={{ width: '180px', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
                    border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                    borderRadius: theme.radius.md,
                    color: isDark ? theme.colors.gray[0] : theme.colors.gray[9],
                    fontSize: '13px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Stack gap="sm">
            {pieData.map((entry, idx) => (
              <Group key={idx} gap="sm">
                <Box
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    backgroundColor: pieColors[idx],
                    flexShrink: 0,
                  }}
                />
                <Text size="sm" c={isDark ? theme.colors.gray[2] : theme.colors.gray[7]}>
                  {entry.name}:{' '}
                  <Text component="span" fw={600} c={isDark ? theme.colors.gray[0] : theme.colors.gray[9]}>
                    {entry.value}
                  </Text>
                </Text>
              </Group>
            ))}
          </Stack>
        </Group>
      </Paper>

      {/* Action */}
      <Group justify="center">
        <Button
          onClick={onStartNew}
          color={primary}
          radius="lg"
          size="md"
          leftSection={<IconRefresh size={18} />}
        >
          Start New Quiz
        </Button>
      </Group>
    </Stack>
  );
};