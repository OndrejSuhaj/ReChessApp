import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '@prisma/client';
import * as SessionService from '../services/SessionService';
import * as UserService from '../services/UserService';

declare module 'fastify' {
  interface FastifyRequest {
    user: User | null;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);

  let payload: SessionService.AccessTokenPayload;
  try {
    payload = SessionService.verifyAccessToken(token);
  } catch {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  const user = await UserService.getById(payload.sub);
  if (!user) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  request.user = user;
}
