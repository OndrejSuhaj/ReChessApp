// SRV0004 – LessonService
// Service for Lesson entity operations

import { PrismaClient } from '@prisma/client';
import { Lesson, LessonSummary } from '../types/domain';

export class LessonService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Returns list of available lessons (identifiers and titles)
   */
  async listLessons(): Promise<LessonSummary[]> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }

  /**
   * Returns full Lesson content by lessonId or null if not found
   */
  async getLessonById(lessonId: string): Promise<Lesson | null> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }

  /**
   * Returns true if the lesson exists
   */
  async exists(lessonId: string): Promise<boolean> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }

  /**
   * Returns list of all lesson identifiers
   */
  async listLessonIds(): Promise<string[]> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }
}
