## Overview

| cfl:noheader | Description |
| --- | --- |
| **Trigger** | User selects logout action. |
| **Actors** | User<br>System |
| **Preconditions** | User (ref:EN0005) is authenticated |
| **Postconditions** | User is removed from runtime state<br>Application returns to login screen |

## Main Flow

1. *User:* selects logout  
2. *System:* clears authentication state  
3. *System:* removes User from runtime memory  
4. *System:* displays login screen  
End

## Related Entities

- ref:EN0005 – User  
