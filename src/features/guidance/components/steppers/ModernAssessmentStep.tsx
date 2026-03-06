import { useEffect, useState } from 'react';

import {
  Button,
  Card,
  Center,
  Group,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowRight, IconBulb, IconCheck, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

import { cardHoverVariants, containerVariants, itemVariants, pulseVariants } from '../../animations/formAnimations';

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
      'A. Solving puzzles or figuring out how things work',
      'B. Creating something new or expressing ideas',
      'C. Planning, organizing, or making decisions',
      'D. Performing or presenting in front of others',
      'E. Supporting, guiding, or helping people',
    ],
  },
  {
    id: 2,
    question: 'When you have free time, what do you enjoy doing most?',
    options: [
      'A. Learning new facts or skills',
      'B. Writing, drawing, or creating content',
      'C. Thinking about goals, money, or future plans',
      'D. Singing, dancing, acting, or entertaining',
      'E. Volunteering, mentoring, or listening to others',
    ],
  },
  {
    id: 3,
    question: 'In a group activity, what role do you naturally take?',
    options: [
      'A. Problem solver',
      'B. Idea creator',
      'C. Organizer or leader',
      'D. Performer or speaker',
      'E. Helper or coordinator',
    ],
  },
  {
    id: 4,
    question: 'What do people often praise you for?',
    options: [
      'A. Thinking clearly and logically',
      'B. Imagination and originality',
      'C. Confidence and leadership',
      'D. Energy and expression',
      'E. Kindness and understanding',
    ],
  },
  {
    id: 5,
    question: 'Which task would you enjoy the most?',
    options: [
      'A. Analyzing a problem and finding a solution',
      'B. Designing or creating something meaningful',
      'C. Managing people or resources',
      'D. Entertaining or inspiring an audience',
      "E. Making a positive difference in someone's life",
    ],
  },
  {
    id: 6,
    question: 'What type of stories or content attract you most?',
    options: [
      'A. Mysteries, discoveries, or "how it works" stories',
      'B. Emotional, artistic, or creative stories',
      'C. Success stories, leadership journeys',
      'D. Music, dance, or performance stories',
      'E. Real-life stories about helping or change',
    ],
  },
  {
    id: 7,
    question: 'Which environment would you feel most comfortable working in?',
    options: [
      'A. Quiet and focused',
      'B. Creative and flexible',
      'C. Fast-paced and goal-driven',
      'D. Lively and expressive',
      'E. Caring and people-focused',
    ],
  },
  {
    id: 8,
    question: 'How do you prefer to express yourself?',
    options: [
      'A. Through thinking and reasoning',
      'B. Through words, art, or visuals',
      'C. Through planning and decision-making',
      'D. Through voice, movement, or performance',
      'E. Through empathy and support',
    ],
  },
  {
    id: 9,
    question: 'Which skill would you like to develop more?',
    options: [
      'A. Critical thinking',
      'B. Creativity',
      'C. Leadership',
      'D. Confidence on stage',
      'E. Emotional intelligence',
    ],
  },
  {
    id: 10,
    question: 'What kind of work would make you feel most fulfilled?',
    options: [
      'A. Solving important problems',
      'B. Creating meaningful ideas',
      'C. Leading and achieving goals',
      'D. Inspiring people through performance',
      'E. Helping others grow or heal',
    ],
  },
];

const questionVariants: any = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.5 },
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 500 : -500,
    opacity: 0,
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.5 },
    },
  }),
};

export function ModernAssessmentStep({ answers, onAnswersChange }: AssessmentStepProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Get theme colors
  const primaryColor = theme.colors[theme.primaryColor][6];
  const secondaryColor = theme.colors[theme.primaryColor][4];
  const accentColor = theme.colors[theme.primaryColor][2];

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progressPercent = (answeredCount / totalQuestions) * 100;
  const isAnswered = Boolean(answers[currentQuestion.id]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = () => {
    if (currentIndex < totalQuestions - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleAnswerSelect = (value: string) => {
    onAnswersChange({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const canContinue = isAnswered;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Stack gap="xl">
        {/* Header with Progress */}
        <motion.div variants={itemVariants}>
          <Card
            withBorder
            padding="md"
            radius="lg"
            style={{
              background: colorScheme === 'dark' ? `${accentColor}25` : `${accentColor}15`,
              backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : 'transparent',
              borderColor: theme.colors.gray[colorScheme === 'dark' ? 7 : 2],
            }}
          >
            <Stack gap="sm">
              <Group justify="space-between" align="center">
                <div>
                  <Text fw={700} size="lg" c={theme.primaryColor}>
                    Career Interest Assessment
                  </Text>
                  <Text size="sm" c="dimmed">
                    Discover your ideal career path through personalized questions
                  </Text>
                </div>
                <ThemeIcon size="xl" radius="lg" variant="light" color={theme.primaryColor}>
                  <IconBulb size={24} />
                </ThemeIcon>
              </Group>

              {/* Progress bars */}
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>
                    Question {currentIndex + 1} of {totalQuestions}
                  </Text>
                  <Text size="sm" fw={500}>
                    {answeredCount} Answered
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Progress
                    value={((currentIndex + 1) / totalQuestions) * 100}
                    radius="md"
                    size="md"
                    color={theme.primaryColor}
                    mb="xs"
                  />
                  <Text size="xs" fw={500} c={theme.primaryColor} ml="xs">
                    {Math.round(progressPercent)}%
                  </Text>
                </Group>
              </div>
            </Stack>
          </Card>
        </motion.div>

        {/* Question Container */}
        <motion.div layout className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              variants={questionVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <motion.div initial="rest" whileHover="hover" variants={cardHoverVariants}>
                <Card
                  withBorder
                  padding="md"
                  radius="lg"
                  style={{
                    borderColor: primaryColor,
                    borderWidth: 2,
                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                  }}
                >
                  <Stack gap="md">
                    {/* Question Title */}
                    <motion.div variants={itemVariants}>
                      <div>
                        <Text fw={700} size="lg" mb="sm" c={theme.primaryColor}>
                          Q{currentQuestion.id}. {currentQuestion.question}
                        </Text>
                        <div
                          style={{
                            height: '3px',
                            width: '60px',
                            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                    </motion.div>

                    {/* Options */}
                    <Stack gap="md">
                      <AnimatePresence>
                        {currentQuestion.options.map((option, index) => {
                          const isSelected = answers[currentQuestion.id] === option;
                          return (
                            <motion.div
                              key={option}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div
                                style={{
                                  position: 'relative',
                                  padding: '16px',
                                  borderRadius: '8px',
                                  border: '2px solid',
                                  borderColor: isSelected
                                    ? primaryColor
                                    : colorScheme === 'dark'
                                      ? theme.colors.gray[7]
                                      : '#e5e7eb',
                                  backgroundColor: isSelected
                                    ? `${accentColor}30`
                                    : colorScheme === 'dark'
                                      ? theme.colors.dark[6]
                                      : 'white',
                                  transition: 'all 0.2s ease',
                                  cursor: 'pointer',
                                  pointerEvents: 'auto',
                                  color: colorScheme === 'dark' ? theme.colors.gray[0] : 'inherit',
                                }}
                                onClick={() => handleAnswerSelect(option)}
                              >
                                <div
                                  style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}
                                >
                                  <div
                                    style={{
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '50%',
                                      border: '2px solid',
                                      borderColor: isSelected ? primaryColor : '#d1d5db',
                                      backgroundColor: isSelected ? primaryColor : 'transparent',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {isSelected && <IconCheck size={16} color="white" style={{ strokeWidth: 3 }} />}
                                  </div>
                                  <span style={{ flex: 1, fontSize: '1rem' }}>{option}</span>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                      }}
                                    >
                                      <motion.div variants={pulseVariants} animate="animate">
                                        <IconCheck
                                          size={20}
                                          color={primaryColor}
                                          style={{ strokeWidth: 3, flexShrink: 0 }}
                                        />
                                      </motion.div>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </Stack>

                    {/* Tip Section */}
                    {!isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Card
                          p="md"
                          radius="md"
                          style={{
                            backgroundColor: colorScheme === 'dark' ? `${accentColor}30` : `${accentColor}20`,
                            borderLeft: `4px solid ${primaryColor}`,
                          }}
                        >
                          <Group gap="sm">
                            <ThemeIcon size="lg" radius="md" color={theme.primaryColor} variant="light">
                              <IconBulb size={20} />
                            </ThemeIcon>
                            <div>
                              <Text fw={500} size="sm">
                                Tip
                              </Text>
                              <Text size="sm" c="dimmed">
                                Select the option that best describes you. There's no right or wrong answer.
                              </Text>
                            </div>
                          </Group>
                        </Card>
                      </motion.div>
                    )}
                  </Stack>
                </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants}>
          <Card
            withBorder
            padding="md"
            radius="lg"
            style={{
              backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
              borderColor: theme.colors.gray[colorScheme === 'dark' ? 7 : 2],
            }}
          >
            <Stack gap="sm">
              {/* Primary Continue Button */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  fullWidth
                  size="md"
                  onClick={handleNext}
                  disabled={!canContinue || isLastQuestion}
                  rightSection={isLastQuestion ? <IconCheck size={18} /> : <IconArrowRight size={18} />}
                  color={theme.primaryColor}
                  fw={600}
                >
                  {isLastQuestion ? 'Assessment Complete' : 'Continue'}
                </Button>
              </motion.div>

              {/* Navigation Buttons Row */}
              <Group grow gap="sm">
                {/* Previous Button */}
                <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={isFirstQuestion}
                    leftSection={<IconChevronLeft size={16} />}
                    color={theme.primaryColor}
                    fw={500}
                  >
                    Previous
                  </Button>
                </motion.div>

                {/* Skip Button */}
                {!isLastQuestion && (
                  <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={handleSkip}
                      leftSection={<IconChevronRight size={16} />}
                      color={theme.primaryColor}
                      fw={500}
                    >
                      Skip
                    </Button>
                  </motion.div>
                )}

                {/* Next Button */}
                {!isLastQuestion && (
                  <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={handleNext}
                      rightSection={<IconChevronRight size={16} />}
                      color={theme.primaryColor}
                      fw={500}
                    >
                      Next
                    </Button>
                  </motion.div>
                )}
              </Group>

              {/* Question Counter Info */}
              <Center>
                <Text size="sm" c={colorScheme === 'dark' ? theme.colors.gray[3] : 'dimmed'}>
                  {isFirstQuestion && 'Start your assessment now!'}
                  {!isFirstQuestion && !isLastQuestion && `Question ${currentIndex + 1} of ${totalQuestions}`}
                  {isLastQuestion && "You've reached the last question!"}
                </Text>
              </Center>
            </Stack>
          </Card>
        </motion.div>
      </Stack>
    </motion.div>
  );
}
