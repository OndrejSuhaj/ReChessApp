## Description

LessonSeedService is a stateless backend service responsible for seeding persisted Lesson content (EN0001) into the database from JSON lesson files.

It exists to bootstrap lesson content without requiring an admin UI. Seeding must be idempotent and must not create duplicates.

---

## Public API

| Method | Signature | Description |
| --- | --- | --- |
| seedFromJsonFiles | (paths: string[]) => SeedReport | Seeds lessons from JSON lesson files located at provided paths |
| seedFromJsonContent | (json: unknown) => SeedReport | Seeds lessons from provided JSON content |
| validateLessonJson | (json: unknown) => ValidationResult | Validates JSON structure for Lesson/Exercise/Ply shape |
| upsertLesson | (lesson: Lesson) => SeedResult | Creates or updates lesson content in DB |

---

## Runtime Perspective

- Service is stateless and contains no internal stored data.
- Service is typically invoked during deployment, local setup, or a maintenance command.
- Service must not require user authentication.
- Lesson content is stored as deterministic data.

---

## Invariants

- Seeding must be idempotent.
- lessonId must be unique across all seeded lessons.
- Seed must not create duplicate Lesson records for the same lessonId.
- Seed must preserve deterministic script ordering.
- Seed must not introduce engine logic or computed moves.

---

## Related Use Cases

- ref:UC0012 – GetLessonList
- ref:UC0013 – GetLessonDetail
