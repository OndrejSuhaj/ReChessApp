// SRV0003 – UserService
// Service for User entity persistence operations

import { PrismaClient } from '@prisma/client';
import { User, VerifiedGoogleIdentity } from '../types/domain';

export class UserService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Returns User by googleSub or null if not found
   */
  async getByGoogleSub(googleSub: string): Promise<User | null> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }

  /**
   * Creates or updates User using googleSub; updates lastLoginAt
   */
  async upsertFromGoogleIdentity(
    identity: VerifiedGoogleIdentity,
    now: Date
  ): Promise<User> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }

  /**
   * Updates lastLoginAt for an existing User
   */
  async touchLastLogin(userId: string, now: Date): Promise<User> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }

  /**
   * Alias for upsertFromGoogleIdentity
   */
  async ensureUser(identity: VerifiedGoogleIdentity, now: Date): Promise<User> {
    return this.upsertFromGoogleIdentity(identity, now);
  }
}
