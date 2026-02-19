## Description

UserService is a stateless backend service responsible for reading and upserting User (EN0005) records based on verified Google identity.

It owns the persistence boundary for User creation and lastLoginAt updates. It does not manage sessions and does not implement authorization rules beyond identity mapping.

---

## Public API

| Method | Signature | Description |
| --- | --- | --- |
| getByGoogleSub | (googleSub: string) => User \| null | Returns User by googleSub or null if not found |
| upsertFromGoogleIdentity | (identity: VerifiedGoogleIdentity, now: DateTime) => User | Creates or updates User using googleSub; updates lastLoginAt |
| touchLastLogin | (userId: UUID, now: DateTime) => User | Updates lastLoginAt for an existing User |
| ensureUser | (identity: VerifiedGoogleIdentity, now: DateTime) => User | Alias for upsertFromGoogleIdentity |

---

## Runtime Perspective

- Service is stateless.
- User identity is determined by googleSub.
- Service persists User in database via ORM.
- Service does not store authentication state.

---

## Invariants

- googleSub must be unique across all Users.
- A User must not be created without verified Google identity.
- upsert must not create duplicates for the same googleSub.
- lastLoginAt must be updated on successful login.

---

## Related Use Cases

- ref:UC0010 – User logs in via Google
- ref:UC0012 – GetLessonList
- ref:UC0013 – GetLessonDetail
- ref:UC0014 – StartOrResumeLesson
- ref:UC0015 – CompleteLesson
