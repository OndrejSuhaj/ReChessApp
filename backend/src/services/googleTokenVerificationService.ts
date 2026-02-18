// SRV0002 – GoogleTokenVerificationService
// Service for verifying Google ID tokens

import { OAuth2Client } from 'google-auth-library';
import { VerifiedGoogleIdentity } from '../types/domain';

export class GoogleTokenVerificationService {
  private client: OAuth2Client;

  constructor(googleClientId: string) {
    this.client = new OAuth2Client(googleClientId);
  }

  /**
   * Verifies a Google ID token and returns verified identity
   * @param idToken - Google ID token from frontend
   * @returns Verified Google identity or null if invalid
   */
  async verifyIdToken(idToken: string): Promise<VerifiedGoogleIdentity | null> {
    // Implementation will be added in next phase
    throw new Error('Not implemented yet');
  }
}
