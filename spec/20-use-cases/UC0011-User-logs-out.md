## Description

User logs out by clearing client-side authentication state.

Since backend does not issue its own session tokens or JWTs, logout does not require server-side invalidation. Subsequent backend requests require a valid Google ID token.

---

## Preconditions

- User is currently authenticated via Google ID token.
- Frontend holds authentication state.

---

## Trigger

User selects "Logout" in the application.

---

## Main Flow

1. User selects logout.
2. Frontend clears locally stored authentication state.
3. Frontend removes stored Google ID token.
4. Application returns to unauthenticated state.

---

## Postconditions

- Client-side authentication state is removed.
- No backend state is modified.
- Subsequent API requests without valid Google ID token will fail authentication.

---

## Alternate Flows

### A1 – User Already Logged Out

1. Logout is triggered while no authentication state exists.
2. System remains in unauthenticated state.
3. No additional action is required.

---

## Related Entities

- ref:EN0005 – User

---

## Related Services

- ref:SRV0002 – GoogleTokenVerificationService

---

## Related Use Cases

- ref:UC0010 – User logs in via Google
- ref:UC0012 – GetLessonList
