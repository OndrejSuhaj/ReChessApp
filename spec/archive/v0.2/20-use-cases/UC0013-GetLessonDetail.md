## Description

GetLessonDetail returns full Lesson content for a specified lessonId from backend storage.

Lesson content is deterministic and contains no user-specific state. Progress is handled separately via LessonProgress (EN0006).

---

## Preconditions

- User is authenticated (ref:UC0010).
- Requested Lesson exists in backend storage (EN0001).

---

## Trigger

Frontend requests lesson detail for a selected lesson.

---

## Main Flow

1. Backend identifies the User (EN0005) from the verified Google ID token (SRV0002).
2. Backend retrieves Lesson by lessonId via SRV0004.getLessonById(lessonId).
3. Backend returns the Lesson content.

---

## Postconditions

- No entities are modified.

---

## Alternate Flows

### A1 – Lesson does not exist
- Backend returns a not-found error.

---

## Related Entities

- ref:EN0001 – Lesson
- ref:EN0005 – User

---

## Related Services

- ref:SRV0002 – GoogleTokenVerificationService
- ref:SRV0004 – LessonService

---

## Related Use Cases

- ref:UC0012 – GetLessonList
- ref:UC0014 – StartOrResumeLesson
