## Description

Script Runner is a domain service that applies deterministic script steps to a chess game state. It does not calculate moves and does not evaluate positions. Its responsibility is limited to applying moves in UCI format using chess.js and auto-executing consecutive system Plies defined in an Exercise script.

Script Runner is used by the runtime flow to enforce script compliance and to progress the Exercise deterministically.

## Data Structure

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| applyUci | (game: Chess, uci: string) => Move \| null | yes | Applies a single UCI move to the given chess.js game instance |
| runSystemPlies | (game: Chess, exercise: Exercise, startIndex: number, setStatus: (s: string) => void) => number | yes | Applies consecutive system Plies from `exercise.script` starting at `startIndex` and returns the next index |

## State Model

| State | Description | Related UC |
| --- | --- | --- |
| Not applicable | Script Runner is a stateless service and does not define independent runtime states | ref:UC0003 |

## Runtime Perspective

- `applyUci` applies a move via `game.move({ from, to, promotion: 'q' })`  
- Promotion is always forced to `'q'` in the current implementation  
- Move legality is determined by chess.js and expressed by a falsy return value from `game.move`  
- `runSystemPlies` iterates while the current script step actor is `system`  
- If a scripted system move is illegal, `setStatus` is called with `System script illegal: <uci>` and the function returns the current index  

## Invariants

- Script Runner never generates or searches for moves  
- Script Runner only applies moves explicitly defined in the script  
- System Plies are executed in order without branching  
- If chess.js rejects a scripted move, script execution stops immediately  

## Related Use Cases

- ref:UC0003 – User solves Exercise  
