import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { LessonProgressStatus } from '@prisma/client';
import { authenticate } from '../plugins/authenticate';
import * as UserService from '../services/UserService';
import * as LessonProgressService from '../services/LessonProgressService';

export async function meRoutes(fastify: FastifyInstance): Promise<void> {
  // UC0017 – GET /me (profile)
  fastify.get(
    '/me',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user!;
      return reply.send({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        photoUrl: user.photoUrl,
        role: user.role,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      });
    },
  );

  // UC0018 – GET /me/progress
  fastify.get(
    '/me/progress',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user!;
      const progresses = await LessonProgressService.listByUserId(user.id);
      const completedCount = progresses.filter(
        (p) => p.status === LessonProgressStatus.Completed,
      ).length;
      return reply.send({
        completedCount,
        lessons: progresses.map((p) => ({
          lessonId: p.lessonId,
          status: p.status,
          currentExerciseIndex: p.currentExerciseIndex,
          lastPlayedAt: p.lastPlayedAt,
          completedAt: p.completedAt,
          createdAt: p.createdAt,
        })),
      });
    },
  );

  // UC0019 – DELETE /me (hard delete)
  fastify.delete(
    '/me',
    { preHandler: authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user!;
      await UserService.deleteById(user.id);
      return reply.status(204).send();
    },
  );
}
