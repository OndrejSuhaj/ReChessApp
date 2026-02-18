## Description

LessonProgressService is a stateless backend service responsible for reading and updating LessonProgress (EN0006).

It encapsulates persistence operations and enforces invariants related to LessonProgress lifecycle transitions. It does not contain deterministic chess logic and does not execute scripts.

---

## Public API

| Method | Signature | Description |
| --- | --- | --- |
| getByUserAndLesson | (userId: UUID, lessonId: string) => LessonProgress \| null | Returns LessonProgress for a (User, Lesson) pair or null if it does not exist |
| listByUser | (userId: UUID) => LessonProgress[] | Returns all LessonProgress records for a user |
| ensureInProgress | (userId: UUID, lessonId: string, now: DateTime) => LessonProgress | Creates progress if missing, or updates lastPlayedAt; keeps Completed unchanged |
| markCompleted | (userId: UUID, lessonId: string, currentExerciseIndex: number, now: DateTime) => LessonProgress | Marks progress as Completed and sets completedAt and lastPlayedAt |
| touch | (userId: UUID, lessonId: string, currentExerciseIndex: number, now: DateTime) => LessonProgress | Updates lastPlayedAt and currentExerciseIndex; must not downgrade Completed |

---

## Runtime Perspective

- Service is stateless and contains no internal stored data.
- All persistence is performed via database layer (Prisma/ORM).
- Service enforces LessonProgress invariants at write boundaries.
- Service does not interpret lesson scripts and does not validate moves.

---

## Invariants

- Service must never create more than one LessonProgress per (userId, lessonId).
- Service must never change status from Completed back to InProgress.
- Service must set completedAt if and only if status is Completed.
- Service must not store or process deterministic lesson content.

---

## Related Use Cases

- ref:UC0012 – GetLessonList
- ref:UC0014 – StartOrResumeLesson
- ref:UC0015 – CompleteLesson
