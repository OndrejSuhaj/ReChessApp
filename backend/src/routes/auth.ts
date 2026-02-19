import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import prisma from '../db/prisma';
import { verifyIdToken, VerifiedGoogleIdentity } from '../services/GoogleTokenVerificationService';
import * as UserService from '../services/UserService';
import * as SessionService from '../services/SessionService';

interface LoginBody {
  idToken: string;
}

interface RefreshBody {
  refreshToken: string;
}

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(rateLimit, {
    max: 20,
    timeWindow: '1 minute',
    keyGenerator: (request) => request.ip,
  });
  // UC0010 – User logs in via Google
  fastify.post<{ Body: LoginBody }>(
    '/auth/login',
    {
      config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
      schema: {
        body: {
          type: 'object',
          required: ['idToken'],
          properties: {
            idToken: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
      const { idToken } = request.body;

      let identity: VerifiedGoogleIdentity;
      try {
        identity = await verifyIdToken(idToken);
      } catch (err) {
        fastify.log.warn(err, 'Google ID token verification failed');
        return reply.status(401).send({ error: 'Invalid or expired Google ID token' });
      }

      const now = new Date();
      const user = await UserService.upsertFromGoogleIdentity(identity, now);

      const { accessToken, refreshToken, refreshTokenHash, refreshTokenCreatedAt } =
        SessionService.issueTokens(user.id, user.email);

      await UserService.persistRefreshToken(user.id, refreshTokenHash, refreshTokenCreatedAt);

      return reply.send({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          photoUrl: user.photoUrl,
          role: user.role,
        },
      });
    },
  );

  // UC0016 – Refresh session
  fastify.post<{ Body: RefreshBody }>(
    '/auth/refresh',
    {
      config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
      schema: {
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: RefreshBody }>, reply: FastifyReply) => {
      const { refreshToken } = request.body;

      const hash = SessionService.hashToken(refreshToken);
      const user = await prisma.user.findFirst({
        where: { refreshTokenHash: hash, refreshTokenRevokedAt: null },
      });

      if (!user || !user.refreshTokenCreatedAt) {
        return reply.status(401).send({ error: 'Invalid refresh token' });
      }

      // Check expiry
      const expiresAt = SessionService.refreshTokenExpiresAt(user.refreshTokenCreatedAt);
      if (new Date() > expiresAt) {
        return reply.status(401).send({ error: 'Refresh token expired' });
      }

      const accessToken = SessionService.issueAccessToken(user.id, user.email);

      return reply.send({ accessToken });
    },
  );
}

