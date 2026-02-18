## Description

Run represents a single runtime attempt to progress through a Lesson’s Exercises. It tracks which Exercise is currently active (`exerciseIndex`), which script step is expected next (`plyIndex`), and the current execution status (`status`). Run contains no chess engine logic and does not evaluate positions. It only coordinates deterministic script progression and exposes runtime outcomes such as wrong or illegal moves. In the codebase, Run is represented by RunnerState

Run is runtime-only state. Content is defined in Lesson (ref:EN0001), Exercise (ref:EN0002), and script steps are defined in Ply (ref:EN0003).

## Data Structure

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| exerciseIndex | number | yes | Index of the currently active Exercise within the Lesson |
| plyIndex | number | yes | Index of the currently expected Ply within the active Exercise script |
| status | string | yes | Runtime status (expected values: `ready`, `wrong`, `illegal`, `completed`) |

## State Model

| State | Description | Related UC |
| --- | --- | --- |
| ready | Run is active and waiting for the next user move | ref:UC0003 |
| wrong | User played a legal move that does not match the expected Ply | ref:UC0003 |
| illegal | User attempted an illegal chess move for the current position | ref:UC0003 |
| completed | Final expected Ply was executed and the Exercise is completed | ref:UC0003 |

## Runtime Perspective

- Run is initialized when the user starts a Lesson and an Exercise becomes active  
- `exerciseIndex` selects the active Exercise from the Lesson’s ordered list  
- `plyIndex` always points to the next expected Ply in the active Exercise script  
- `status` changes only as a deterministic result of move validation  
- System Plies may be applied automatically without user input  

## Invariants

- `exerciseIndex` must point to an existing Exercise in the active Lesson  
- `plyIndex` must point to a valid script position within the active Exercise  
- Progression is strictly linear and script-driven  
- No engine evaluation or move search is permitted  

## Related Use Cases

- ref:UC0003 – User solves Exercise
