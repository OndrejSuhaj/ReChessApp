import type { AuthContextValue, AuthUser } from '@/src/auth/types'
import type { AuthRequestPromptOptions } from 'expo-auth-session'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

import * as ApiClient from './apiClient'
import { clearTokens, getTokens, saveTokens, SESSION_EXPIRED_MSG } from './tokenStorage'

WebBrowser.maybeCompleteAuthSession()

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
}

/** Generate a random nonce string (required by Google for id_token flow). */
function generateNonce(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID

  // WEB-only: no scheme
  const redirectUri = AuthSession.makeRedirectUri()
  console.log('Redirect URI:', redirectUri)

  // Nonce is generated once per request; stored in ref so it's stable across renders.
  const nonceRef = useRef<string>(generateNonce())

  const [request, _response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: googleClientId ?? '',
      // id_token response type: Google returns a JWT ID token suitable for backend verification.
      // A nonce is required by Google when using the id_token implicit flow.
      responseType: AuthSession.ResponseType.IdToken,
      usePKCE: false,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      extraParams: { prompt: 'select_account', nonce: nonceRef.current },
    },
    GOOGLE_DISCOVERY
  )

  const signInWithGoogle = useCallback(async () => {
    if (!googleClientId) {
      setError('Missing EXPO_PUBLIC_GOOGLE_CLIENT_ID environment variable.')
      return
    }
    if (!request) {
      setError('Google login is not ready yet. Please try again.')
      return
    }

    setError(null)
    setIsAuthenticating(true)

    try {
      const result = await promptAsync({ useProxy: true } as AuthRequestPromptOptions)
      console.log('Auth result:', result)

      if (result.type !== 'success') return

      const idToken = result.params.id_token
      if (!idToken) {
        setError('Google login did not return an ID token.')
        return
      }

      const loginResult = await ApiClient.loginWithGoogleIdToken(idToken)

      saveTokens({
        accessToken: loginResult.accessToken,
        refreshToken: loginResult.refreshToken,
      })

      setAccessToken(loginResult.accessToken)
      setUser({
        id: loginResult.user.id,
        email: loginResult.user.email,
        name: loginResult.user.displayName ?? loginResult.user.email,
        picture: loginResult.user.photoUrl ?? undefined,
      })
      // Rotate nonce so a captured id_token cannot be replayed
      nonceRef.current = generateNonce()
    } catch (e) {
      console.log('Google login error:', e)
      setError(`Google login failed: ${String((e as any)?.message ?? e)}`)
    } finally {
      setIsAuthenticating(false)
    }
  }, [googleClientId, promptAsync, request])

  const signOut = useCallback(() => {
    clearTokens()
    setAccessToken(null)
    setUser(null)
    setError(null)
  }, [])

  /**
   * Delete account (UC0019): calls DELETE /me with access token (refreshing once on 401),
   * then clears local session.
   */
  const deleteAccount = useCallback(async () => {
    const tokens = getTokens()
    let token = tokens?.accessToken ?? accessToken

    if (!token) {
      throw new Error('Not authenticated')
    }

    try {
      await ApiClient.deleteMe(token)
    } catch (err: any) {
      if (err?.status === 401 && tokens?.refreshToken) {
        // Attempt token refresh once
        try {
          const refreshed = await ApiClient.refreshSession(tokens.refreshToken)
          saveTokens({ accessToken: refreshed.accessToken, refreshToken: tokens.refreshToken })
          setAccessToken(refreshed.accessToken)
          token = refreshed.accessToken
          await ApiClient.deleteMe(token)
        } catch {
          signOut()
          throw new Error(SESSION_EXPIRED_MSG)
        }
      } else {
        throw err
      }
    }

    clearTokens()
    setAccessToken(null)
    setUser(null)
    setError(null)
  }, [accessToken, signOut])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthenticating,
      error,
      accessToken,
      signInWithGoogle,
      signOut,
      deleteAccount,
    }),
    [accessToken, deleteAccount, error, isAuthenticating, signInWithGoogle, signOut, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
