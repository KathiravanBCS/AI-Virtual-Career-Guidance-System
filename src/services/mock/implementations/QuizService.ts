// Mock Quiz Service
import type { QuizData, QuizQuestion, QuizResults } from '@/features/quiz/types';

import { mockLearningPathModules, mockQuizDataByModule, mockQuizQuestions } from '../data/quiz';
import { delay } from '../utils';

export class QuizService {
  /**
   * Get quiz questions for a module
   */
  async getQuizData(moduleId: string): Promise<QuizData> {
    await delay(300);
    const quizData = mockQuizDataByModule[moduleId];
    if (!quizData) {
      throw new Error(`Quiz not found for module ${moduleId}`);
    }
    return JSON.parse(JSON.stringify(quizData));
  }

  /**
   * Get quiz questions
   */
  async getQuizQuestions(moduleId: string): Promise<QuizQuestion[]> {
    const quizData = await this.getQuizData(moduleId);
    return quizData.questions as unknown as QuizQuestion[];
  }

  /**
   * Get modules for a learning path
   */
  async getPathModules(pathId: string): Promise<string[]> {
    await delay(200);
    return (mockLearningPathModules as Record<string, string[]>)[pathId] || [];
  }

  /**
   * Submit quiz answers and get results
   */
  async submitQuiz(moduleId: string, answers: (number | number[])[]): Promise<QuizResults> {
    await delay(500);

    const quizData = await this.getQuizData(moduleId);
    const questions = quizData.questions;

    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const userAnswer = answers[i];
      totalPoints += question.point || 0;

      const isCorrect = this.checkAnswer(question.correctAnswer, userAnswer);
      if (isCorrect) {
        correctCount++;
        earnedPoints += question.point || 0;
      }
    }

    const accuracy = Math.round((correctCount / questions.length) * 100);
    const score = Math.round((earnedPoints / totalPoints) * 100);

    return {
      score,
      accuracy: accuracy.toString(),
      totalQuestions: questions.length,
    };
  }

  /**
   * Check if answer is correct
   */
  private checkAnswer(correctAnswer: string | number | number[] | undefined, userAnswer: number | number[]): boolean {
    // Handle string format (e.g., "0" or "0,1,2")
    if (typeof correctAnswer === 'string') {
      const correctIndices = correctAnswer.split(',').map((x) => parseInt(x, 10));
      const userIndices = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      if (correctIndices.length !== userIndices.length) return false;
      const sortedCorrect = correctIndices.sort((a, b) => a - b);
      const sortedUser = userIndices.sort((a, b) => a - b);
      return sortedCorrect.every((val, idx) => val === sortedUser[idx]);
    }

    if (typeof correctAnswer === 'number' && typeof userAnswer === 'number') {
      return correctAnswer === userAnswer;
    }

    if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
      if (correctAnswer.length !== userAnswer.length) return false;
      const sortedCorrect = [...correctAnswer].sort((a, b) => a - b);
      const sortedUser = [...userAnswer].sort((a, b) => a - b);
      return sortedCorrect.every((val, idx) => val === sortedUser[idx]);
    }

    return false;
  }

  /**
   * Get quiz history
   */
  async getQuizHistory(): Promise<any[]> {
    await delay(300);
    return [];
  }
}

export const mockQuizService = new QuizService();
