## Description

CompleteLesson marks a Lesson as completed for the authenticated User by updating LessonProgress to Completed.

This use case persists completion but does not validate chess moves or scripts. Deterministic completion is determined by the frontend runner.

---

## Preconditions

- User is authenticated (ref:UC0010).
- Lesson exists (EN0001).
- Frontend has determined the Lesson is completed by deterministic script execution.

---

## Trigger

Frontend notifies backend that the Lesson was completed.

---

## Main Flow

1. Backend identifies the User (EN0005) from the verified Google ID token (SRV0002).
2. Backend validates the Lesson exists (EN0001).
3. Backend calls SRV0005.markCompleted(userId, lessonId, currentExerciseIndex, now).
4. Backend returns updated LessonProgress (EN0006).

---

## Postconditions

- LessonProgress status is Completed.
- completedAt is set to now.
- lastPlayedAt is set to now.

---

## Alternate Flows

### A1 – Lesson does not exist
- Backend returns a not-found error.
- No LessonProgress is created or modified.

### A2 – Progress record does not exist yet
- Backend creates LessonProgress and sets it to Completed in the same operation.

### A3 – Already Completed
- Backend keeps status Completed.
- Backend may update lastPlayedAt to now.
- completedAt must remain set.

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

- ref:UC0014 – StartOrResumeLesson
- ref:UC0012 – GetLessonList
