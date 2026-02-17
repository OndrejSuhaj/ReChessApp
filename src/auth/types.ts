export type AuthUser = {
  id: string
  email: string
  name: string
  picture?: string
}

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isAuthenticating: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signOut: () => void
}
