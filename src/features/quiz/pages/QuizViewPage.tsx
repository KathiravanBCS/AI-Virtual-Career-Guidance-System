import { useState } from 'react';

import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Paper,
  Progress,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconSend,
  IconX,
} from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';

import { useGetQuizById, useGetQuizQuestions } from '../api';
import type { DisplayQuestion } from '../types';

export const QuizViewPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const { data: quiz, isLoading: quizLoading, error: quizError } = useGetQuizById(
    quizId ? parseInt(quizId, 10) : null
  );
  const { data: questionsResponse, isLoading: questionsLoading } = useGetQuizQuestions(quiz?.id || null);

  const questions = questionsResponse?.data || [];
  const displayQuestions: DisplayQuestion[] = questions.map((q) => ({
    question: q.question_text,
    answers: q.answers,
    options: q.answers,
    correctAnswer: q.correct_answer,
    explanation: q.explanation,
    point: q.points,
    questionType: q.question_type as any,
  }));

  const isLoading = quizLoading || questionsLoading;

  const handleAnswerChange = (value: string) => {
    if (!showResults) {
      setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: value });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < displayQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => setShowResults(true);

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (quizError) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout title="Quiz Not Found" titleProps={{ fw: 700, size: 'h2' }} description="The quiz you're looking for doesn't exist.">
          <Stack gap="lg" align="center">
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" radius="lg">
              Failed to load quiz. Please try again.
            </Alert>
            <Button onClick={() => navigate('/quiz/generate')} radius="lg">Generate New Quiz</Button>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout title="Loading Quiz" titleProps={{ fw: 700, size: 'h2' }}>
          <Stack gap="lg" align="center" py="xl">
            <Loader size="lg" color={primary} />
            <Text c="dimmed">Loading quiz questions...</Text>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  if (!displayQuestions || displayQuestions.length === 0) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout title="No Questions Found" titleProps={{ fw: 700, size: 'h2' }} description="This quiz doesn't have any questions yet.">
          <Stack gap="lg" align="center">
            <Alert icon={<IconAlertCircle size={16} />} title="Empty Quiz" color="yellow" radius="lg">
              This quiz has no questions yet.
            </Alert>
            <Button onClick={() => navigate('/quiz/generate')} radius="lg">Create New Quiz</Button>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  const currentQuestion = displayQuestions[currentQuestionIndex];
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const isCorrect = selectedAnswers[currentQuestionIndex] === currentQuestion?.correctAnswer;
  const correctAnswersCount = displayQuestions.filter((q, idx) => selectedAnswers[idx] === q.correctAnswer).length;
  const percentage = Math.round((correctAnswersCount / displayQuestions.length) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = ((currentQuestionIndex + 1) / displayQuestions.length) * 100;

  // Results view
  if (showResults) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Quiz Results"
          titleProps={{ fw: 700, size: 'h2' }}
          description={`${quiz?.title || 'Quiz'} — ${correctAnswersCount} of ${displayQuestions.length} correct (${percentage}%)`}
          actions={
            <Group gap="sm">
              <Button variant="default" onClick={handleRestart} radius="lg">Retake</Button>
              <Button color={primary} onClick={() => navigate('/quiz/generate')} radius="lg">New Quiz</Button>
            </Group>
          }
        >
          <Stack gap="lg" align="center">
            {/* Score circle */}
            <Box style={{ maxWidth: '720px', width: '100%' }}>
              <Paper
                p="xl"
                radius="xl"
                withBorder
                style={{
                  textAlign: 'center',
                  backgroundColor:
                    percentage >= 70
                      ? isDark ? theme.colors.green[9] : theme.colors.green[0]
                      : percentage >= 50
                      ? isDark ? theme.colors.yellow[9] : theme.colors.yellow[0]
                      : isDark ? theme.colors.red[9] : theme.colors.red[0],
                  borderColor:
                    percentage >= 70
                      ? theme.colors.green[isDark ? 7 : 3]
                      : percentage >= 50
                      ? theme.colors.yellow[isDark ? 7 : 3]
                      : theme.colors.red[isDark ? 7 : 3],
                }}
              >
                <Text style={{ fontSize: '48px', lineHeight: 1 }} mb="xs">
                  {percentage >= 70 ? '🏆' : percentage >= 50 ? '👍' : '📚'}
                </Text>
                <Text
                  fw={800}
                  style={{ fontSize: '36px' }}
                  c={
                    percentage >= 70
                      ? isDark ? theme.colors.green[2] : theme.colors.green[8]
                      : percentage >= 50
                      ? isDark ? theme.colors.yellow[2] : theme.colors.yellow[8]
                      : isDark ? theme.colors.red[2] : theme.colors.red[8]
                  }
                >
                  {percentage}%
                </Text>
                <Text
                  size="sm"
                  c={
                    percentage >= 70
                      ? isDark ? theme.colors.green[3] : theme.colors.green[7]
                      : percentage >= 50
                      ? isDark ? theme.colors.yellow[3] : theme.colors.yellow[7]
                      : isDark ? theme.colors.red[3] : theme.colors.red[7]
                  }
                >
                  {correctAnswersCount} of {displayQuestions.length} correct
                </Text>
              </Paper>
            </Box>

            {/* Per-question review */}
            <Box style={{ maxWidth: '720px', width: '100%' }}>
              <Text fw={600} mb="md" c={isDark ? theme.colors.gray[0] : theme.colors.gray[9]}>
                Question Review
              </Text>
              <Stack gap="sm">
                {displayQuestions.map((q, idx) => {
                  const isRight = selectedAnswers[idx] === q.correctAnswer;
                  return (
                    <Paper
                      key={idx}
                      p="md"
                      radius="lg"
                      withBorder
                      style={{
                        backgroundColor: isRight
                          ? isDark ? `${theme.colors.green[9]}60` : theme.colors.green[0]
                          : isDark ? `${theme.colors.red[9]}60` : theme.colors.red[0],
                        borderColor: isRight
                          ? theme.colors.green[isDark ? 7 : 3]
                          : theme.colors.red[isDark ? 7 : 3],
                      }}
                    >
                      <Group justify="space-between" mb="xs" wrap="nowrap">
                        <Group gap="xs" style={{ flex: 1, minWidth: 0 }}>
                          <Badge size="sm" radius="sm" color={isRight ? 'green' : 'red'} variant="light">
                            Q{idx + 1}
                          </Badge>
                          <Text
                            fw={500}
                            size="sm"
                            c={isDark ? theme.colors.gray[1] : theme.colors.gray[8]}
                            lineClamp={2}
                            style={{ flex: 1, minWidth: 0 }}
                          >
                            {q.question}
                          </Text>
                        </Group>
                        <Box
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: isRight ? theme.colors.green[5] : theme.colors.red[5],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {isRight ? <IconCheck size={13} color="white" /> : <IconX size={13} color="white" />}
                        </Box>
                      </Group>
                      <Text size="xs" c="dimmed">
                        Your answer:{' '}
                        <Text component="span" fw={500}>
                          {selectedAnswers[idx] || 'Not answered'}
                        </Text>
                      </Text>
                      {!isRight && (
                        <Text size="xs" c={isDark ? theme.colors.green[3] : theme.colors.green[7]} mt={2}>
                          Correct: {q.correctAnswer}
                        </Text>
                      )}
                      {q.explanation && (
                        <Text size="xs" c="dimmed" mt="xs" fs="italic">{q.explanation}</Text>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  // Question view
  const getOptionStyle = (option: string) => {
    const isSelected = selectedAnswers[currentQuestionIndex] === option;
    const isHovered = hoveredOption === option;
    if (isSelected) {
      return {
        backgroundColor: isDark ? theme.colors[primary][9] : theme.colors[primary][0],
        borderColor: theme.colors[primary][isDark ? 5 : 5],
      };
    }
    if (isHovered) {
      return {
        backgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[0],
        borderColor: theme.colors[primary][isDark ? 6 : 4],
      };
    }
    return {
      backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
      borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
    };
  };

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title={quiz?.title || 'Quiz'}
        titleProps={{ fw: 700, size: 'h2' }}
        description={`${displayQuestions.length} questions`}
        actions={
          <Button variant="default" onClick={() => navigate('/quiz/generate')} radius="lg">
            Generate New
          </Button>
        }
      >
        <Stack gap="lg" align="center">
          {/* Progress bar */}
          <Box style={{ width: '100%', maxWidth: '720px' }}>
            <Paper
              p="md"
              radius="xl"
              withBorder
              style={{
                backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[2],
              }}
            >
              <Group justify="space-between" mb="sm">
                <Group gap="xs">
                  <Text size="sm" fw={600} c={isDark ? theme.colors.gray[1] : theme.colors.gray[8]}>
                    Question {currentQuestionIndex + 1}
                  </Text>
                  <Text size="sm" c="dimmed">of {displayQuestions.length}</Text>
                </Group>
                <Group gap="xs">
                  <Badge size="sm" radius="md" color={isAnswered ? 'green' : 'gray'} variant="light">
                    {isAnswered ? 'Answered' : 'Unanswered'}
                  </Badge>
                  <Badge size="sm" radius="md" color={primary} variant="light">
                    {answeredCount}/{displayQuestions.length} done
                  </Badge>
                </Group>
              </Group>
              <Progress value={progress} radius="xl" size="sm" color={primary} />
            </Paper>
          </Box>

          {/* Question card */}
          <Box style={{ width: '100%', maxWidth: '720px' }}>
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
                <Box>
                  <Group gap="xs" mb="md">
                    <Badge size="sm" radius="sm" color={primary} variant="light">
                      {currentQuestion.point || 10} pts
                    </Badge>
                  </Group>
                  <Text
                    fw={600}
                    size="lg"
                    c={isDark ? theme.colors.gray[0] : theme.colors.gray[9]}
                    style={{ lineHeight: 1.5 }}
                  >
                    {currentQuestion?.question}
                  </Text>
                </Box>

                {/* Options */}
                <Stack gap="sm">
                  {currentQuestion?.options?.map((option, idx) => {
                    const optStyle = getOptionStyle(option);
                    const isSelected = selectedAnswers[currentQuestionIndex] === option;
                    return (
                      <Box
                        key={idx}
                        onClick={() => handleAnswerChange(option)}
                        onMouseEnter={() => setHoveredOption(option)}
                        onMouseLeave={() => setHoveredOption(null)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px 16px',
                          borderRadius: theme.radius.lg,
                          border: `1.5px solid ${optStyle.borderColor}`,
                          backgroundColor: optStyle.backgroundColor,
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        <Box
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: `1.5px solid ${isSelected ? theme.colors[primary][5] : isDark ? theme.colors.dark[3] : theme.colors.gray[4]}`,
                            backgroundColor: isSelected ? theme.colors[primary][5] : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.18s ease',
                          }}
                        >
                          {isSelected && <IconCheck size={13} color="white" />}
                        </Box>
                        <Text
                          size="sm"
                          fw={isSelected ? 500 : 400}
                          c={isSelected
                            ? isDark ? theme.colors[primary][2] : theme.colors[primary][8]
                            : isDark ? theme.colors.gray[2] : theme.colors.gray[8]
                          }
                          style={{ flex: 1 }}
                        >
                          {option}
                        </Text>
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            </Paper>
          </Box>

          {/* Navigation */}
          <Group justify="space-between" style={{ width: '100%', maxWidth: '720px' }}>
            <Button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              variant="default"
              radius="lg"
              leftSection={<IconArrowLeft size={16} />}
            >
              Previous
            </Button>

            {currentQuestionIndex === displayQuestions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                color={primary}
                radius="lg"
                disabled={answeredCount !== displayQuestions.length}
                leftSection={<IconSend size={16} />}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                color={primary}
                radius="lg"
                rightSection={<IconArrowRight size={16} />}
              >
                Next
              </Button>
            )}
          </Group>
        </Stack>
      </ListPageLayout>
    </Container>
  );
};

export default QuizViewPage;