## Description

User represents an authenticated identity within the application. The current implementation supports authentication via Google OAuth using client-side flow.

User existence is required to access application features. User does not influence deterministic script execution.

## Data Structure

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| userId | string | yes | Unique identifier provided by Google |
| email | string | yes | Email address returned by OAuth provider |
| displayName | string | no | Display name of the user |
| photoUrl | string | no | Profile image URL |

## State Model

| State | Description | Related UC |
| --- | --- | --- |
| Authenticated | User is logged in and allowed to access the application | ref:UC0010 |
| Unauthenticated | User is not logged in and cannot access application features | ref:UC0010 |

## Runtime Perspective

- User is created after successful OAuth authentication  
- User is stored in runtime memory  
- Logout removes User from runtime state  
- Authentication state gates access to the application  

## Invariants

- Deterministic script logic is independent of User  
- Application content is inaccessible when unauthenticated  

## Related Use Cases

- ref:UC0010 – User logs in via Google  
- ref:UC0011 – User logs out  
