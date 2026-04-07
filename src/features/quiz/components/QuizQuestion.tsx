import { useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Paper,
  Radio,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck, IconSend, IconX } from '@tabler/icons-react';

import type { DisplayQuestion } from '../types';

interface QuizQuestionProps {
  question: DisplayQuestion;
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
  const isDark = colorScheme === 'dark';
  const primary = theme.primaryColor;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const isCorrect =
    Array.isArray(question.correctAnswer) &&
    JSON.stringify([...selectedAnswers].sort()) ===
      JSON.stringify([...question.correctAnswer].sort());

  const getOptionState = (idx: number) => {
    if (!showResults) return 'default';
    const isSelected = selectedAnswers.includes(idx);
    const correctAnswers = Array.isArray(question.correctAnswer)
      ? question.correctAnswer
      : [question.correctAnswer];
    const isCorrectOption = correctAnswers.includes(idx);
    if (isCorrectOption) return 'correct';
    if (isSelected && !isCorrectOption) return 'wrong';
    return 'default';
  };

  const getOptionStyle = (idx: number) => {
    const state = getOptionState(idx);
    const isSelected = selectedAnswers.includes(idx);
    const isHovered = hoveredIdx === idx && !showResults;

    if (state === 'correct') {
      return {
        backgroundColor: isDark ? theme.colors.green[9] : theme.colors.green[0],
        borderColor: theme.colors.green[isDark ? 6 : 5],
        transform: 'none',
      };
    }
    if (state === 'wrong') {
      return {
        backgroundColor: isDark ? theme.colors.red[9] : theme.colors.red[0],
        borderColor: theme.colors.red[isDark ? 6 : 5],
        transform: 'none',
      };
    }
    if (isSelected) {
      return {
        backgroundColor: isDark ? theme.colors[primary][9] : theme.colors[primary][0],
        borderColor: theme.colors[primary][isDark ? 5 : 5],
        transform: 'none',
      };
    }
    if (isHovered) {
      return {
        backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[0],
        borderColor: theme.colors[primary][isDark ? 6 : 4],
        transform: 'translateX(2px)',
      };
    }
    return {
      backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
      borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
      transform: 'none',
    };
  };

  return (
    <Paper
      p="xl"
      radius="xl"
      withBorder
      style={{
        backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
        borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
        boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <Stack gap="lg">
        {/* Question header */}
        <Box>
          <Group gap="xs" mb="md">
            <Badge variant="light" color={primary} size="sm" radius="sm">
              Question {questionNumber} / {totalQuestions}
            </Badge>
            <Badge variant="light" color="gray" size="sm" radius="sm">
              {question.point} pts
            </Badge>
            {question.questionType === 'multiple' && (
              <Badge variant="light" color="orange" size="sm" radius="sm">
                Multiple answers
              </Badge>
            )}
          </Group>
          <Text
            fw={600}
            size="lg"
            c={isDark ? theme.colors.gray[0] : theme.colors.gray[9]}
            style={{ lineHeight: 1.5 }}
          >
            {question.question}
          </Text>
        </Box>

        {/* Answers */}
        <Stack gap="sm">
          {question.answers?.map((answer, idx) => {
            const state = getOptionState(idx);
            const isSelected = selectedAnswers.includes(idx);
            const optStyle = getOptionStyle(idx);

            return (
              <Box
                key={idx}
                onClick={() => !showResults && onAnswerSelect(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: theme.radius.lg,
                  border: `1.5px solid ${optStyle.borderColor}`,
                  backgroundColor: optStyle.backgroundColor,
                  cursor: showResults ? 'default' : 'pointer',
                  transition: 'all 0.18s ease',
                  transform: optStyle.transform,
                }}
              >
                {/* Option indicator */}
                <Box
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: question.questionType === 'multiple' ? '6px' : '50%',
                    border: `1.5px solid ${
                      state === 'correct'
                        ? theme.colors.green[5]
                        : state === 'wrong'
                        ? theme.colors.red[5]
                        : isSelected
                        ? theme.colors[primary][5]
                        : isDark
                        ? theme.colors.dark[3]
                        : theme.colors.gray[4]
                    }`,
                    backgroundColor:
                      state === 'correct'
                        ? theme.colors.green[5]
                        : state === 'wrong'
                        ? theme.colors.red[5]
                        : isSelected
                        ? theme.colors[primary][5]
                        : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'white',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {state === 'correct' ? (
                    <IconCheck size={14} />
                  ) : state === 'wrong' ? (
                    <IconX size={14} />
                  ) : isSelected ? (
                    <IconCheck size={14} />
                  ) : (
                    <Text size="xs" fw={700} c={isDark ? theme.colors.gray[4] : theme.colors.gray[6]}>
                      {String.fromCharCode(65 + idx)}
                    </Text>
                  )}
                </Box>

                <Text
                  size="sm"
                  fw={isSelected || state !== 'default' ? 500 : 400}
                  c={
                    state === 'correct'
                      ? isDark
                        ? theme.colors.green[2]
                        : theme.colors.green[8]
                      : state === 'wrong'
                      ? isDark
                        ? theme.colors.red[2]
                        : theme.colors.red[8]
                      : isSelected
                      ? isDark
                        ? theme.colors[primary][2]
                        : theme.colors[primary][8]
                      : isDark
                      ? theme.colors.gray[2]
                      : theme.colors.gray[8]
                  }
                  style={{ flex: 1 }}
                >
                  {answer}
                </Text>
              </Box>
            );
          })}
        </Stack>

        {/* Result feedback */}
        {showResults && (
          <Paper
            p="md"
            radius="lg"
            style={{
              backgroundColor: isCorrect
                ? isDark
                  ? `${theme.colors.green[9]}80`
                  : theme.colors.green[0]
                : isDark
                ? `${theme.colors.red[9]}80`
                : theme.colors.red[0],
              border: `1px solid ${isCorrect ? theme.colors.green[isDark ? 7 : 3] : theme.colors.red[isDark ? 7 : 3]}`,
            }}
          >
            <Group gap="xs" mb={question.explanation ? 'xs' : 0}>
              <Box
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: isCorrect ? theme.colors.green[5] : theme.colors.red[5],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isCorrect ? <IconCheck size={12} color="white" /> : <IconX size={12} color="white" />}
              </Box>
              <Text
                fw={600}
                size="sm"
                c={
                  isCorrect
                    ? isDark
                      ? theme.colors.green[3]
                      : theme.colors.green[7]
                    : isDark
                    ? theme.colors.red[3]
                    : theme.colors.red[7]
                }
              >
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </Text>
            </Group>
            {question.explanation && (
              <Text
                size="sm"
                c={isDark ? theme.colors.gray[3] : theme.colors.gray[7]}
                style={{ lineHeight: 1.5 }}
              >
                {question.explanation}
              </Text>
            )}
          </Paper>
        )}

        {/* Navigation */}
        {!showResults && (
          <Group justify="space-between" pt="xs">
            <Button
              onClick={onPrev}
              disabled={questionNumber === 1}
              variant="default"
              radius="lg"
              leftSection={<IconArrowLeft size={16} />}
            >
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={onSubmit}
                color={primary}
                radius="lg"
                leftSection={<IconSend size={16} />}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={onNext}
                color={primary}
                radius="lg"
                rightSection={<IconArrowRight size={16} />}
              >
                Next
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Paper>
  );
};