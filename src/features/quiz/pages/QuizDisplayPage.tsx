import { useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Progress,
  Radio,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';

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

interface QuizData {
  topic?: string;
  questions?: QuizQuestion[];
  data?: QuizQuestion[];
}

export const QuizDisplayPage: React.FC = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // Get quiz and metadata from location state
  const { quiz: quizData = {}, topic: topicFromState = 'Quiz', moduleName = '' } = (location.state as any) || {};

  // Extract questions from quiz data (handle both formats)
  const rawQuestions = (quizData.questions || quizData.data || []) as QuizQuestion[];

  // Normalize questions to ensure correct format
  const quizQuestions = rawQuestions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options || q.answers || [],
    correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer,
    explanation: q.explanation,
    point: q.point,
    questionType: q.questionType,
  }));

  // Use topic from quiz data if available
  const topic = quizData.topic || topicFromState || 'Quiz';

  // If no questions, redirect back to generator
  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="No Quiz Found"
          titleProps={{ fw: 700, size: 'h2' }}
          description="No quiz questions found. Please generate some first."
        >
          <Stack gap="lg" align="center">
            <Button onClick={() => navigate('/quiz')}>Generate Quiz</Button>
          </Stack>
        </ListPageLayout>
      </Container>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const isCorrect = selectedAnswers[currentQuestionIndex] === currentQuestion?.correctAnswer;

  const handleAnswerChange = (value: string) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestionIndex]: value,
      });
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

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  // Calculate score
  const correctAnswersCount = quizQuestions.filter((q, idx) => selectedAnswers[idx] === q.correctAnswer).length;
  const percentage = Math.round((correctAnswersCount / quizQuestions.length) * 100);

  // Show results summary
  if (showResults) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Quiz Results"
          titleProps={{ fw: 700, size: 'h2' }}
          description={`You scored ${correctAnswersCount} out of ${quizQuestions.length} (${percentage}%)`}
          actions={
            <Group>
              <Button variant="default" onClick={handleRestart}>
                Retake Quiz
              </Button>
              <Button color={theme.primaryColor} onClick={() => navigate('/quiz')}>
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
                  border: `4px solid ${percentage >= 70 ? theme.colors.green[5] : percentage >= 50 ? theme.colors.yellow[5] : theme.colors.red[5]}`,
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
                    {correctAnswersCount}/{quizQuestions.length} correct
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
                {quizQuestions.map((q, idx) => (
                  <Paper
                    key={idx}
                    p="md"
                    style={{
                      border: `2px solid ${selectedAnswers[idx] === q.correctAnswer ? theme.colors.green[5] : theme.colors.red[5]}`,
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
        title={`Quiz: ${topic}`}
        titleProps={{ fw: 700, size: 'h2' }}
        description={moduleName || `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`}
        actions={
          <Button variant="default" onClick={() => navigate('/quiz')}>
            Generate New
          </Button>
        }
      >
        <Stack gap="lg" align="center">
          {/* Progress */}
          <Box style={{ width: '100%', maxWidth: '700px' }}>
            <Group justify="space-between" mb="sm">
              <Text size="sm" fw={500}>
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </Text>
              <Text size="sm" c="dimmed">
                {selectedAnswers[currentQuestionIndex] ? 'Answered' : 'Not answered'}
              </Text>
            </Group>
            <Progress value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} />
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

            {currentQuestionIndex === quizQuestions.length - 1 && (
              <Button
                onClick={handleSubmit}
                color={theme.primaryColor}
                disabled={Object.keys(selectedAnswers).length !== quizQuestions.length}
              >
                Submit Quiz
              </Button>
            )}

            {currentQuestionIndex < quizQuestions.length - 1 && (
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

export default QuizDisplayPage;
