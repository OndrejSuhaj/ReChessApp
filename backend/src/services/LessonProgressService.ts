import { LessonProgress } from '@prisma/client';
import prisma from '../db/prisma';

export async function listByUserId(userId: string): Promise<LessonProgress[]> {
  return prisma.lessonProgress.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
}
