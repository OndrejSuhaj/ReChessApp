## Description

Ply is a single deterministic step in an Exercise script. It specifies which actor performs the move (user or system) and the move itself in UCI format. Ply is not a chess engine construct; it is a script instruction. Ply contains no validation rules beyond its own data and has no runtime state.

Ply is executed within a Run (ref:EN0004) when it becomes the expected step at the current `plyIndex`.

## Data Structure

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| actor | "user" \| "system" | yes | Who is expected to perform the move |
| uci | string | yes | Move in UCI format (e.g., `e2e4`) |

## State Model

| State | Description | Related UC |
| --- | --- | --- |
| Expected | Ply is the next required step at current `plyIndex` | ref:UC0003 |
| Applied | Ply move has been applied to the current game state | ref:UC0003 |

## Runtime Perspective

- Ply is immutable script data  
- Ply becomes relevant only when referenced by `plyIndex` in Run  
- User Plies require user input; system Plies are auto-applied  
- Ply legality is validated by chess.js when applying the move  

## Invariants

- Ply must be valid UCI (4 chars + optional promotion)  
- Actor is strictly `user` or `system`  
- Ply does not branch and does not contain alternatives  

## Related Use Cases

- ref:UC0003 – User solves Exercise  
