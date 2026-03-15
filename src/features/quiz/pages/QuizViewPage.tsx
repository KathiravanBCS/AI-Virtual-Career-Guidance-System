import { useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Loader,
  Paper,
  Progress,
  Radio,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';

import { useGetQuizById, useGetQuizQuestions } from '../api';
import type { DisplayQuestion } from '../types';

export const QuizViewPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // Fetch quiz details
  const { data: quiz, isLoading: quizLoading, error: quizError } = useGetQuizById(quizId ? parseInt(quizId, 10) : null);

  // Fetch quiz questions
  const { data: questionsResponse, isLoading: questionsLoading } = useGetQuizQuestions(quiz?.id || null);

  // Extract questions from response
  const questions = questionsResponse?.data || [];

  // Convert database questions to display format
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

  // Handlers
  const handleAnswerChange = (value: string) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestionIndex]: value,
      });
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

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  // Error state
  if (quizError) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Quiz Not Found"
          titleProps={{ fw: 700, size: 'h2' }}
          description="The quiz you're looking for doesn't exist."
        >
          <Stack gap="lg" align="center">
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
              Failed to load quiz. Please try again or go back.
            </Alert>
            <Button onClick={() => navigate('/quiz/generate')}>Generate New Quiz</Button>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Loading Quiz"
          titleProps={{ fw: 700, size: 'h2' }}
          description="Please wait while we load the quiz..."
        >
          <Stack gap="lg" align="center">
            <Loader size="lg" />
            <Text>Loading quiz questions...</Text>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  // No questions
  if (!displayQuestions || displayQuestions.length === 0) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="No Questions Found"
          titleProps={{ fw: 700, size: 'h2' }}
          description="This quiz doesn't have any questions yet."
        >
          <Stack gap="lg" align="center">
            <Alert icon={<IconAlertCircle size={16} />} title="Empty Quiz" color="yellow">
              This quiz has no questions yet.
            </Alert>
            <Button onClick={() => navigate('/quiz/generate')}>Create New Quiz</Button>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  const currentQuestion = displayQuestions[currentQuestionIndex];
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const isCorrect = selectedAnswers[currentQuestionIndex] === currentQuestion?.correctAnswer;

  // Calculate score
  const correctAnswersCount = displayQuestions.filter((q, idx) => selectedAnswers[idx] === q.correctAnswer).length;
  const percentage = Math.round((correctAnswersCount / displayQuestions.length) * 100);

  // Show results summary
  if (showResults) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Quiz Results"
          titleProps={{ fw: 700, size: 'h2' }}
          description={`You scored ${correctAnswersCount} out of ${displayQuestions.length} (${percentage}%)`}
          actions={
            <Group>
              <Button variant="default" onClick={handleRestart}>
                Retake Quiz
              </Button>
              <Button color={theme.primaryColor} onClick={() => navigate('/quiz/generate')}>
                Generate New
              </Button>
            </Group>
          }
        >
          <Stack gap="lg" align="center">
            {/* Score Display */}
            <Box style={{ textAlign: 'center' }}>
              <Box
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  backgroundColor:
                    percentage >= 70
                      ? colorScheme === 'dark'
                        ? theme.colors.green[9]
                        : theme.colors.green[0]
                      : percentage >= 50
                        ? colorScheme === 'dark'
                          ? theme.colors.yellow[9]
                          : theme.colors.yellow[0]
                        : colorScheme === 'dark'
                          ? theme.colors.red[9]
                          : theme.colors.red[0],
                  border: `4px solid ${
                    percentage >= 70
                      ? theme.colors.green[5]
                      : percentage >= 50
                        ? theme.colors.yellow[5]
                        : theme.colors.red[5]
                  }`,
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Text
                    size="xl"
                    fw={700}
                    c={
                      percentage >= 70
                        ? colorScheme === 'dark'
                          ? theme.colors.green[2]
                          : theme.colors.green[7]
                        : percentage >= 50
                          ? colorScheme === 'dark'
                            ? theme.colors.yellow[2]
                            : theme.colors.yellow[7]
                          : colorScheme === 'dark'
                            ? theme.colors.red[2]
                            : theme.colors.red[7]
                    }
                  >
                    {percentage}%
                  </Text>
                  <Text
                    size="sm"
                    c={
                      percentage >= 70
                        ? colorScheme === 'dark'
                          ? theme.colors.green[3]
                          : theme.colors.green[6]
                        : percentage >= 50
                          ? colorScheme === 'dark'
                            ? theme.colors.yellow[3]
                            : theme.colors.yellow[6]
                          : colorScheme === 'dark'
                            ? theme.colors.red[3]
                            : theme.colors.red[6]
                    }
                  >
                    {correctAnswersCount}/{displayQuestions.length} correct
                  </Text>
                </div>
              </Box>
            </Box>

            {/* Performance Message */}
            <Box style={{ textAlign: 'center' }}>
              {percentage >= 80 && (
                <Alert icon={<IconCheck size={16} />} title="Excellent!" color="green">
                  Great job! You've mastered this topic.
                </Alert>
              )}
              {percentage >= 60 && percentage < 80 && (
                <Alert icon={<IconAlertCircle size={16} />} title="Good!" color="blue">
                  You're doing well. Keep practicing to improve further.
                </Alert>
              )}
              {percentage >= 40 && percentage < 60 && (
                <Alert icon={<IconAlertCircle size={16} />} title="Fair" color="yellow">
                  You need more practice. Review the material and try again.
                </Alert>
              )}
              {percentage < 40 && (
                <Alert icon={<IconX size={16} />} title="Needs Improvement" color="red">
                  Review the learning materials and try again.
                </Alert>
              )}
            </Box>

            {/* Detailed Results */}
            <Box style={{ width: '100%', maxWidth: '700px' }}>
              <Text fw={500} mb="md" c={colorScheme === 'dark' ? theme.colors.gray[0] : 'inherit'}>
                Question-by-Question Results:
              </Text>
              <Stack gap="md">
                {displayQuestions.map((q, idx) => (
                  <Paper
                    key={idx}
                    p="md"
                    style={{
                      border: `2px solid ${
                        selectedAnswers[idx] === q.correctAnswer ? theme.colors.green[5] : theme.colors.red[5]
                      }`,
                      backgroundColor:
                        selectedAnswers[idx] === q.correctAnswer
                          ? colorScheme === 'dark'
                            ? theme.colors.green[9]
                            : theme.colors.green[0]
                          : colorScheme === 'dark'
                            ? theme.colors.red[9]
                            : theme.colors.red[0],
                    }}
                  >
                    <Group mb="xs">
                      <Text fw={500} style={{ flex: 1 }}>
                        Q{idx + 1}: {q.question}
                      </Text>
                      {selectedAnswers[idx] === q.correctAnswer ? (
                        <IconCheck size={20} color="#51cf66" />
                      ) : (
                        <IconX size={20} color="#ff6b6b" />
                      )}
                    </Group>
                    <Text size="sm" c="dimmed" mb="xs">
                      Your answer: {selectedAnswers[idx] || 'Not answered'}
                    </Text>
                    {selectedAnswers[idx] !== q.correctAnswer && (
                      <Text size="sm" c="green">
                        Correct answer: {q.correctAnswer}
                      </Text>
                    )}
                    {q.explanation && (
                      <Text size="sm" c="dimmed" mt="xs" fs="italic">
                        {q.explanation}
                      </Text>
                    )}
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  // Show quiz question
  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title={`Quiz: ${quiz?.title}`}
        titleProps={{ fw: 700, size: 'h2' }}
        description={`Question ${currentQuestionIndex + 1} of ${displayQuestions.length}`}
        actions={
          <Button variant="default" onClick={() => navigate('/quiz/generate')}>
            Generate New
          </Button>
        }
      >
        <Stack gap="lg" align="center">
          {/* Progress */}
          <Box style={{ width: '100%', maxWidth: '700px' }}>
            <Group justify="space-between" mb="sm">
              <Text size="sm" fw={500}>
                Question {currentQuestionIndex + 1} of {displayQuestions.length}
              </Text>
              <Text size="sm" c="dimmed">
                {selectedAnswers[currentQuestionIndex] ? 'Answered' : 'Not answered'}
              </Text>
            </Group>
            <Progress value={((currentQuestionIndex + 1) / displayQuestions.length) * 100} />
          </Box>

          {/* Question */}
          <Box style={{ width: '100%', maxWidth: '700px' }}>
            <Paper
              p="lg"
              radius="lg"
              withBorder
              style={{
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                borderColor: theme.colors.gray[colorScheme === 'dark' ? 7 : 2],
              }}
            >
              <Text fw={500} mb="lg" size="lg" c={colorScheme === 'dark' ? theme.colors.gray[0] : 'inherit'}>
                {currentQuestion?.question}
              </Text>

              {/* Options */}
              <Radio.Group
                value={selectedAnswers[currentQuestionIndex] || ''}
                onChange={handleAnswerChange}
                disabled={showResults}
              >
                <Stack gap="sm">
                  {currentQuestion?.options?.map((option, idx) => (
                    <Paper
                      key={idx}
                      p="md"
                      style={{
                        border: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
                        backgroundColor:
                          showResults && option === currentQuestion.correctAnswer
                            ? colorScheme === 'dark'
                              ? theme.colors.green[9]
                              : theme.colors.green[0]
                            : showResults &&
                                option === selectedAnswers[currentQuestionIndex] &&
                                option !== currentQuestion.correctAnswer
                              ? colorScheme === 'dark'
                                ? theme.colors.red[9]
                                : theme.colors.red[0]
                              : colorScheme === 'dark'
                                ? theme.colors.dark[6]
                                : 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <Radio value={option} label={option} styles={{ label: { cursor: 'pointer' } }} />
                    </Paper>
                  ))}
                </Stack>
              </Radio.Group>

              {/* Show explanation after answer */}
              {showResults && isAnswered && (
                <Paper
                  mt="lg"
                  p="md"
                  style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0] }}
                >
                  <Group mb="xs">
                    {isCorrect ? (
                      <>
                        <IconCheck size={20} color={theme.colors.green[5]} />
                        <Text fw={500} c={theme.colors.green[5]}>
                          Correct!
                        </Text>
                      </>
                    ) : (
                      <>
                        <IconX size={20} color={theme.colors.red[5]} />
                        <Text fw={500} c={theme.colors.red[5]}>
                          Incorrect
                        </Text>
                      </>
                    )}
                  </Group>
                  {currentQuestion?.explanation && (
                    <Text size="sm" c={colorScheme === 'dark' ? theme.colors.gray[2] : 'inherit'}>
                      {currentQuestion.explanation}
                    </Text>
                  )}
                </Paper>
              )}
            </Paper>
          </Box>

          {/* Navigation Buttons */}
          <Group justify="space-between" style={{ width: '100%', maxWidth: '700px' }}>
            <Button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              variant="default"
              color={theme.primaryColor}
            >
              Previous
            </Button>

            {currentQuestionIndex === displayQuestions.length - 1 && (
              <Button
                onClick={handleSubmit}
                color={theme.primaryColor}
                disabled={Object.keys(selectedAnswers).length !== displayQuestions.length}
              >
                Submit Quiz
              </Button>
            )}

            {currentQuestionIndex < displayQuestions.length - 1 && (
              <Button onClick={handleNext} color={theme.primaryColor}>
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
