# ARCH0004 – Target Architecture v0.3

## Description

This document defines the target architecture for ReChess version v0.3.

Version v0.3 introduces backend-authoritative authentication with an application session model (access + refresh) while preserving the deterministic script-driven core.

This document defines architectural intent, responsibility boundaries, and references to detailed specification documents.

---

## Specification Version

Specification Version: v0.3 – Backend Sessions and User Self-Service

---

## Architectural Intent

ReChess remains a deterministic script-driven chess trainer.

It is NOT a chess engine.  
It must NEVER evaluate positions.  
It must NEVER calculate best moves.

The deterministic script runner remains the core invariant of the system.

v0.3 introduces:

- Backend-authoritative authentication.
- Application session model (access + refresh).
- Minimal role model for future admin UI.
- User self-service profile and progress endpoints.
- Account deletion capability.

Simplicity is preferred over flexibility.
No microservices.
No distributed architecture.
No unnecessary abstraction layers.

---

## Architectural Layers

### Frontend Layer

Authoritative documents:

- ST0001 – RunState
- EN0001 – Lesson
- EN0002 – Exercise
- EN0003 – Ply
- UX0001 – Design Brief – Current Version
- UC0001–UC0004 (lesson execution flow)

Frontend responsibilities:

- Execute deterministic script runner.
- Manage RunState (runtime-only).
- Render UI.
- Obtain Google ID token.
- Call backend API.
- Store backend-issued access token and use it for authenticated requests.
- Provide confirmation UX for account deletion.

Frontend must not:

- Persist lessons.
- Persist lesson progress.
- Verify Google ID tokens.
- Issue its own application sessions.
- Implement engine logic.

---

### Backend Layer

Authoritative documents:

- EN0005 – User
- EN0006 – LessonProgress
- EN0001 – Lesson
- SRV0002 – GoogleTokenVerificationService
- SRV0003 – UserService
- SRV0007 – SessionService
- SRV0004 – LessonService
- SRV0005 – LessonProgressService
- SRV0006 – LessonSeedService
- UC0010 – User logs in via Google
- UC0011 – User logs out
- UC0012 – GetLessonList
- UC0013 – GetLessonDetail
- UC0014 – StartOrResumeLesson
- UC0015 – CompleteLesson
- UC0016 – RefreshSession
- UC0017 – GetCurrentUserProfile
- UC0018 – GetUserProgress
- UC0019 – DeleteAccount

Backend responsibilities:

- Verify Google ID tokens.
- Persist User.
- Assign User.role using configured admin allowlist rule.
- Issue and validate application session tokens.
- Persist refresh token hash on User.
- Persist LessonProgress.
- Persist and serve Lesson content.
- Seed lessons from JSON.
- Expose minimal REST API.

Backend must not:

- Execute chess engine logic.
- Recalculate deterministic scripts.
- Store runtime RunState.

---

## Data Ownership Model

### Lessons

Defined in:

- EN0001 – Lesson
- EN0002 – Exercise
- EN0003 – Ply

Architecture decision:

- Backend is the source of truth for lesson content.
- Lessons are stored in database.
- Lessons are seeded via SRV0006 – LessonSeedService.
- Frontend consumes lessons via UC0012 and UC0013.

---

### User

Defined in:

- EN0005 – User

Behavior defined in:

- UC0010 – User logs in via Google
- UC0011 – User logs out
- UC0016 – RefreshSession
- UC0017 – GetCurrentUserProfile
- UC0018 – GetUserProgress
- UC0019 – DeleteAccount
- SRV0002 – GoogleTokenVerificationService
- SRV0003 – UserService
- SRV0007 – SessionService

Architecture decision:

- User is persisted after successful Google ID token verification.
- User identity is determined by googleSub.
- Backend issues application sessions (access + refresh).
- Refresh token is stored only as hash on User.
- User.role is set using a configuration allowlist rule.

---

### LessonProgress

Defined in:

- EN0006 – LessonProgress

Behavior defined in:

- UC0014 – StartOrResumeLesson
- UC0015 – CompleteLesson
- UC0018 – GetUserProgress
- SRV0005 – LessonProgressService

Architecture decision:

- One LessonProgress per (User, Lesson).
- Absence of LessonProgress record represents NotStarted.
- Backend persists progress state.
- Frontend derives UI state from backend data.

---

### RunState

Defined in:

- ST0001 – RunState

Architecture decision:

- RunState is runtime-only.
- RunState is not persisted.
- RunState is reconstructed from Lesson content and LessonProgress.
- Backend never stores RunState.

---

## Authentication Model

Authentication behavior is specified in:

- UC0010 – User logs in via Google
- UC0011 – User logs out
- UC0016 – RefreshSession
- UC0017 – GetCurrentUserProfile
- UC0018 – GetUserProgress
- UC0019 – DeleteAccount
- SRV0002 – GoogleTokenVerificationService
- SRV0003 – UserService
- SRV0007 – SessionService

Architecture decision:

- Backend verifies Google ID token at login.
- Backend issues an application access token for authenticated requests.
- Backend stores a refresh token hash on User for session continuation.
- No custom password system exists in v0.3.

---

## Changes to SPEC Documents

### Modified

- EN0005 – User
- UC0010 – User logs in via Google
- SRV0003 – UserService

### New

- UC0016 – RefreshSession
- UC0017 – GetCurrentUserProfile
- UC0018 – GetUserProgress
- UC0019 – DeleteAccount
- SRV0007 – SessionService