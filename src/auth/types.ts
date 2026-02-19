export type AuthUser = {
  id: string
  email: string
  name: string
  picture?: string
}

/** User object returned by the backend (UC0017) */
export type BackendUser = {
  id: string
  email: string
  displayName: string | null
  photoUrl: string | null
  role: string
  createdAt?: string
  lastLoginAt?: string
}

export type LessonProgressItem = {
  lessonId: string
  status: string
  currentExerciseIndex?: number
  lastPlayedAt?: string | null
  completedAt?: string | null
  createdAt?: string
}

export type UserProgress = {
  completedCount: number
  lessons: LessonProgressItem[]
}

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isAuthenticating: boolean
  error: string | null
  accessToken: string | null
  signInWithGoogle: () => Promise<void>
  signOut: () => void
  deleteAccount: () => Promise<void>
}
