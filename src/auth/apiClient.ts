import type { BackendUser, UserProgress } from './types'

const BASE_URL =
  (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

// ── helpers ─────────────────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const text = await response.text()
    throw Object.assign(new Error(text || response.statusText), { status: response.status })
  }
  return response.json() as Promise<T>
}

async function authGet<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) {
    const text = await response.text()
    throw Object.assign(new Error(text || response.statusText), { status: response.status })
  }
  return response.json() as Promise<T>
}

async function authDelete(path: string, accessToken: string): Promise<void> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok && response.status !== 204) {
    const text = await response.text()
    throw Object.assign(new Error(text || response.statusText), { status: response.status })
  }
}

// ── public API ───────────────────────────────────────────────────────────────

export type LoginResult = {
  accessToken: string
  refreshToken: string
  user: BackendUser
}

export type RefreshResult = {
  accessToken: string
}

export async function loginWithGoogleIdToken(idToken: string): Promise<LoginResult> {
  return post<LoginResult>('/auth/login', { idToken })
}

export async function refreshSession(refreshToken: string): Promise<RefreshResult> {
  return post<RefreshResult>('/auth/refresh', { refreshToken })
}

export async function getMe(accessToken: string): Promise<BackendUser> {
  return authGet<BackendUser>('/me', accessToken)
}

export async function getMyProgress(accessToken: string): Promise<UserProgress> {
  return authGet<UserProgress>('/me/progress', accessToken)
}

export async function deleteMe(accessToken: string): Promise<void> {
  return authDelete('/me', accessToken)
}
