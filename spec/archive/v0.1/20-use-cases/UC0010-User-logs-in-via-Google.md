## Overview

| cfl:noheader | Description |
| --- | --- |
| **Trigger** | User opens the application and is not authenticated. |
| **Actors** | User<br>System<br>Google OAuth Provider |
| **Preconditions** | No authenticated User (ref:EN0005) exists |
| **Postconditions** | User is authenticated and stored in runtime state |

## Main Flow

1. *System:* displays login screen  
2. *User:* selects Google login  
3. *System:* initiates OAuth flow  
4. *Google:* authenticates user  
5. *System:* receives authentication result  
6. *System:* creates User entity  
7. *System:* transitions application to authenticated state  
End

## 4A: Authentication Failed

- *System:* detects authentication failure  
- *System:* remains in unauthenticated state  
End

## Related Entities

- ref:EN0005 – User  
