export interface QuizQuestion {
  question: string;
  answers: string[];
  correctAnswer: number | number[];
  explanation: string;
  point: number;
  questionType: 'single' | 'multiple_choice' | 'multiple';
}

export interface QuizData {
  topic: string;
  questions: QuizQuestion[];
}

export interface QuizResults {
  score: number;
  accuracy: number | string;
  totalQuestions: number;
}

export interface LearningPath {
  $id: string;
  careerName: string;
  modules?: Array<{ title: string; description?: string }>;
}
