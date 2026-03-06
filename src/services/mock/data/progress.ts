// Mock Progress Data
export interface ProgressStats {
  totalFlashcards: number;
  reviewedFlashcards: number;
  masteredFlashcards: number;
}

export interface QuizProgressData {
  date: string;
  accuracy: number;
  score: number;
  total: number;
}

export interface LearningPathProgress {
  pathName: string;
  totalModules: number;
  completedModules: number;
  progress: number;
  lastUpdated: string;
}

export const mockProgressStats: ProgressStats = {
  totalFlashcards: 45,
  reviewedFlashcards: 38,
  masteredFlashcards: 22,
};

// Generate mock quiz progress data for last 30 days
function generateQuizProgressData(): QuizProgressData[] {
  const data: QuizProgressData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Random quiz scores
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    const accuracy = score; // Using score as accuracy for simplicity

    data.push({
      date: dateStr,
      accuracy,
      score,
      total: 100,
    });
  }

  return data;
}

export const mockQuizProgress: QuizProgressData[] = generateQuizProgressData();

export const mockLearningPathProgress: LearningPathProgress[] = [
  {
    pathName: 'Full Stack Developer',
    totalModules: 8,
    completedModules: 2,
    progress: 25,
    lastUpdated: '2024-02-20',
  },
  {
    pathName: 'Frontend Developer',
    totalModules: 6,
    completedModules: 2,
    progress: 33,
    lastUpdated: '2024-02-19',
  },
  {
    pathName: 'Backend Developer',
    totalModules: 7,
    completedModules: 0,
    progress: 0,
    lastUpdated: '2024-02-15',
  },
];
