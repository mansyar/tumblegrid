<protect>
# Implementation Plan: TRACK-003 — State Management & Level Data

## Phase 1: Types & Constants [checkpoint: 09136e1]

- [x] Task: Define TypeScript types and enums in `src/store/types.ts`
    - [x] Create `PieceType` union type
    - [x] Create `MachineState` union type
    - [x] Create `ActiveMode` union type
    - [x] Create `PiecePlacement` interface
    - [x] Create `PlacedPiece` interface (extends PiecePlacement with `id: string`)
    - [x] Create `ActiveBlueprintNode` interface
    - [x] Create `LevelDefinition` interface (matching level-data-schema.md)
    - [x] Create `GameState` interface (all store state properties)
    - [x] Export all types
- [x] Task: Write Vitest tests for type exports
    - [x] Verify all types are exported correctly
    - [x] Verify type compatibility with level JSON schema
- [x] Task: Run tests and verify they pass
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Zustand Store & Actions [checkpoint: ae7c241]

- [x] Task: Implement pure action functions in `src/store/actions.ts`
    - [x] Implement `createPlacePiece()` — validates position, inventory, bounds
    - [x] Implement `createRemovePiece()` — restores inventory
    - [x] Implement `createRotatePiece()` — cycles rotationIndex 0→1→2→3→0
    - [x] Implement `createSetMode()` — switches CAMPAIGN/SANDBOX
    - [x] Implement `createTransitionState()` — state machine with validation
    - [x] Implement `createLoadLevel()` — hydrates store from LevelDefinition
    - [x] Implement `createUpdateActiveBlueprint()` — set/clear hover preview
    - [x] Implement `createSelectPiece()` / `createClearSelection()`
    - [x] Implement `createUpdateTrajectoryCache()`
    - [x] Export all action creators
- [x] Task: Write Vitest tests for all actions in `tests/store-actions.test.ts`
    - [x] Test placePiece: success, overlap rejection, bounds rejection, empty inventory
    - [x] Test removePiece: success, inventory restoration
    - [x] Test rotatePiece: cycling 0→1→2→3→0
    - [x] Test setMode: CAMPAIGN ↔ SANDBOX
    - [x] Test transitionState: all valid transitions, all invalid transitions
    - [x] Test loadLevel: correct hydration of all properties
    - [x] Test selectPiece/clearSelection
    - [x] Test updateTrajectoryCache
- [x] Task: Implement Zustand store in `src/store/useGameStore.ts`
    - [x] Import types from `types.ts`
    - [x] Import action creators from `actions.ts`
    - [x] Define initial state (BUILDING mode, empty inventory, empty pieces)
    - [x] Wire all actions using action creators
    - [x] Enable Zustand devtools middleware
    - [x] Export store hook
- [x] Task: Write Vitest tests for store integration in `tests/store.test.ts`
    - [x] Test store initialization with default state
    - [x] Test full workflow: loadLevel → placePiece → transitionState → PLAYING
    - [x] Test state persistence across multiple actions
- [x] Task: Run all tests and verify they pass
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Level Data & Validation

- [x] Task: Create level JSON files in `src/levels/campaign/`
    - [x] Create `01-the-descent.json` (from level-data-schema.md §4)
    - [x] Create `02-the-bank-shot.json`
    - [x] Create `03-velocity-check.json`
    - [x] Create `04-the-switchback.json`
    - [x] Create `05-efficiency-crisis.json`
- [x] Task: Create `src/levels/sandbox.json`
- [x] Task: Implement runtime validator in `src/levels/validateLevel.ts`
    - [x] Implement rule 1: ID uniqueness check (campaign set)
    - [x] Implement rule 2: Bounds compliance check
    - [x] Implement rule 3: No overlap check
    - [x] Implement rule 4: Inventory validity check
    - [x] Implement rule 5: Launchpad bounds check
    - [x] Implement rule 6: Goal presence/absence check
    - [x] Implement rule 7: Inventory non-negative check
    - [x] Implement rule 8: Rotation index range check
    - [x] Implement rule 9: Launchpad uniqueness check
    - [x] Return `{ valid: boolean, errors: string[] }`
- [x] Task: Create level index in `src/levels/index.ts`
    - [x] Import all campaign levels
    - [x] Import sandbox level
    - [x] Export `campaignLevels` array
    - [x] Export `sandboxLevel`
    - [x] Export `getLevelById(id)` function
    - [x] Export `getLevelByIndex(index)` function
- [x] Task: Write Vitest tests in `tests/level-schema.test.ts`
    - [x] Test all 6 level files pass validation
    - [x] Test each validation rule individually with invalid data
    - [x] Test ID uniqueness across campaign set
    - [x] Test getLevelById and getLevelByIndex
- [x] Task: Run all tests and verify they pass
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
</protect>
