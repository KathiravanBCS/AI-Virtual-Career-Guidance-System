export interface LearningPath {
  topicName: string;
  progress: number;
}

export interface QuizScore {
  topic: string;
  accuracy: number | string;
}

export interface ProgressData {
  paths: LearningPath[];
  quizScores: QuizScore[];
  flashcardCount: number;
}
