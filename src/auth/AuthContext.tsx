import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

import type { AuthContextValue, AuthUser } from '@/src/auth/types'

WebBrowser.maybeCompleteAuthSession()

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const GOOGLE_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
}

const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

type GoogleUserInfoResponse = {
  sub: string
  email: string
  name: string
  picture?: string
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'rechessapp',
  })

  const [request, _, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: googleClientId ?? '',
      responseType: AuthSession.ResponseType.Token,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      extraParams: {
        prompt: 'select_account',
      },
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
      const result = await promptAsync()

      if (result.type !== 'success') {
        if (result.type !== 'dismiss' && result.type !== 'cancel') {
          setError('Google login was not successful.')
        }
        return
      }

      const accessToken = result.params.access_token

      if (!accessToken) {
        setError('Google login did not return an access token.')
        return
      }

      const profileResponse = await fetch(GOOGLE_USERINFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!profileResponse.ok) {
        setError('Unable to fetch Google profile information.')
        return
      }

      const profile = (await profileResponse.json()) as GoogleUserInfoResponse

      setUser({
        id: profile.sub,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      })
    } catch {
      setError('Unexpected error during Google login.')
    } finally {
      setIsAuthenticating(false)
    }
  }, [googleClientId, promptAsync, request])

  const signOut = useCallback(() => {
    setUser(null)
    setError(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthenticating,
      error,
      signInWithGoogle,
      signOut,
    }),
    [error, isAuthenticating, signInWithGoogle, signOut, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
