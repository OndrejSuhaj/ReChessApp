## Description

GoogleTokenVerificationService is a stateless backend service responsible for verifying Google ID tokens and extracting authenticated identity claims.

It is used to authenticate requests without issuing backend sessions or JWTs. Verification is performed per request.

---

## Public API

| Method | Signature | Description |
| --- | --- | --- |
| verifyIdToken | (idToken: string) => VerifiedGoogleIdentity | Verifies a Google ID token and returns verified identity claims |
| extractBearerToken | (authorizationHeader: string \| undefined) => string \| null | Extracts token value from Authorization: Bearer header |
| verifyFromAuthorizationHeader | (authorizationHeader: string \| undefined) => VerifiedGoogleIdentity | Convenience method: extractBearerToken + verifyIdToken |

---

## Runtime Perspective

- Service is stateless and performs verification on demand.
- Service relies on Google public keys / official verification mechanism.
- Service does not cache sessions and does not issue tokens.
- Service provides only verified identity claims required by the backend.

---

## Invariants

- Verification must fail if token is invalid, expired, or not intended for this application.
- Returned identity must be derived solely from verified token claims.
- Service must not persist authentication state.

---

## Related Use Cases

- ref:UC0010 – User logs in via Google
- ref:UC0012 – GetLessonList
- ref:UC0013 – GetLessonDetail
- ref:UC0014 – StartOrResumeLesson
- ref:UC0015 – CompleteLesson
