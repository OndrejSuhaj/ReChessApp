/**
 * In-memory token storage.
 * Tokens are cleared when the app is closed / reloaded.
 * For persistent storage, replace with expo-secure-store or AsyncStorage.
 */

export type StoredTokens = {
  accessToken: string
  refreshToken: string
}

export const SESSION_EXPIRED_MSG = 'Session expired. Please log in again.'

let _tokens: StoredTokens | null = null

export function saveTokens(tokens: StoredTokens): void {
  _tokens = tokens
}

export function getTokens(): StoredTokens | null {
  return _tokens
}

export function clearTokens(): void {
  _tokens = null
}
