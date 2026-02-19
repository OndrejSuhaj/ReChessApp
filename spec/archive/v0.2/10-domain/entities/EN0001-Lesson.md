## Description

Lesson is a content container that groups an ordered set of Exercises into a single training unit. It defines the learning context (identity and title) and the exact sequence of Exercises to be presented to the user. Lesson contains no chess logic and does not evaluate positions.

Lesson is static content loaded from JSON. Runtime progress through the Lesson is tracked by the runtime entity Run (ref:EN0004). In the codebase, Run is represented by the type `RunnerState`.

## Data Structure

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| lessonId | string | yes | Unique identifier of the Lesson |
| title | string | yes | Human-readable name of the Lesson |
| exercises | Exercise[] | yes | Ordered list of Exercises included in the Lesson (ref:EN0002) |

## State Model

| State | Description | Related UC |
| --- | --- | --- |
| Draft | Lesson exists as content but is not used in the runtime flow | ref:UC0001 |
| Published | Lesson is available for users to start | ref:UC0001 |

## Runtime Perspective

- Lesson is static content loaded from JSON  
- Lesson does not store runtime progress or user attempts  
- Exercise order defines the intended progression  
- Validation and script progression happen outside Lesson  

## Invariants

- Lesson is deterministic content  
- Exercises are ordered and referenced explicitly  
- Lesson content does not change due to user actions at runtime  

## Related Use Cases

- ref:UC0001 – User starts Lesson  
- ref:UC0002 – System presents next Exercise  
- ref:UC0004 – System confirms Lesson completion  
