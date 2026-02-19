## Overview

| cfl:noheader | Description |
| --- | --- |
| **Trigger** | User performs a move while an Exercise is active. The system validates the move against the expected script step and progresses the Exercise deterministically. |
| **Actors** | User<br>System |
| **Preconditions** | Lesson (ref:EN0001) is loaded<br>Run (ref:EN0004) exists with `status = ready`<br>Active Exercise (ref:EN0002) is selected<br>`plyIndex` points to the expected user Ply (ref:EN0003) |
| **Postconditions** | `plyIndex` may increase<br>System Plies may be auto-executed<br>`status` may change to `wrong`, `illegal`, or `completed` |

## Main Flow

1. *User:* performs a move on the chessboard  
2. *System:* calls `applyUci` from ref:SRV0001 to apply the move to the chess game state  
3. *System:* if move is illegal according to chess.js, sets `status = illegal`  
4. *System:* compares the performed move with the expected user Ply from the Exercise script  
5. *System:* if the move does not match the expected Ply, sets `status = wrong`  
6. *System:* if the move matches the expected Ply, increments `plyIndex`  
7. *System:* calls `runSystemPlies` from ref:SRV0001 to auto-execute consecutive system Plies  
8. *System:* if final Ply is reached, sets `status = completed` and displays Exercise `successMessage`  
End

## 3A: Illegal Move

- *System:* detects that `game.move` returned a falsy value  
- *System:* sets `status = illegal`  
End

## 5A: Wrong Move

- *System:* detects mismatch between performed move and expected user Ply  
- *System:* sets `status = wrong`  
End

## 7A: Illegal System Script Move

- *System:* `runSystemPlies` fails to apply a scripted system move  
- *System:* sets `status` using `setStatus` callback with message `System script illegal: <uci>`  
End

## Related Entities

- ref:EN0001 – Lesson  
- ref:EN0002 – Exercise  
- ref:EN0003 – Ply  
- ref:EN0004 – Run  
- ref:SRV0001 – Script Runner  

## Notes on Implementation Constraints

- Move application is delegated to chess.js  
- Promotion is always forced to `'q'` in the current implementation  
- Only one deterministic script path exists  
- No alternative branches or move search are supported  
