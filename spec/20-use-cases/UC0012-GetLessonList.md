## Description

GetLessonList returns the list of available Lessons from backend storage along with user-specific derived status.

Derived status is based on the presence and state of LessonProgress (EN0006). Absence of a LessonProgress record represents NotStarted.

---

## Preconditions

- User is authenticated (ref:UC0010).
- Lessons are available in backend storage (EN0001), seeded by SRV0006.

---

## Trigger

Frontend requests the lesson list screen data.

---

## Main Flow

1. Backend identifies the User (EN0005) from the verified Google ID token (SRV0002).
2. Backend retrieves all lessons via SRV0004.listLessons().
3. Backend retrieves all LessonProgress records for the User via SRV0005.listByUser(userId).
4. Backend derives lesson status:
   - NotStarted if no LessonProgress exists for (userId, lessonId)
   - InProgress if LessonProgress.status is InProgress
   - Completed if LessonProgress.status is Completed
5. Backend returns the lesson list including derived status for each lesson.

---

## Postconditions

- No entities are modified.

---

## Alternate Flows

### A1 – No lessons exist
- Backend returns an empty list.

---

## Related Entities

- ref:EN0005 – User
- ref:EN0006 – LessonProgress
- ref:EN0001 – Lesson

---

## Related Services

- ref:SRV0002 – GoogleTokenVerificationService
- ref:SRV0004 – LessonService
- ref:SRV0005 – LessonProgressService

---

## Related Use Cases

- ref:UC0013 – GetLessonDetail
- ref:UC0014 – StartOrResumeLesson
