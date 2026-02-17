import React from 'react'

import { useAuth } from '@/src/auth/AuthContext'
import { LoginScreen } from '@/src/ui/LoginScreen'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return <>{children}</>
}
