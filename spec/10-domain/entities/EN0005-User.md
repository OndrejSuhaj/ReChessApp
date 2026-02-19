## Description

User represents an authenticated identity within the application. In v0.3, authentication becomes backend-authoritative: backend verifies Google identity at login, persists User, and issues application session tokens.

User is required to access authenticated backend features and owns user-specific progress data. User does not influence deterministic script execution.

## Data Structure

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | yes | Internal unique identifier |
| googleSub | string | yes | Google subject identifier (unique) |
| email | string | yes | Email from verified Google identity |
| displayName | string | no | Display name of the user |
| photoUrl | string | no | Profile image URL |
| role | enum(User,Admin) | yes | System role |
| refreshTokenHash | string | no | Hash of refresh token for session continuation |
| refreshTokenCreatedAt | string | no | Timestamp when current refresh token was issued |
| refreshTokenRevokedAt | string | no | Timestamp when refresh token was revoked |
| lastLoginAt | string | yes | Timestamp of last successful login |
| createdAt | string | yes | Timestamp of user creation |

## State Model

| State | Description | Related UC |
| --- | --- | --- |
| Authenticated | User is logged in and allowed to access authenticated backend features | ref:UC0010 |
| Unauthenticated | User is not logged in and cannot access authenticated backend features | ref:UC0011 |

## Runtime Perspective

- User is created or updated after successful Google identity verification  
- User is identified by googleSub  
- User owns LessonProgress records  
- Role is assigned during login based on configured allowlist  
- Refresh token is represented only by refreshTokenHash  

## Invariants

- Deterministic script logic is independent of User  
- googleSub uniquely identifies User  
- User is not created without verified Google identity  
- Refresh token is never stored in plaintext  

## Related Use Cases

- ref:UC0010 – User logs in via Google  
- ref:UC0011 – User logs out  
- ref:UC0016 – RefreshSession  
- ref:UC0017 – GetCurrentUserProfile  
- ref:UC0018 – GetUserProgress  
- ref:UC0019 – DeleteAccount