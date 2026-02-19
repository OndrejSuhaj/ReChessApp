## Description

Exercise defines an initial chess position (FEN) and a deterministic script of moves that the user must follow. Each user Ply in the script has exactly one correct move. The system never calculates moves and never evaluates positions; it only validates that the user’s move matches the expected script step and then plays scripted system responses.

Exercise is content-only. A runtime attempt to solve an Exercise is represented by Run (ref:EN0004).

## Data Structure

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | yes | Unique identifier of the Exercise |
| fen | string | yes | Initial position in FEN notation |
| label | string | yes | Short label shown to the user |
| script | Ply[] | yes | Deterministic ordered script of Plies (ref:EN0003) |
| successMessage | string | yes | Message displayed when the Exercise is completed |

## State Model

| State | Description | Related UC |
| --- | --- | --- |
| Active | Exercise is currently being solved in an active Run | ref:UC0003 |
| Completed | Final expected Ply has been executed successfully | ref:UC0003 |

## Runtime Perspective

- Exercise is loaded from JSON and does not change at runtime  
- Script execution is validated step-by-step against the expected Ply  
- System Plies are applied automatically as defined by the script  
- No engine evaluation is allowed at any step  

## Invariants

- Script order is deterministic  
- Only one correct move exists for each user Ply  
- System never proposes or calculates alternative moves  
- A move is accepted only if it matches the expected user Ply  

## Related Use Cases

- ref:UC0003 – User solves Exercise  
