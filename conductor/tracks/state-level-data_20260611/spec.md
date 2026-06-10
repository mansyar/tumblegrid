<protect>
# Specification: TRACK-003 — State Management & Level Data

## Overview

Implement the central Zustand store that serves as the single source of truth for all game state, and create the complete level data system with JSON files and validation.

## Functional Requirements

### FR-1: Zustand Store (`src/store/useGameStore.ts`)

Implement a centralized Zustand store following TDD §3 exactly, with these state properties:

- **`machineState`**: Enum (`BUILDING`, `PLAYING`, `LEVEL_CLEARED`, `SANDBOX_BUILDING`, `SANDBOX_PLAYING`)
- **`activeMode`**: Enum (`CAMPAIGN`, `SANDBOX`)
- **`activeLevelIndex`**: Number (campaign level index, ignored in sandbox)
- **`inventory`**: `Record<PieceType, number>` (remaining piece counts)
- **`placedPieces`**: Array of `{ id: string, type: PieceType, position: [x, y, z], rotationIndex: 0|1|2|3 }`
- **`activeBlueprintNode`**: Nullable `{ type: PieceType, position: [x, y, z] }` (hover preview)
- **`selectedPieceId`**: Nullable string
- **`trajectoryPreviewCache`**: Array of `[x, y, z]` waypoints

### FR-2: Store Actions (`src/store/actions.ts`)

Pure action implementations in a separate file:

- **`placePiece(type, position, rotationIndex)`**: Add piece to placedPieces, decrement inventory. Validates: position not occupied, inventory > 0, position within grid bounds.
- **`removePiece(id)`**: Remove piece from placedPieces, increment inventory.
- **`rotatePiece(id)`**: Cycle rotationIndex (0→1→2→3→0) for selected piece.
- **`setMode(mode)`**: Switch between CAMPAIGN and SANDBOX.
- **`transitionState(newState)`**: State machine transitions with validation:
  - `BUILDING → PLAYING` (requires at least 1 placed piece)
  - `PLAYING → BUILDING` (manual stop or fail)
  - `PLAYING → LEVEL_CLEARED` (goal reached)
  - `LEVEL_CLEARED → BUILDING` (next level or retry)
  - `SANDBOX_BUILDING → SANDBOX_PLAYING`
  - `SANDBOX_PLAYING → SANDBOX_BUILDING`
- **`loadLevel(levelDefinition)`**: Hydrate store from LevelDefinition JSON. Resets placedPieces, sets inventory, gridBounds, launchpadPosition, goalPosition.
- **`updateActiveBlueprint(type, position)`**: Set/clear hover preview.
- **`selectPiece(id)` / `clearSelection()`**: Manage selectedPieceId.
- **`updateTrajectoryCache(waypoints)`**: Update trajectory preview cache.

### FR-3: Type Definitions (`src/store/types.ts`)

TypeScript enums and interfaces:

- `PieceType`: `'straight_ramp' | 'speed_booster' | 'bumper_pad' | 'half_pipe' | 'goal_bucket'`
- `MachineState`: `'BUILDING' | 'PLAYING' | 'LEVEL_CLEARED' | 'SANDBOX_BUILDING' | 'SANDBOX_PLAYING'`
- `ActiveMode`: `'CAMPAIGN' | 'SANDBOX'`
- `PiecePlacement`: `{ type, position, rotationIndex }`
- `PlacedPiece`: `PiecePlacement & { id: string }`
- `LevelDefinition`: Full level schema type

### FR-4: Level Data Files

Create 6 JSON files in `src/levels/`:

- `campaign/01-the-descent.json`
- `campaign/02-the-bank-shot.json`
- `campaign/03-velocity-check.json`
- `campaign/04-the-switchback.json`
- `campaign/05-efficiency-crisis.json`
- `sandbox.json`

Each follows the schema from `level-data-schema.md` exactly.

### FR-5: Level Index (`src/levels/index.ts`)

Typed exports:
- `campaignLevels`: Array of all campaign LevelDefinitions
- `sandboxLevel`: Sandbox LevelDefinition
- `getLevelById(id)`: Lookup function
- `getLevelByIndex(index)`: Lookup by campaign index

### FR-6: Runtime Validator (`src/levels/validateLevel.ts`)

`validateLevel(level: LevelDefinition): { valid: boolean, errors: string[] }`

Enforces all 9 rules from level-data-schema.md §2:
1. ID uniqueness (within campaign set)
2. Bounds compliance
3. No overlap
4. Inventory validity
5. Launchpad bounds
6. Goal presence (campaign) / absence (sandbox)
7. Inventory non-negative
8. Rotation index range
9. Launchpad uniqueness

## Non-Functional Requirements

- **NFR-1**: Zustand devtools middleware enabled for development
- **NFR-2**: All actions are pure functions testable in isolation
- **NFR-3**: Store uses `crypto.randomUUID()` for piece ID generation
- **NFR-4**: Level JSON files are statically imported (Vite handles JSON imports)

## Acceptance Criteria

- [ ] All state properties match TDD §3 exactly
- [ ] All state machine transitions are valid and tested
- [ ] placePiece prevents overlapping placements
- [ ] placePiece prevents placement outside grid bounds
- [ ] placePiece prevents placement when inventory is 0
- [ ] removePiece correctly restores inventory
- [ ] rotatePiece cycles 0→1→2→3→0
- [ ] loadLevel correctly hydrates all store properties
- [ ] All 6 level JSON files pass validation
- [ ] validateLevel catches all 9 rule violations
- [ ] Comprehensive Vitest tests for all actions and transitions
- [ ] No console errors or TypeScript errors

## Out of Scope

- 3D rendering of pieces (TRACK-004)
- UI panels (TRACK-005)
- Physics simulation (TRACK-006)
- Audio system (TRACK-008)
- Level tuning (TRACK-009)

## Dependencies

- **Core Dependency**: TRACK-001 (Project Scaffolding) — must be 100% complete
- **Can parallel with**: TRACK-002 (Core 3D & Grid)
</protect>
