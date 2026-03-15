// Quiz Question (individual question in a quiz)
export interface QuizQuestion {
  id?: number;
  quiz_id: number;
  question_text: string;
  question_type: string;
  answers: string[];
  correct_answer: string;
  explanation: string;
  points: number;
  question_order: number;
}

// Quiz Set/Collection
export interface Quiz {
  id?: number;
  quiz_code: string;
  learning_module_id: number;
  title: string;
  description: string;
  topic: string;
  questions_count: number;
  total_points: number;
  status: string;
  questions?: QuizQuestion[];
  created_at?: string;
  updated_at?: string;
}

// Create/Update Quiz
export interface CreateQuizRequest {
  learning_module_id: number;
  title: string;
  description: string;
  topic: string;
  questions_count: number;
  total_points: number;
  status: 'active' | 'inactive' | 'draft';
}

// Create/Update Quiz Question
export interface CreateQuizQuestionRequest {
  quiz_id: number;
  question_text: string;
  question_type: string;
  answers: string[];
  correct_answer: string;
  explanation: string;
  points: number;
  question_order: number;
}

// API Response for Quizzes List
export interface QuizzesListResponse {
  data: Quiz[];
  total: number;
  page: number;
  per_page: number;
}

// API Response for Quiz Questions List
export interface QuizQuestionsListResponse {
  data: QuizQuestion[];
  total: number;
  page: number;
  per_page: number;
}

// Legacy/Display types (kept for backward compatibility with components)
export interface DisplayQuestion {
  question: string;
  options?: string[];
  answers?: string[];
  correctAnswer?: string | number | number[];
  explanation?: string;
  point?: number;
  questionType?: 'single' | 'multiple_choice' | 'multiple';
}

export interface QuizData {
  topic: string;
  questions: DisplayQuestion[];
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
