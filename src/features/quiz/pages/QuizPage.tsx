import { useState } from 'react';

import { Alert, Center, Container, Loader, Stack } from '@mantine/core';

import { useGetLearningPathsForQuiz } from '../api/useQuiz';
import { QuizQuestion, QuizResults, QuizSetup } from '../components';
import { QuizData, QuizResults as QuizResultsType } from '../types';

export const QuizPage: React.FC = () => {
  const { data: paths = [], isLoading: pathsLoading } = useGetLearningPathsForQuiz();

  const [selectedPathId, setSelectedPathId] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number[]>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [quizResults, setQuizResults] = useState<QuizResultsType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPath = paths.find((p) => p.$id === selectedPathId);
  const modules = selectedPath?.modules || [];

  const handlePathChange = (pathId: string) => {
    setSelectedPathId(pathId);
    setSelectedModule('');
    setTopic('');
  };

  const handleModuleChange = (module: string) => {
    setSelectedModule(module);
    if (module !== '' && modules[parseInt(module)]) {
      setTopic(modules[parseInt(module)].title);
    } else {
      setTopic(selectedPath?.careerName || '');
    }
  };

  const handleGenerateQuiz = async () => {
    if (!topic.trim() || numQuestions < 1) {
      setError('Please enter a valid topic and number of questions');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);

    try {
      // Mock quiz generation - replace with your API call
      const mockQuizData: QuizData = {
        topic,
        questions: Array.from({ length: numQuestions }, (_, i) => ({
          question: `Question ${i + 1}: What is ${topic}?`,
          answers: [
            `Answer A for question ${i + 1}`,
            `Answer B for question ${i + 1}`,
            `Answer C for question ${i + 1}`,
            `Answer D for question ${i + 1}`,
          ],
          correctAnswer: Math.floor(Math.random() * 4),
          explanation: `This is the explanation for question ${i + 1}`,
          point: 10,
          questionType: 'single',
        })),
      };
      setQuizData(mockQuizData);
    } catch (err) {
      setError('Failed to generate quiz. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setUserAnswers((prev) => {
      const question = quizData?.questions[currentQuestionIndex];
      if (!question) return prev;

      if (question.questionType === 'single') {
        return { ...prev, [currentQuestionIndex]: [answerIndex] };
      } else {
        const current = prev[currentQuestionIndex] || [];
        const updated = current.includes(answerIndex)
          ? current.filter((a) => a !== answerIndex)
          : [...current, answerIndex];
        return { ...prev, [currentQuestionIndex]: updated };
      }
    });
  };

  const handleNext = () => {
    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!quizData) return;

    let totalScore = 0;
    let correctCount = 0;

    quizData.questions.forEach((q, idx) => {
      const correctAnswer = Array.isArray(q.correctAnswer) ? [...q.correctAnswer] : [q.correctAnswer];
      const userAnswer = userAnswers[idx] || [];

      if (JSON.stringify([...userAnswer].sort()) === JSON.stringify([...correctAnswer].sort())) {
        totalScore += q.point;
        correctCount++;
      }
    });

    const accuracy = ((correctCount / quizData.questions.length) * 100).toFixed(2);

    setQuizResults({
      score: totalScore,
      accuracy: parseFloat(accuracy),
      totalQuestions: quizData.questions.length,
    });
    setShowResults(true);
  };

  if (pathsLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!quizData) {
    return (
      <Container size="md" py="xl">
        <Stack gap="lg">
          <QuizSetup
            selectedPathId={selectedPathId}
            paths={paths}
            selectedModule={selectedModule}
            modules={modules}
            topic={topic}
            numQuestions={numQuestions}
            loading={loading}
            error={error}
            onPathChange={handlePathChange}
            onModuleChange={handleModuleChange}
            onNumQuestionsChange={setNumQuestions}
            onGenerate={handleGenerateQuiz}
          />
        </Stack>
      </Container>
    );
  }

  if (showResults && quizResults) {
    return (
      <Container size="md" py="xl">
        <Stack gap="lg">
          <QuizResults
            results={quizResults}
            onStartNew={() => {
              setQuizData(null);
              setShowResults(false);
              setUserAnswers({});
            }}
          />
        </Stack>
      </Container>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const selectedAnswers = userAnswers[currentQuestionIndex] || [];

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quizData.questions.length}
          selectedAnswers={selectedAnswers}
          showResults={false}
          onAnswerSelect={handleAnswerSelect}
          onNext={handleNext}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
          isLastQuestion={currentQuestionIndex === quizData.questions.length - 1}
        />
      </Stack>
    </Container>
  );
};

export default QuizPage;
