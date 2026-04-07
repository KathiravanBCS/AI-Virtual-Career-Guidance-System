import { useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Center,
  Group,
  Progress,
  RingProgress,
  Stack,
  Text,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconArrowRight,
  IconBulb,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

import { containerVariants, itemVariants } from '../../animations/formAnimations';

interface AssessmentAnswers {
  [key: number]: string;
}

interface AssessmentStepProps {
  answers: AssessmentAnswers;
  onAnswersChange: (answers: AssessmentAnswers) => void;
}

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: 'What kind of activity makes you feel most engaged?',
    options: [
      { label: 'A', text: 'Solving puzzles or figuring out how things work' },
      { label: 'B', text: 'Creating something new or expressing ideas' },
      { label: 'C', text: 'Planning, organising, or making decisions' },
      { label: 'D', text: 'Performing or presenting in front of others' },
      { label: 'E', text: 'Supporting, guiding, or helping people' },
    ],
  },
  {
    id: 2,
    question: 'When you have free time, what do you enjoy doing most?',
    options: [
      { label: 'A', text: 'Learning new facts or skills' },
      { label: 'B', text: 'Writing, drawing, or creating content' },
      { label: 'C', text: 'Thinking about goals, money, or future plans' },
      { label: 'D', text: 'Singing, dancing, acting, or entertaining' },
      { label: 'E', text: 'Volunteering, mentoring, or listening to others' },
    ],
  },
  {
    id: 3,
    question: 'In a group activity, what role do you naturally take?',
    options: [
      { label: 'A', text: 'Problem solver' },
      { label: 'B', text: 'Idea creator' },
      { label: 'C', text: 'Organiser or leader' },
      { label: 'D', text: 'Performer or speaker' },
      { label: 'E', text: 'Helper or coordinator' },
    ],
  },
  {
    id: 4,
    question: 'What do people often praise you for?',
    options: [
      { label: 'A', text: 'Thinking clearly and logically' },
      { label: 'B', text: 'Imagination and originality' },
      { label: 'C', text: 'Confidence and leadership' },
      { label: 'D', text: 'Energy and expression' },
      { label: 'E', text: 'Kindness and understanding' },
    ],
  },
  {
    id: 5,
    question: 'Which task would you enjoy the most?',
    options: [
      { label: 'A', text: 'Analysing a problem and finding a solution' },
      { label: 'B', text: 'Designing or creating something meaningful' },
      { label: 'C', text: 'Managing people or resources' },
      { label: 'D', text: 'Entertaining or inspiring an audience' },
      { label: 'E', text: "Making a positive difference in someone's life" },
    ],
  },
  {
    id: 6,
    question: 'What type of stories or content attract you most?',
    options: [
      { label: 'A', text: 'Mysteries, discoveries, or "how it works" stories' },
      { label: 'B', text: 'Emotional, artistic, or creative stories' },
      { label: 'C', text: 'Success stories, leadership journeys' },
      { label: 'D', text: 'Music, dance, or performance stories' },
      { label: 'E', text: 'Real-life stories about helping or change' },
    ],
  },
  {
    id: 7,
    question: 'Which environment would you feel most comfortable working in?',
    options: [
      { label: 'A', text: 'Quiet and focused' },
      { label: 'B', text: 'Creative and flexible' },
      { label: 'C', text: 'Fast-paced and goal-driven' },
      { label: 'D', text: 'Lively and expressive' },
      { label: 'E', text: 'Caring and people-focused' },
    ],
  },
  {
    id: 8,
    question: 'How do you prefer to express yourself?',
    options: [
      { label: 'A', text: 'Through thinking and reasoning' },
      { label: 'B', text: 'Through words, art, or visuals' },
      { label: 'C', text: 'Through planning and decision-making' },
      { label: 'D', text: 'Through voice, movement, or performance' },
      { label: 'E', text: 'Through empathy and support' },
    ],
  },
  {
    id: 9,
    question: 'Which skill would you like to develop more?',
    options: [
      { label: 'A', text: 'Critical thinking' },
      { label: 'B', text: 'Creativity' },
      { label: 'C', text: 'Leadership' },
      { label: 'D', text: 'Confidence on stage' },
      { label: 'E', text: 'Emotional intelligence' },
    ],
  },
  {
    id: 10,
    question: 'What kind of work would make you feel most fulfilled?',
    options: [
      { label: 'A', text: 'Solving important problems' },
      { label: 'B', text: 'Creating meaningful ideas' },
      { label: 'C', text: 'Leading and achieving goals' },
      { label: 'D', text: 'Inspiring people through performance' },
      { label: 'E', text: 'Helping others grow or heal' },
    ],
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.15 },
    },
  }),
};

export function ModernAssessmentStep({ answers, onAnswersChange }: AssessmentStepProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const primary6 = theme.colors[theme.primaryColor][6];
  const primary2 = theme.colors[theme.primaryColor][isDark ? 8 : 1];

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progressPercent = (answeredCount / totalQuestions) * 100;
  const isAnswered = Boolean(answers[currentQuestion.id]);
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;

  const navigate = (delta: number) => {
    setDirection(delta);
    setCurrentIndex((prev) => Math.min(Math.max(prev + delta, 0), totalQuestions - 1));
  };

  const handleAnswerSelect = (optionText: string) => {
    onAnswersChange({ ...answers, [currentQuestion.id]: optionText });
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/*
       * Compact layout: everything in one column, tight gaps.
       * Max-height = viewport minus stepper (~80px) minus outer padding (~32px).
       * We use a flex column so the question card gets remaining space.
       */}
      <Stack gap={0}>

        {/* ── Compact header row ── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 6 }}>
          <Group justify="space-between" align="center" wrap="nowrap">
            {/* Title + subtitle */}
            <Box style={{ borderLeft: `3px solid ${primary6}`, paddingLeft: 10 }}>
              <Text fw={700} size="md" c={`${theme.primaryColor}.6`} lh={1.2}>
                Career Assessment
              </Text>
              <Text size="xs" c="dimmed" lh={1.3}>
                Discover your strengths and working style
              </Text>
            </Box>

            {/* Compact ring progress */}
            <RingProgress
              size={52}
              thickness={4}
              roundCaps
              sections={[{ value: progressPercent, color: theme.primaryColor }]}
              label={
                <Center>
                  <Text size="10px" fw={700} c={`${theme.primaryColor}.6`}>
                    {answeredCount}/{totalQuestions}
                  </Text>
                </Center>
              }
            />
          </Group>
        </motion.div>

        {/* ── Slim progress bar ── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 8 }}>
          <Progress
            value={progressPercent}
            color={theme.primaryColor}
            radius="xl"
            size={4}
            animated={progressPercent > 0 && progressPercent < 100}
          />
        </motion.div>

        {/* ── Question card (flex-grow to fill remaining space) ── */}
        <motion.div
          variants={itemVariants}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{}}
            >
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: `1.5px solid ${isDark ? theme.colors.gray[7] : theme.colors.gray[2]}`,
                  backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                }}
              >
                {/* Q badge + question text */}
                <Box mb={10}>
                  <Group gap={6} mb={5} align="center">
                    <Badge
                      variant="filled"
                      color={theme.primaryColor}
                      radius="sm"
                      size="xs"
                      style={{ fontSize: 10 }}
                    >
                      Question {currentIndex + 1}
                    </Badge>
                    {isAnswered && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Badge
                          variant="light"
                          color="green"
                          radius="sm"
                          size="xs"
                          leftSection={<IconCheck size={9} />}
                          style={{ fontSize: 10 }}
                        >
                          Answered
                        </Badge>
                      </motion.div>
                    )}
                  </Group>
                  <Text fw={600} size="sm" lh={1.4}>
                    {currentQuestion.question}
                  </Text>
                </Box>

                {/* Options — flex-grow so they fill remaining card height */}
                <Stack gap={6}>
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = answers[currentQuestion.id] === option.text;
                    return (
                      <motion.div
                        key={option.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <Box
                          onClick={() => handleAnswerSelect(option.text)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: `1.5px solid ${
                              isSelected
                                ? primary6
                                : isDark
                                  ? theme.colors.gray[7]
                                  : theme.colors.gray[2]
                            }`,
                            backgroundColor: isSelected
                              ? primary2
                              : isDark
                                ? theme.colors.dark[6]
                                : theme.white,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            userSelect: 'none',
                          }}
                        >
                          {/* Letter badge */}
                          <Box
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 5,
                              backgroundColor: isSelected
                                ? primary6
                                : isDark
                                  ? theme.colors.dark[4]
                                  : theme.colors.gray[1],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'background-color 0.15s ease',
                            }}
                          >
                            {isSelected ? (
                              <IconCheck size={12} color="white" strokeWidth={3} />
                            ) : (
                              <Text size="10px" fw={700} c={isDark ? 'dimmed' : 'dark'}>
                                {option.label}
                              </Text>
                            )}
                          </Box>

                          <Text size="xs" fw={isSelected ? 600 : 400} style={{ flex: 1, lineHeight: 1.4 }}>
                            {option.text}
                          </Text>
                        </Box>
                      </motion.div>
                    );
                  })}
                </Stack>

                {/* Inline tip — only when unanswered, compact */}
                <AnimatePresence>
                  {!isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Group
                        gap={6}
                        mt={8}
                        px={10}
                        py={7}
                        style={{
                          borderRadius: 8,
                          backgroundColor: isDark
                            ? theme.colors[theme.primaryColor][9]
                            : theme.colors[theme.primaryColor][0],
                          borderLeft: `3px solid ${primary6}`,
                        }}
                      >
                        <ThemeIcon size={18} radius="sm" color={theme.primaryColor} variant="light">
                          <IconBulb size={11} />
                        </ThemeIcon>
                        <Text size="10px" c="dimmed" style={{ flex: 1 }}>
                          Select the option that best describes you — no right or wrong answer.
                        </Text>
                      </Group>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Compact navigation row ── */}
        <motion.div variants={itemVariants} style={{ marginTop: 8 }}>
          <Box
            px={12}
            py={10}
            style={{
              borderRadius: 10,
              border: `1px solid ${isDark ? theme.colors.gray[7] : theme.colors.gray[2]}`,
              backgroundColor: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
            }}
          >
            <Group gap={8} align="center">
              {/* Previous */}
              <Button
                variant="default"
                size="xs"
                radius="md"
                onClick={() => navigate(-1)}
                disabled={isFirstQuestion}
                leftSection={<IconChevronLeft size={13} />}
                style={{ flexShrink: 0 }}
              >
                Prev
              </Button>

              {/* Main CTA — grows to fill space */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} style={{ flex: 1 }}>
                <Button
                  fullWidth
                  size="xs"
                  radius="md"
                  onClick={() => navigate(1)}
                  disabled={!isAnswered || isLastQuestion}
                  rightSection={
                    isLastQuestion ? <IconCheck size={13} /> : <IconArrowRight size={13} />
                  }
                  color={theme.primaryColor}
                  fw={600}
                >
                  {isLastQuestion ? 'Complete' : 'Continue'}
                </Button>
              </motion.div>

              {/* Skip */}
              {!isLastQuestion && (
                <Button
                  variant="subtle"
                  size="xs"
                  radius="md"
                  color={theme.primaryColor}
                  onClick={() => navigate(1)}
                  rightSection={<IconChevronRight size={13} />}
                  style={{ flexShrink: 0 }}
                >
                  Skip
                </Button>
              )}
            </Group>

            {/* Status line */}
            <Center mt={5}>
              <Text size="10px" c="dimmed">
                {isFirstQuestion && !isAnswered && 'Choose an answer to continue'}
                {!isFirstQuestion && !isLastQuestion &&
                  `${answeredCount} of ${totalQuestions} answered`}
                {isLastQuestion && "You've reached the last question!"}
                {isFirstQuestion && isAnswered && `${answeredCount} of ${totalQuestions} answered`}
              </Text>
            </Center>
          </Box>
        </motion.div>

      </Stack>
    </motion.div>
  );
}