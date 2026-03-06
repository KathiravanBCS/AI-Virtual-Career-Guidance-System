// Mock Flashcard Service
import { mockFlashcards, mockFlashcardsByModule } from '../data/flashcard';
import type { Flashcard } from '../data/flashcard';
import { delay } from '../utils';

export class FlashcardService {
  /**
   * Get all flashcards
   */
  async getAllFlashcards(): Promise<Flashcard[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockFlashcards));
  }

  /**
   * Get flashcards by module
   */
  async getFlashcardsByModule(moduleId: string): Promise<Flashcard[]> {
    await delay(300);
    const flashcards = mockFlashcardsByModule[moduleId] || [];
    return JSON.parse(JSON.stringify(flashcards));
  }

  /**
   * Get flashcard by ID
   */
  async getFlashcardById(id: string): Promise<Flashcard> {
    await delay(200);
    const flashcard = mockFlashcards.find((fc) => fc.id === id);
    if (!flashcard) {
      throw new Error(`Flashcard not found: ${id}`);
    }
    return JSON.parse(JSON.stringify(flashcard));
  }

  /**
   * Get flashcards by difficulty
   */
  async getFlashcardsByDifficulty(moduleId: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<Flashcard[]> {
    await delay(300);
    const flashcards = await this.getFlashcardsByModule(moduleId);
    return flashcards.filter((fc) => fc.difficulty === difficulty);
  }

  /**
   * Create new flashcard
   */
  async createFlashcard(
    moduleId: string,
    front: string,
    back: string,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): Promise<Flashcard> {
    await delay(400);
    const newFlashcard: Flashcard = {
      id: `fc-${Date.now()}`,
      front,
      back,
      moduleId,
      moduleName: 'Custom Module',
      difficulty,
    };
    mockFlashcards.push(newFlashcard);
    return newFlashcard;
  }

  /**
   * Update flashcard
   */
  async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<Flashcard> {
    await delay(300);
    const flashcard = await this.getFlashcardById(id);
    Object.assign(flashcard, updates);
    const index = mockFlashcards.findIndex((fc) => fc.id === id);
    mockFlashcards[index] = flashcard;
    return JSON.parse(JSON.stringify(flashcard));
  }

  /**
   * Mark flashcard as reviewed
   */
  async markAsReviewed(id: string): Promise<Flashcard> {
    await delay(200);
    return this.updateFlashcard(id, {
      lastReviewed: new Date().toISOString().split('T')[0],
    });
  }

  /**
   * Delete flashcard
   */
  async deleteFlashcard(id: string): Promise<void> {
    await delay(300);
    const index = mockFlashcards.findIndex((fc) => fc.id === id);
    if (index === -1) {
      throw new Error(`Flashcard not found: ${id}`);
    }
    mockFlashcards.splice(index, 1);
  }

  /**
   * Get flashcards needing review
   */
  async getFlashcardsNeedingReview(moduleId: string): Promise<Flashcard[]> {
    await delay(300);
    const today = new Date().toISOString().split('T')[0];
    const flashcards = await this.getFlashcardsByModule(moduleId);
    return flashcards.filter((fc) => !fc.lastReviewed || fc.lastReviewed < today);
  }
}

export const mockFlashcardService = new FlashcardService();
