## Description

User logs in via Google by providing a Google ID token obtained from Google OAuth.

Backend verifies the ID token and creates or updates User (EN0005). Authentication is validated per request and no backend session or JWT is issued.

---

## Preconditions

- Google OAuth flow is correctly configured on frontend.
- User initiates login via Google.
- Backend is reachable.

---

## Trigger

User selects "Login with Google" in the application.

---

## Main Flow

1. Frontend initiates Google OAuth login flow.
2. Google returns a Google ID token to the frontend.
3. Frontend sends the Google ID token to backend.
4. Backend verifies the ID token using SRV0002 – GoogleTokenVerificationService.
5. Backend extracts verified identity claims (googleSub, email, displayName).
6. Backend calls SRV0003 – UserService.upsertFromGoogleIdentity.
7. If User does not exist, a new User (EN0005) is created.
8. If User exists, lastLoginAt is updated.
9. Backend returns authenticated user context to frontend.

---

## Postconditions

- A persisted User (EN0005) exists for the verified googleSub.
- User.lastLoginAt is updated to the current timestamp.
- User is considered authenticated for subsequent requests.
- No backend session token is created.

---

## Alternate Flows

### A1 – Invalid or Expired Token

1. Backend verification fails in SRV0002.
2. Backend returns authentication error.
3. No User is created or updated.

---

### A2 – Network Failure

1. Frontend fails to send token to backend.
2. Login attempt fails.
3. No backend state is modified.

---

## Related Entities

- ref:EN0005 – User

---

## Related Services

- ref:SRV0002 – GoogleTokenVerificationService
- ref:SRV0003 – UserService

---

## Related Use Cases

- ref:UC0011 – User logs out
- ref:UC0012 – GetLessonList
