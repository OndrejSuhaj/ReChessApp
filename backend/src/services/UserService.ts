import { Role, User } from '@prisma/client';
import prisma from '../db/prisma';
import { VerifiedGoogleIdentity } from './GoogleTokenVerificationService';

const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS ?? 'o.suhaj@gmail.com')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);

function resolveRole(email: string): Role {
  return ADMIN_EMAILS.includes(email) ? Role.Admin : Role.User;
}

export async function getByGoogleSub(googleSub: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { googleSub } });
}

export async function upsertFromGoogleIdentity(
  identity: VerifiedGoogleIdentity,
  now: Date,
): Promise<User> {
  const role = resolveRole(identity.email);
  return prisma.user.upsert({
    where: { googleSub: identity.googleSub },
    create: {
      googleSub: identity.googleSub,
      email: identity.email,
      displayName: identity.displayName ?? null,
      photoUrl: identity.photoUrl ?? null,
      role,
      lastLoginAt: now,
    },
    update: {
      email: identity.email,
      displayName: identity.displayName ?? null,
      photoUrl: identity.photoUrl ?? null,
      role,
      lastLoginAt: now,
    },
  });
}

export async function persistRefreshToken(
  userId: string,
  refreshTokenHash: string,
  refreshTokenCreatedAt: Date,
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshTokenHash,
      refreshTokenCreatedAt,
      refreshTokenRevokedAt: null,
    },
  });
}

export async function getById(userId: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function deleteById(userId: string): Promise<void> {
  await prisma.user.delete({ where: { id: userId } });
}

export async function touchLastLogin(userId: string, now: Date): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: now },
  });
}

export const ensureUser = upsertFromGoogleIdentity;
