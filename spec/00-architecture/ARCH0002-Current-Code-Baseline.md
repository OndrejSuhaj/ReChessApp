# ARCH0002 – Current Code Baseline

## Description

This document defines the current implementation baseline of ReChess.

It describes the actual working behavior of the system before backend persistence is introduced.

This is an "as-is" snapshot of the implemented system and serves as a reference point for future architectural changes.

This document must not describe target architecture.  
Target architecture is defined separately.

---

## Specification Version

Specification Version: v0.1 – Frontend-Only Deterministic Trainer

---

## Code Structure Overview

Relevant folders in current implementation:
src/domain/
types.ts
exercises.ts
scriptRunner.ts

src/data/
scholars-mate.json (static lesson example)

src/ui/
ChessBoard.tsx

app/(tabs)/
index.tsx


---

## Current Deterministic Model

The system currently:

- Loads lessons from static JSON bundled in frontend.
- Uses chess.js only for move legality validation.
- Uses ScriptRunner to enforce deterministic script compliance.
- Automatically executes system moves from script.
- Displays success message on lesson completion.
- Never evaluates chess positions.
- Never calculates best moves.
- Never persists data.

Lesson content is static and embedded in the client.

The application behaves as a deterministic script-driven trainer.

---

## Current State Handling

Run state is handled entirely client-side.

Run (currently modeled as EN0004) contains:

- exerciseIndex  
- plyIndex  
- status  

State transitions:

- Are triggered by user interaction.
- Are enforced by deterministic script logic.
- Exist only in memory.
- Are lost on application reload.

No global state management library is used.  
React useState manages runtime state.

---

## Authentication Status

Google login and logout exist at specification level only.

In code:

- There is no backend authentication.
- There is no token verification.
- There is no persisted User entity.
- There is no database.

---

## Persistence Status

Currently:

- No database exists.
- No backend service exists.
- No lesson progress is persisted.
- No user identity is stored.

All state is ephemeral.

---

## Specification Baseline Mapping

Documents are preserved under spec/archive/v0.1/
The following specification documents define the currently implemented behavior:

### Domain Entities

- EN0001 – Lesson  
- EN0002 – Exercise  
- EN0003 – Ply  
- EN0004 – Run  
- EN0005 – User  

### Services

- SRV0001 – Script Runner  

### Use Cases (Implemented in Code)

- UC0001 – User starts Lesson  
- UC0002 – System presents Exercise  
- UC0003 – User solves Exercise  
- UC0004 – System confirms Lesson completion  

### Use Cases (Specification Only – Not Implemented in Code)

- UC0010 – User logs in via Google  
- UC0011 – User logs out  

### UX

- UX0001 – Design Brief – Current Version  

---

## Known Gaps vs Target Architecture

The current system lacks:

- Backend API  
- Google ID token verification  
- Persisted User entity  
- Persisted LessonProgress  
- Backend lesson source of truth  
- Database storage  

---

## Deterministic Invariant

The deterministic script runner is the core invariant of the system.

Any future architectural change must preserve:

- Script-driven execution  
- No engine evaluation  
- No best-move calculation  
- Single correct user move per script ply  

---

## Baseline Anchor

This baseline corresponds to repository state at:

`1cf5223`

If deterministic core behavior changes before backend integration, this document must be updated.


