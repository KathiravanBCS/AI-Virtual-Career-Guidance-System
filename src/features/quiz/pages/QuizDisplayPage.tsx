import { useState } from 'react';

import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Progress,
  Radio,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconDownload,
  IconSend,
  IconX,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';

import { useCreateQuiz, useCreateQuizQuestion } from '../api';
import type { CreateQuizQuestionRequest, CreateQuizRequest, Quiz } from '../types';
import useActivityLogger from '@/hooks/useActivityLogger';
import { useNotification } from '@/features/gamification/context/NotificationContext';
import { QuizResults } from '../components';

interface QuizQuestion {
  id?: string | number;
  question: string;
  options?: string[];
  answers?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  point?: number;
  questionType?: 'single' | 'multiple';
}

export const QuizDisplayPage: React.FC = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const primary = theme.primaryColor;
  const location = useLocation();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isQuizSaved, setIsQuizSaved] = useState<boolean>(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const { mutate: createQuiz, isPending: isCreatingQuiz } = useCreateQuiz();
  const { mutate: createQuizQuestion, isPending: isCreatingQuestion } = useCreateQuizQuestion();
  const { showNotification } = useNotification();
  const { logQuizPass, logQuizAttempt } = useActivityLogger({ showNotification });

  const {
    quiz: quizData = {},
    topic: topicFromState = 'Quiz',
    moduleName = '',
    learning_module_id = 0,
    quizId = 0,
  } = (location.state as any) || {};

  const rawQuestions = (quizData.questions || quizData.data || []) as QuizQuestion[];
  const quizQuestions = rawQuestions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options || q.answers || [],
    correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer,
    explanation: q.explanation,
    point: q.point,
    questionType: q.questionType,
  }));

  const topic = quizData.topic || topicFromState || 'Quiz';

  const getTitleWithDate = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${moduleName || topic} - ${dateStr} ${timeStr}`;
  };

  const calculateTotalPoints = (questions: typeof quizQuestions): number =>
    questions.reduce((sum, q) => sum + (q.point || 10), 0);

  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="No Quiz Found"
          titleProps={{ fw: 700, size: 'h2' }}
          description="No quiz questions found. Please generate some first."
        >
          <Stack gap="lg" align="center">
            <Button onClick={() => navigate('/quiz')} radius="lg">Generate Quiz</Button>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const isCorrect = selectedAnswers[currentQuestionIndex] === currentQuestion?.correctAnswer;
  const correctAnswersCount = quizQuestions.filter((q, idx) => selectedAnswers[idx] === q.correctAnswer).length;
  const percentage = Math.round((correctAnswersCount / quizQuestions.length) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleAnswerChange = (value: string) => {
    if (!showResults) {
      setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: value });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setShowResults(true);
    const quizIdForLogging = quizId || learning_module_id;
    await logQuizAttempt(quizIdForLogging);
    if (percentage >= 70) {
      await logQuizPass(quizIdForLogging, percentage);
    }
  };

  const handleSaveQuiz = async () => {
    try {
      const data: CreateQuizRequest = {
        learning_module_id: learning_module_id || 0,
        title: getTitleWithDate(),
        description: '',
        topic: topic,
        questions_count: quizQuestions.length,
        total_points: calculateTotalPoints(quizQuestions),
        status: 'active',
      };

      createQuiz(data, {
        onSuccess: (createdQuiz: Quiz) => {
          quizQuestions.forEach((question, index) => {
            const questionData: CreateQuizQuestionRequest = {
              quiz_id: createdQuiz.id || 0,
              question_text: question.question,
              question_type: question.questionType || 'single',
              answers: question.options || [],
              correct_answer: String(question.correctAnswer || ''),
              explanation: question.explanation || '',
              points: question.point || 10,
              question_order: index + 1,
            };
            createQuizQuestion({ quizId: createdQuiz.id || 0, data: questionData });
          });
          setIsQuizSaved(true);
        },
      });
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  // Results view
  if (showResults) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Quiz Complete"
          titleProps={{ fw: 700, size: 'h2' }}
          description={`${topic} — ${moduleName || ''}`}
          actions={
            <Group gap="sm">
              <Button
                variant="default"
                onClick={() => {
                  setShowResults(false);
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                }}
                radius="lg"
              >
                Retake
              </Button>
              <Button color={primary} onClick={() => navigate('/quiz')} radius="lg">
                New Quiz
              </Button>
            </Group>
          }
        >
          <Stack gap="xl">
            {/* Score overview */}
            <Box style={{ maxWidth: '760px', margin: '0 auto', width: '100%' }}>
              <Paper
                p="xl"
                radius="xl"
                withBorder
                style={{
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
                  textAlign: 'center',
                }}
              >
                <Text
                  style={{ fontSize: '56px', lineHeight: 1, marginBottom: '8px' }}
                >
                  {percentage >= 70 ? '🏆' : percentage >= 50 ? '👍' : '📚'}
                </Text>
                <Title
                  order={2}
                  c={
                    percentage >= 70
                      ? isDark ? theme.colors.green[2] : theme.colors.green[8]
                      : percentage >= 50
                      ? isDark ? theme.colors.yellow[2] : theme.colors.yellow[8]
                      : isDark ? theme.colors.red[2] : theme.colors.red[8]
                  }
                  mb="xs"
                >
                  {percentage}%
                </Title>
                <Text
                  c={
                    percentage >= 70
                      ? isDark ? theme.colors.green[3] : theme.colors.green[7]
                      : percentage >= 50
                      ? isDark ? theme.colors.yellow[3] : theme.colors.yellow[7]
                      : isDark ? theme.colors.red[3] : theme.colors.red[7]
                  }
                  size="sm"
                >
                  {correctAnswersCount} of {quizQuestions.length} correct
                </Text>
              </Paper>
            </Box>

            {/* Per-question results */}
            <Box style={{ maxWidth: '760px', margin: '0 auto', width: '100%' }}>
              <Text fw={600} mb="md" c={isDark ? theme.colors.gray[0] : theme.colors.gray[9]}>
                Question-by-Question Review
              </Text>
              <Stack gap="sm">
                {quizQuestions.map((q, idx) => {
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
                          <Badge
                            size="sm"
                            radius="sm"
                            color={isRight ? 'green' : 'red'}
                            variant="light"
                          >
                            Q{idx + 1}
                          </Badge>
                          <Text
                            fw={500}
                            size="sm"
                            style={{ flex: 1, minWidth: 0 }}
                            c={isDark ? theme.colors.gray[1] : theme.colors.gray[8]}
                            lineClamp={2}
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
                        <Text component="span" fw={500} c={isDark ? theme.colors.gray[2] : 'inherit'}>
                          {selectedAnswers[idx] || 'Not answered'}
                        </Text>
                      </Text>
                      {!isRight && (
                        <Text size="xs" c={isDark ? theme.colors.green[3] : theme.colors.green[7]} mt={2}>
                          Correct: {q.correctAnswer}
                        </Text>
                      )}
                      {q.explanation && (
                        <Text size="xs" c="dimmed" mt="xs" fs="italic">
                          {q.explanation}
                        </Text>
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

  // Quiz question view
  const getOptionStyle = (option: string) => {
    const isSelected = selectedAnswers[currentQuestionIndex] === option;
    const isHovered = hoveredOption === option && !isAnswered;
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
        title={`Quiz: ${topic}`}
        titleProps={{ fw: 700, size: 'h2' }}
        description={moduleName || `${quizQuestions.length} questions`}
        actions={
          <Group gap="sm">
            <Button
              variant={isQuizSaved ? 'light' : 'default'}
              color={isQuizSaved ? 'green' : primary}
              onClick={handleSaveQuiz}
              loading={isCreatingQuiz || isCreatingQuestion}
              disabled={isQuizSaved}
              radius="lg"
              leftSection={isQuizSaved ? <IconCircleCheck size={16} /> : <IconDownload size={16} />}
            >
              {isQuizSaved ? 'Saved' : 'Save Quiz'}
            </Button>
            <Button variant="default" onClick={() => navigate('/quiz')} radius="lg">
              New Quiz
            </Button>
          </Group>
        }
      >
        <Stack gap="lg" align="center">
          {/* Progress */}
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
                  <Text size="sm" c="dimmed">of {quizQuestions.length}</Text>
                </Group>
                <Group gap="xs">
                  <Badge
                    size="sm"
                    radius="md"
                    color={isAnswered ? 'green' : 'gray'}
                    variant="light"
                  >
                    {isAnswered ? 'Answered' : 'Unanswered'}
                  </Badge>
                  <Badge size="sm" radius="md" color={primary} variant="light">
                    {answeredCount}/{quizQuestions.length} done
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
                <Radio.Group
                  value={selectedAnswers[currentQuestionIndex] || ''}
                  onChange={handleAnswerChange}
                >
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
                            c={
                              isSelected
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
                </Radio.Group>
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

            {currentQuestionIndex === quizQuestions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                color={primary}
                radius="lg"
                disabled={answeredCount !== quizQuestions.length}
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

export default QuizDisplayPage;