## Overview

| cfl:noheader | Description |
| --- | --- |
| **Trigger** | An Exercise is completed and there is no next Exercise available in the current Lesson. The system confirms that the Lesson has been completed. |
| **Actors** | System<br>User |
| **Preconditions** | Lesson (ref:EN0001) is loaded<br>Run (ref:EN0004) exists<br>The active Exercise (ref:EN0002) has just reached completion via ref:UC0003 |
| **Postconditions** | System displays a Lesson completion confirmation<br>Run remains in the terminal state of the last completed Exercise context |

## Main Flow

1. *System:* detects that the active Exercise has been completed  
2. *System:* checks whether there is a next Exercise in the Lesson after the current `exerciseIndex`  
3. *System:* determines that no next Exercise exists  
4. *System:* displays a Lesson completion confirmation to the user  
End

## 2A: Next Exercise Exists

- *System:* detects that a next Exercise exists in the Lesson  
- *System:* increments `exerciseIndex` and resets `plyIndex` to `0`  
- *System:* triggers ref:UC0002 – System presents Exercise  
End

## Related Entities

- ref:EN0001 – Lesson  
- ref:EN0002 – Exercise  
- ref:EN0004 – Run  

## Related Use Cases

- ref:UC0002 – System presents Exercise  
- ref:UC0003 – User solves Exercise  
