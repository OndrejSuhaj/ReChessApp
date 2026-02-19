## Overview

| cfl:noheader | Description |
| --- | --- |
| **Trigger** | User initiates authentication using Google identity. |
| **Actors** | User<br>System |
| **Preconditions** | Google identity provider returns a verifiable ID token<br>Backend authentication endpoint is available |
| **Postconditions** | User (ref:EN0005) exists or is updated<br>`lastLoginAt` is updated<br>`role` is assigned according to allowlist rule<br>Access token is issued<br>Refresh token hash is stored |

## Main Flow

1. *User:* provides Google ID token obtained from external identity provider  
2. *System:* verifies token integrity and validity using ref:SRV0002  
3. *System:* extracts verified identity attributes (`googleSub`, `email`, `displayName`, `photoUrl`)  
4. *System:* looks up User (ref:EN0005) by `googleSub`  
5. *System:* if User does not exist, creates a new User  
6. *System:* if User exists, updates `lastLoginAt`  
7. *System:* assigns `role` based on configured admin allowlist  
8. *System:* issues application session tokens using ref:SRV0007  
9. *System:* stores `refreshTokenHash` and related timestamps on User  
10. *System:* confirms successful authentication  
End

## 2A: Invalid or Expired ID Token

- *System:* detects token verification failure  
- *System:* rejects authentication request  
End

## 4A: Token Verification Service Failure

- *System:* fails to validate token due to service error  
- *System:* rejects authentication request  
End

## Related Entities

- ref:EN0005 – User  

## Related Services

- ref:SRV0002 – GoogleTokenVerificationService  
- ref:SRV0003 – UserService  
- ref:SRV0007 – SessionService  

## Related Use Cases

- ref:UC0011 – User logs out  
- ref:UC0016 – RefreshSession  
- ref:UC0017 – GetCurrentUserProfile  
- ref:UC0018 – GetUserProgress  
- ref:UC0019 – DeleteAccount  

## Notes on Implementation Constraints

- Google ID token must be verified server-side  
- `googleSub` uniquely identifies User  
- Refresh token must never be stored in plaintext  
- Deterministic training logic must remain unaffected by authentication