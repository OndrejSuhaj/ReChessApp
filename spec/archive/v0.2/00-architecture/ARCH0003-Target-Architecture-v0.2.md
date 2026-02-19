# ARCH0003 – Target Architecture v0.2

## Description

This document defines the target architecture for ReChess version v0.2.

Version v0.2 introduces backend persistence and authentication while preserving the deterministic script-driven core.

This document defines architectural intent, responsibility boundaries, and references to detailed specification documents.

For the current implementation baseline (v0.1), see:

ARCH0002 – Current Code Baseline

---

## Specification Version

Specification Version: v0.2 – Backend Persistence Introduced

---

## Architectural Intent

ReChess remains a deterministic script-driven chess trainer.

It is NOT a chess engine.  
It must NEVER evaluate positions.  
It must NEVER calculate best moves.

The deterministic script runner remains the core invariant of the system.

Backend integration must:

- Introduce persistence.
- Introduce authentication.
- Make backend the source of truth for lessons.
- Preserve deterministic execution model.
- Avoid duplication of chess logic.

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

Frontend must not:

- Persist lessons.
- Persist lesson progress.
- Verify Google ID tokens.
- Implement engine logic.

---

### Backend Layer

Authoritative documents:

- EN0005 – User
- EN0006 – LessonProgress
- EN0001 – Lesson
- SRV0002 – GoogleTokenVerificationService
- SRV0003 – UserService
- SRV0004 – LessonService
- SRV0005 – LessonProgressService
- SRV0006 – LessonSeedService
- UC0010 – User logs in via Google
- UC0011 – User logs out
- UC0012 – GetLessonList
- UC0013 – GetLessonDetail
- UC0014 – StartOrResumeLesson
- UC0015 – CompleteLesson

Backend responsibilities:

- Verify Google ID tokens.
- Persist User.
- Persist LessonProgress.
- Persist and serve Lesson content.
- Seed lessons from JSON.
- Expose minimal REST API.

Backend must not:

- Execute chess engine logic.
- Recalculate deterministic scripts.
- Issue JWT sessions.
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
- SRV0002 – GoogleTokenVerificationService
- SRV0003 – UserService

Architecture decision:

- User is persisted after successful Google ID token verification.
- User identity is determined by googleSub.
- Backend does not issue its own session token.

---

### LessonProgress

Defined in:

- EN0006 – LessonProgress

Behavior defined in:

- UC0014 – StartOrResumeLesson
- UC0015 – CompleteLesson
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
- SRV0002 – GoogleTokenVerificationService
- SRV0003 – UserService

Architecture decision:

- Backend verifies Google ID token per request.
- Backend does not issue its own JWT.
- No custom password system exists.

---

## Lesson Delivery Model

Lesson retrieval behavior is specified in:

- UC0012 – GetLessonList
- UC0013 – GetLessonDetail
- SRV0004 – LessonService

Architecture decision:

- Lessons are stored in database.
- Lessons are seeded from existing JSON.
- Frontend does not embed lesson JSON.
- Backend is the authoritative lesson source.

---

## Progress Model

Progress behavior is specified in:

- EN0006 – LessonProgress
- UC0014 – StartOrResumeLesson
- UC0015 – CompleteLesson
- SRV0005 – LessonProgressService

Architecture decision:

- Backend persists progress.
- Frontend reflects progress status.
- Deterministic lesson execution remains client-side.

---

## Technology Constraints

Backend stack:

- Node.js
- TypeScript
- Fastify
- Prisma ORM

Database:

- PostgreSQL

Lesson content storage:

- JSONB (for deterministic lesson content)

No alternative stack is introduced in v0.2.

---

## Changes Compared to v0.1

v0.1 architecture is documented in:

ARCH0002 – Current Code Baseline

v0.2 introduces:

- Backend service layer.
- PostgreSQL database.
- Persisted User (EN0005).
- Persisted LessonProgress (EN0006).
- Backend lesson source of truth.
- Lesson seed mechanism (SRV0006).
- Backend use cases UC0012–UC0015.

Deterministic script runner remains unchanged.

---

## Scope Boundaries

v0.2 explicitly excludes:

- Attempt history logging.
- Spaced repetition.
- Admin UI.
- Role-based access control.
- Distributed systems.
- Public SaaS deployment.

Future features must be introduced in separate architectural revisions.

---

## Deterministic Invariant

The deterministic script runner remains unchanged.

All architectural decisions in v0.2 must preserve:

- Script-driven execution.
- Single valid user move per ply.
- No engine evaluation.
- No best-move computation.

## Backend Anchor (v0.2)

Backend persistence slice + Fastify bootstrap correspond to repository state at:

`35f4a9a`

If API contract, Prisma schema, or health semantics change,
ARCH0003 and related EN documents must be updated.
