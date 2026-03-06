import {
  Button,
  Checkbox,
  Group,
  Paper,
  Radio,
  Stack,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';

import { QuizQuestion as QuizQuestionType } from '../types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswers: number[];
  showResults: boolean;
  onAnswerSelect: (answer: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onSubmit?: () => void;
  isLastQuestion: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswers,
  showResults,
  onAnswerSelect,
  onNext,
  onPrev,
  onSubmit,
  isLastQuestion,
}) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isCorrect =
    Array.isArray(question.correctAnswer) &&
    JSON.stringify([...selectedAnswers].sort()) === JSON.stringify([...question.correctAnswer].sort());

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
        {/* Header */}
        <div>
          <Title order={3} mb="xs" c={colorScheme === 'dark' ? theme.colors.gray[0] : 'inherit'}>
            {question.question}
          </Title>
          <Group gap="xs" wrap="nowrap">
            <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors[theme.primaryColor][5] }}>
              Question {questionNumber} of {totalQuestions}
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: colorScheme === 'dark' ? theme.colors.gray[3] : 'inherit',
              }}
            >
              Points: {question.point}
            </span>
          </Group>
        </div>

        {/* Answers */}
        <Stack gap="sm">
          {question.questionType === 'multiple'
            ? // Multiple select
              question.answers.map((answer, idx) => (
                <Checkbox
                  key={idx}
                  label={answer}
                  checked={selectedAnswers.includes(idx)}
                  onChange={() => onAnswerSelect(idx)}
                  disabled={showResults}
                />
              ))
            : // Single select
              question.answers.map((answer, idx) => (
                <Radio
                  key={idx}
                  label={answer}
                  value={idx.toString()}
                  checked={selectedAnswers.includes(idx)}
                  onChange={() => onAnswerSelect(idx)}
                  disabled={showResults}
                />
              ))}
        </Stack>

        {/* Results */}
        {showResults && (
          <Paper
            p="sm"
            radius="md"
            withBorder
            style={{
              backgroundColor: isCorrect
                ? colorScheme === 'dark'
                  ? theme.colors.green[9]
                  : theme.colors.green[0]
                : colorScheme === 'dark'
                  ? theme.colors.red[9]
                  : theme.colors.red[0],
              borderColor: isCorrect ? theme.colors.green[5] : theme.colors.red[5],
            }}
          >
            <div
              style={{
                color: isCorrect
                  ? colorScheme === 'dark'
                    ? theme.colors.green[2]
                    : theme.colors.green[7]
                  : colorScheme === 'dark'
                    ? theme.colors.red[2]
                    : theme.colors.red[7],
              }}
            >
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            {question.explanation && (
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '14px',
                  color: colorScheme === 'dark' ? theme.colors.gray[2] : 'inherit',
                }}
              >
                {question.explanation}
              </div>
            )}
          </Paper>
        )}

        {/* Navigation */}
        <Group justify="space-between">
          {!showResults && (
            <>
              <Button onClick={onPrev} disabled={questionNumber === 1} variant="default" color={theme.primaryColor}>
                Previous
              </Button>

              {isLastQuestion ? (
                <Button onClick={onSubmit} color={theme.primaryColor}>
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={onNext} color={theme.primaryColor}>
                  Next
                </Button>
              )}
            </>
          )}
        </Group>
      </Stack>
    </Paper>
  );
};
