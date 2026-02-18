## Description

LessonProgress represents persisted user-specific progress within a single Lesson.

It links a User to a Lesson and captures the current progression state. It does not contain lesson content or deterministic script logic. It exists solely to store durable progress information in backend storage.

---

## Data Structure

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | UUID | yes | Unique identifier of the LessonProgress record |
| userId | UUID | yes | Reference to User (EN0005) |
| lessonId | string | yes | Reference to Lesson (EN0001) |
| status | enum(InProgress, Completed) | yes | Current progress state |
| currentExerciseIndex | number | yes | Index of the current exercise within Lesson |
| lastPlayedAt | DateTime | yes | Timestamp of last activity |
| completedAt | DateTime | no | Timestamp when Lesson was completed |

---

## State Model

| State | Description | Related UC |
| --- | --- | --- |
| InProgress | User has started the Lesson and not yet completed it | ref:UC0014 |
| Completed | User has completed all exercises in the Lesson | ref:UC0015 |

---

## Runtime Perspective

- Entity is persisted in backend storage.
- One LessonProgress exists per (User, Lesson).
- Absence of LessonProgress record represents NotStarted.
- State transitions are triggered exclusively by backend use cases.
- Entity contains no deterministic script logic.

---

## Invariants

- A LessonProgress must reference exactly one User.
- A LessonProgress must reference exactly one Lesson.
- Only one LessonProgress may exist per (userId, lessonId).
- status must be either InProgress or Completed.
- completedAt must be set if and only if status is Completed.
- LessonProgress must not contain lesson content or script data.

---

## Related Use Cases

- ref:UC0014 – StartOrResumeLesson
- ref:UC0015 – CompleteLesson
- ref:UC0012 – GetLessonList
