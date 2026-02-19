import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET_RAW = process.env.JWT_SECRET;
if (!JWT_SECRET_RAW) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET: string = JWT_SECRET_RAW;

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface AccessTokenPayload {
  sub: string;  // User UUID
  email: string;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
  refreshTokenCreatedAt: Date;
}

export function issueTokens(userId: string, email: string): SessionTokens {
  const accessToken = jwt.sign(
    { sub: userId, email } satisfies AccessTokenPayload,
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL },
  );

  const refreshToken = crypto.randomBytes(64).toString('hex');
  const refreshTokenHash = hashToken(refreshToken);
  const refreshTokenCreatedAt = new Date();

  return { accessToken, refreshToken, refreshTokenHash, refreshTokenCreatedAt };
}

export function issueAccessToken(userId: string, email: string): string {
  return jwt.sign(
    { sub: userId, email } satisfies AccessTokenPayload,
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL },
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function refreshTokenExpiresAt(createdAt: Date): Date {
  return new Date(createdAt.getTime() + REFRESH_TOKEN_TTL_SECONDS * 1000);
}
