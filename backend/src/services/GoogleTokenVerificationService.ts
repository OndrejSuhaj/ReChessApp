import { OAuth2Client } from 'google-auth-library';

export interface VerifiedGoogleIdentity {
  googleSub: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function verifyIdToken(idToken: string): Promise<VerifiedGoogleIdentity> {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Empty token payload');
  }
  const googleSub = payload.sub;
  const email = payload.email;
  if (!email) {
    throw new Error('Token missing email claim');
  }
  return {
    googleSub,
    email,
    displayName: payload.name ?? undefined,
    photoUrl: payload.picture ?? undefined,
  };
}

export function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) return null;
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export async function verifyFromAuthorizationHeader(
  authorizationHeader: string | undefined,
): Promise<VerifiedGoogleIdentity> {
  const token = extractBearerToken(authorizationHeader);
  if (!token) {
    throw new Error('Missing or malformed Authorization header');
  }
  return verifyIdToken(token);
}
