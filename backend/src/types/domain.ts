// Type definitions for ReChess domain entities
// Aligned with specification documents:
// - EN0001 – Lesson
// - EN0002 – Exercise
// - EN0003 – Ply
// - EN0005 – User
// - EN0006 – LessonProgress

/**
 * EN0003 – Ply
 * A single deterministic step in an Exercise script
 */
export interface Ply {
  actor: 'user' | 'system';
  uci: string; // UCI format (e.g., 'e2e4')
}

/**
 * EN0002 – Exercise
 * Defines an initial chess position and deterministic script of moves
 */
export interface Exercise {
  id: string;
  fen: string; // Initial position in FEN notation
  label: string;
  script: Ply[]; // Ordered script of moves
  successMessage: string;
}

/**
 * EN0001 – Lesson
 * Content container that groups exercises into a training unit
 */
export interface Lesson {
  lessonId: string;
  title: string;
  exercises: Exercise[];
}

/**
 * EN0005 – User
 * Authenticated identity within the application
 */
export interface User {
  id: string;
  googleSub: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  createdAt: Date;
  lastLoginAt: Date;
}

/**
 * EN0006 – LessonProgress
 * Persisted user-specific progress within a single Lesson
 */
export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: 'InProgress' | 'Completed';
  currentExerciseIndex: number;
  lastPlayedAt: Date;
  completedAt: Date | null;
}

/**
 * Verified Google identity from token verification
 * Used by SRV0002 – GoogleTokenVerificationService
 */
export interface VerifiedGoogleIdentity {
  googleSub: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
}

/**
 * Lesson summary for lesson list endpoint
 * Used by UC0012 – GetLessonList
 */
export interface LessonSummary {
  lessonId: string;
  title: string;
}

/**
 * Seed report from lesson seeding
 * Used by SRV0006 – LessonSeedService
 */
export interface SeedReport {
  success: boolean;
  message: string;
  seedResults: SeedResult[];
}

export interface SeedResult {
  lessonId: string;
  status: 'created' | 'updated' | 'skipped' | 'error';
  message?: string;
}

/**
 * Validation result for lesson JSON
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
