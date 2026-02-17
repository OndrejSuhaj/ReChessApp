## Overview

| cfl:noheader | Description |
| --- | --- |
| **Trigger** | User selects a Lesson to start. The system initializes runtime state for the Lesson and prepares the first Exercise for execution. |
| **Actors** | User<br>System |
| **Preconditions** | Lesson (ref:EN0001) exists and is Published |
| **Postconditions** | Run (ref:EN0004) is initialized with `exerciseIndex = 0`, `plyIndex = 0`, `status = ready` |

## Main Flow

1. *User:* selects a Lesson  
2. *System:* loads Lesson data  
3. *System:* verifies Lesson is available  
4. *System:* initializes Run with `exerciseIndex = 0`, `plyIndex = 0`, `status = ready`  
5. *System:* triggers UC0002 – System presents Exercise  
End

## 3A: Lesson Not Available

- *System:* detects that the Lesson is not in Published state  
- *System:* prevents initialization of Run  
End

## Related Entities

- ref:EN0001 – Lesson  
- ref:EN0004 – Run  

## Related Use Cases

- ref:UC0002 – System presents Exercise  
