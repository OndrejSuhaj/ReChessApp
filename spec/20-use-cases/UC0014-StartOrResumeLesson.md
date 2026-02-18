## Description

StartOrResumeLesson ensures a LessonProgress record exists for the authenticated User and the selected Lesson, and marks the lesson as actively being worked on.

If no LessonProgress exists, it is created as InProgress. If progress exists, it is updated to reflect recent activity. Completed progress must not be downgraded.

---

## Preconditions

- User is authenticated (ref:UC0010).
- Requested Lesson exists (EN0001).
- Backend is the source of truth for Lesson content.

---

## Trigger

User selects "Start" or "Resume" on a Lesson.

---

## Main Flow

1. Backend identifies the User (EN0005) from the verified Google ID token (SRV0002).
2. Backend validates the Lesson exists (EN0001).
3. Backend calls SRV0005.ensureInProgress(userId, lessonId, now).
4. Backend returns:
   - LessonProgress (EN0006)
   - Lesson detail or a reference for the client to fetch lesson detail via ref:UC0013

---

## Postconditions

- LessonProgress exists for (userId, lessonId).
- lastPlayedAt is updated to now.
- status is InProgress unless it was already Completed.

---

## Alternate Flows

### A1 – Lesson does not exist
- Backend returns a not-found error.
- No LessonProgress is created or modified.

### A2 – Progress already Completed
- Backend keeps status as Completed.
- Backend updates lastPlayedAt to now.

---

## Related Entities

- ref:EN0005 – User
- ref:EN0006 – LessonProgress
- ref:EN0001 – Lesson

---

## Related Services

- ref:SRV0002 – GoogleTokenVerificationService
- ref:SRV0005 – LessonProgressService
- ref:SRV0004 – LessonService

---

## Related Use Cases

- ref:UC0010 – User logs in via Google
- ref:UC0013 – GetLessonDetail
- ref:UC0015 – CompleteLesson
