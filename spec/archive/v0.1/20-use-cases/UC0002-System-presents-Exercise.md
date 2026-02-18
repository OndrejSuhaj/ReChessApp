## Overview

| cfl:noheader | Description |
| --- | --- |
| **Trigger** | Run is initialized or `exerciseIndex` changes. The system selects the active Exercise and prepares the chess position for execution. |
| **Actors** | System<br>User |
| **Preconditions** | Lesson (ref:EN0001) is loaded<br>Run (ref:EN0004) exists and contains a valid `exerciseIndex` |
| **Postconditions** | Active Exercise (ref:EN0002) is selected<br>Chess game state is initialized from Exercise `fen`<br>Run remains in `ready` status |

## Main Flow

1. *System:* reads `exerciseIndex` from Run  
2. *System:* selects the active Exercise from the Lesson  
3. *System:* initializes chess game state from Exercise `fen`  
4. *System:* ensures `plyIndex` is set to the current expected Ply  
5. *System:* renders the chessboard with the initialized position  
End

## 2A: Exercise Not Found

- *System:* detects that `exerciseIndex` does not reference an existing Exercise  
- *System:* renders fallback information instead of the chessboard  
End

## 3A: Invalid FEN

- *System:* fails to initialize the chess position  
- *System:* prevents normal rendering of the Exercise  
End

## Related Entities

- ref:EN0001 – Lesson  
- ref:EN0002 – Exercise  
- ref:EN0004 – Run  

## Related Use Cases

- ref:UC0003 – User solves Exercise  
