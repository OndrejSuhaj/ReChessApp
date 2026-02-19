## Description

This document defines the UX interpretation of the current ReChess system implementation. It translates the deterministic domain model and use cases into user-facing behavior and interaction patterns.

The goal is to ensure that visual design remains fully aligned with the system’s deterministic architecture.

## Product Overview

ReChess is a deterministic chess training application.

The user always searches for exactly one correct move defined by a predefined script. The system does not calculate moves and does not evaluate positions. All interactions must reinforce this principle.

The product is not an analysis board, not a chess engine, and not a puzzle system with multiple solutions.

## User Journey

1. User starts a Lesson (ref:UC0001)  
2. System presents the first Exercise (ref:UC0002)  
3. User attempts to solve the Exercise (ref:UC0003)  
4. If additional Exercises exist, the system presents the next one  
5. If no Exercises remain, the Lesson completion is confirmed (ref:UC0004)  

The journey is strictly linear.

## Core Interaction Model

### Move Input

- User selects a piece  
- User selects a destination square  
- Move is immediately validated  

### Validation Feedback

- If move is illegal → show illegal feedback  
- If move is legal but incorrect → show wrong feedback  
- If move is correct → animate move and auto-play system response  

### System Moves

- System moves are always animated  
- No textual explanation is displayed  
- No delay longer than necessary for animation  

### Completion

- When Exercise is completed, display `successMessage`  
- When final Exercise is completed, confirm Lesson completion  

## Runtime State Mapping

The UI must directly reflect the Run status (ref:EN0004).

| Run.status | UX Behavior |
| --- | --- |
| ready | Normal interaction state |
| wrong | Visual wrong-move feedback |
| illegal | Visual illegal-move feedback |
| completed | Success state with message |

No additional runtime states may be introduced at UI level.

## Screen Definitions

### Lesson Start

- Lesson title  
- Start action  

### Exercise Screen

- Chessboard  
- Exercise label  
- Status message area  
- Back navigation  

### Lesson Completion Screen

- Confirmation message  
- Option to restart  
- Option to exit  

No additional screens are required for the current version.

## Edge Cases

- Exercise not found → show fallback content  
- Invalid FEN → prevent normal board rendering  
- Script inconsistency → show runtime error message  

Edge case handling must remain minimal and deterministic.

## Explicit Non-Goals

The current version does not support:

- Move hints  
- Alternative correct solutions  
- Engine evaluation  
- Position analysis  
- Branching scripts  
- Progress persistence  
- Spaced repetition  
- Performance statistics  

Design must not imply the existence of these features.

## Visual Direction

- Minimalistic  
- Focused on board clarity  
- Clear but subtle feedback states  
- No engine-style evaluation bars  
- No competitive or gamified elements  

The board is the primary focal element.
