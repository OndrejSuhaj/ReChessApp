// SRV0005 – LessonProgressService
// Service for LessonProgress entity operations

import { PrismaClient } from '@prisma/client';
import { LessonProgress } from '../types/domain';

export class LessonProgressService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Returns LessonProgress for a (User, Lesson) pair or null if it does not exist
   */
  async getByUserAndLesson(
    userId: string,
    lessonId: string
  ): Promise<LessonProgress | null> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }

  /**
   * Returns all LessonProgress records for a user
   */
  async listByUser(userId: string): Promise<LessonProgress[]> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }

  /**
   * Creates progress if missing, or updates lastPlayedAt; keeps Completed unchanged
   */
  async ensureInProgress(
    userId: string,
    lessonId: string,
    now: Date
  ): Promise<LessonProgress> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }

  /**
   * Marks progress as Completed and sets completedAt and lastPlayedAt
   */
  async markCompleted(
    userId: string,
    lessonId: string,
    currentExerciseIndex: number,
    now: Date
  ): Promise<LessonProgress> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }

  /**
   * Updates lastPlayedAt and currentExerciseIndex; must not downgrade Completed
   */
  async touch(
    userId: string,
    lessonId: string,
    currentExerciseIndex: number,
    now: Date
  ): Promise<LessonProgress> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }
}
