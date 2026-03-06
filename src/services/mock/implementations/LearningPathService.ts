// Mock Learning Path Service
import { mockCareerPaths, mockModuleDetails } from '../data/learningPath';
import type { CareerPath, Lesson, Module } from '../data/learningPath';
import { delay } from '../utils';

export class LearningPathService {
  /**
   * Get all learning paths
   */
  async getAllPaths(): Promise<CareerPath[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(mockCareerPaths));
  }

  /**
   * Get path by ID
   */
  async getPathById(pathId: string): Promise<CareerPath> {
    await delay(300);
    const path = mockCareerPaths.find((p) => p.$id === pathId);
    if (!path) {
      throw new Error(`Path not found: ${pathId}`);
    }
    return JSON.parse(JSON.stringify(path));
  }

  /**
   * Get module details
   */
  async getModuleById(moduleId: string): Promise<Module> {
    await delay(300);
    const moduleData = mockModuleDetails[moduleId as keyof typeof mockModuleDetails];
    if (!moduleData) {
      throw new Error(`Module not found: ${moduleId}`);
    }
    return JSON.parse(JSON.stringify(moduleData));
  }

  /**
   * Get lesson details
   */
  async getLessonById(moduleId: string, lessonId: string): Promise<Lesson> {
    await delay(300);
    const module = await this.getModuleById(moduleId);
    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (!lesson) {
      throw new Error(`Lesson not found: ${lessonId}`);
    }
    return JSON.parse(JSON.stringify(lesson));
  }

  /**
   * Update module progress
   */
  async updateModuleProgress(moduleId: string, progress: number): Promise<Module> {
    await delay(300);
    const module = await this.getModuleById(moduleId);
    module.progress = Math.min(100, Math.max(0, progress));
    module.completed = module.progress === 100;
    return module;
  }

  /**
   * Mark lesson as completed
   */
  async completeLessonById(moduleId: string, lessonId: string): Promise<Lesson> {
    await delay(300);
    const lesson = await this.getLessonById(moduleId, lessonId);
    lesson.completed = true;
    return lesson;
  }

  /**
   * Get modules for a path
   */
  async getPathModules(pathId: string): Promise<Module[]> {
    await delay(300);
    const path = await this.getPathById(pathId);
    return path.modules;
  }

  /**
   * Search paths
   */
  async searchPaths(query: string): Promise<CareerPath[]> {
    await delay(400);
    const lowerQuery = query.toLowerCase();
    return mockCareerPaths.filter(
      (path) =>
        path.careerName.toLowerCase().includes(lowerQuery) || path.description.toLowerCase().includes(lowerQuery)
    );
  }
}

export const mockLearningPathService = new LearningPathService();
