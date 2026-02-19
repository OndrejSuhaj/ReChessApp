## Description

ReChess is a deterministic script-driven chess training application. The system does not evaluate positions and does not calculate moves. All gameplay is strictly defined by predefined scripts stored in Exercises.

The architecture separates static content (Lesson, Exercise, Ply) from runtime state (Run). Script execution and move validation are handled by a dedicated domain service.

## Architectural Layers

### Content Layer

The Content Layer defines static training data loaded from JSON.

Entities:

- Lesson (ref:EN0001)  
- Exercise (ref:EN0002)  
- Ply (ref:EN0003)  

These entities are immutable at runtime and contain no chess logic.

### Runtime Layer

The Runtime Layer tracks user progression through content.

Entity:

- Run (ref:EN0004)  

In the codebase, Run is represented by the type `RunnerState`.

Run contains:

- `exerciseIndex`
- `plyIndex`
- `status`

Run does not contain chess evaluation logic. It only tracks deterministic progression.

### Domain Service Layer

The Domain Service Layer enforces script execution rules.

Service:

- Script Runner (ref:SRV0001)

Responsibilities:

- Apply UCI moves using chess.js  
- Validate move legality  
- Execute consecutive system Plies  
- Stop execution if a scripted move is illegal  

Script Runner does not search for moves and does not evaluate positions.

### UI Layer

The UI layer is responsible only for rendering and user interaction.

Responsibilities:

- Render chessboard  
- Capture square selections  
- Display status and success messages  

The UI contains no chess validation logic and no script logic.

## Identity Layer

The Identity Layer is responsible for authentication and access control.

The current implementation supports client-side Google OAuth authentication using Expo Auth Session. Authentication is handled entirely on the client and does not involve backend verification.

Responsibilities:

- Initiate OAuth login flow  
- Store authenticated User in runtime state  
- Gate access to application content  
- Provide logout functionality  

The Identity Layer does not modify deterministic script execution. Lesson, Exercise, Ply, Run, and Script Runner remain unchanged.


## Execution Flow

1. User starts a Lesson (ref:UC0001)  
2. System presents the first Exercise (ref:UC0002)  
3. User attempts to solve the Exercise (ref:UC0003)  
4. If more Exercises exist, the next Exercise is presented  
5. If no Exercises remain, the Lesson completion is confirmed (ref:UC0004)  

All transitions are deterministic and script-driven.

## External Dependencies

- chess.js is used only for move legality validation and board state management  
- No chess engine or evaluation library is used  

Promotion is currently always forced to `'q'` in move application.

## Explicit System Boundaries

The system:

- Does not calculate best moves  
- Does not evaluate positions  
- Does not allow alternative correct solutions  
- Does not support branching scripts  
- Does not persist progress to backend storage  
- Does not support repetition scheduling  

The system is strictly a deterministic script trainer.

## Deterministic Design Principles

- Each user Ply has exactly one correct move  
- Script execution is linear  
- No randomness is allowed  
- All runtime decisions are derived from predefined script data  
