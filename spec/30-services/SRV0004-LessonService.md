## Description

LessonService is a stateless backend service responsible for reading persisted Lesson content (EN0001).

It provides lesson list and lesson detail retrieval for the API layer. It does not execute deterministic scripts and does not contain chess engine logic.

---

## Public API

| Method | Signature | Description |
| --- | --- | --- |
| listLessons | () => LessonSummary[] | Returns list of available lessons (identifiers and titles) |
| getLessonById | (lessonId: string) => Lesson \| null | Returns full Lesson content by lessonId or null if not found |
| exists | (lessonId: string) => boolean | Returns true if the lesson exists |
| listLessonIds | () => string[] | Returns list of all lesson identifiers |

---

## Runtime Perspective

- Service is stateless and contains no internal stored data.
- Lesson content is stored in backend database.
- Service returns deterministic lesson content as-is.
- Service does not derive user-specific status; that belongs to progress use cases.

---

## Invariants

- LessonService must not mutate lesson content.
- LessonService must not execute or validate deterministic scripts.
- LessonService must not perform engine evaluation.

---

## Related Use Cases

- ref:UC0012
