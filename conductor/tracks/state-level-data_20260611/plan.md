# Implementation Plan: TRACK-003 — State Management & Level Data

## Phase 1: Types & Constants

- [ ] Task: Define TypeScript types and enums in `src/store/types.ts`
    - [ ] Create `PieceType` union type
    - [ ] Create `MachineState` union type
    - [ ] Create `ActiveMode` union type
    - [ ] Create `PiecePlacement` interface
    - [ ] Create `PlacedPiece` interface (extends PiecePlacement with `id: string`)
    - [ ] Create `ActiveBlueprintNode` interface
    - [ ] Create `LevelDefinition` interface (matching level-data-schema.md)
    - [ ] Create `GameState` interface (all store state properties)
    - [ ] Export all types
- [ ] Task: Write Vitest tests for type exports
    - [ ] Verify all types are exported correctly
    - [ ] Verify type compatibility with level JSON schema
- [ ] Task: Run tests and verify they pass
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Zustand Store & Actions

- [ ] Task: Implement pure action functions in `src/store/actions.ts`
    - [ ] Implement `createPlacePiece()` — validates position, inventory, bounds
    - [ ] Implement `createRemovePiece()` — restores inventory
    - [ ] Implement `createRotatePiece()` — cycles rotationIndex 0→1→2→3→0
    - [ ] Implement `createSetMode()` — switches CAMPAIGN/SANDBOX
    - [ ] Implement `createTransitionState()` — state machine with validation
    - [ ] Implement `createLoadLevel()` — hydrates store from LevelDefinition
    - [ ] Implement `createUpdateActiveBlueprint()` — set/clear hover preview
    - [ ] Implement `createSelectPiece()` / `createClearSelection()`
    - [ ] Implement `createUpdateTrajectoryCache()`
    - [ ] Export all action creators
- [ ] Task: Write Vitest tests for all actions in `tests/store-actions.test.ts`
    - [ ] Test placePiece: success, overlap rejection, bounds rejection, empty inventory
    - [ ] Test removePiece: success, inventory restoration
    - [ ] Test rotatePiece: cycling 0→1→2→3→0
    - [ ] Test setMode: CAMPAIGN ↔ SANDBOX
    - [ ] Test transitionState: all valid transitions, all invalid transitions
    - [ ] Test loadLevel: correct hydration of all properties
    - [ ] Test selectPiece/clearSelection
    - [ ] Test updateTrajectoryCache
- [ ] Task: Implement Zustand store in `src/store/useGameStore.ts`
    - [ ] Import types from `types.ts`
    - [ ] Import action creators from `actions.ts`
    - [ ] Define initial state (BUILDING mode, empty inventory, empty pieces)
    - [ ] Wire all actions using action creators
    - [ ] Enable Zustand devtools middleware
    - [ ] Export store hook
- [ ] Task: Write Vitest tests for store integration in `tests/store.test.ts`
    - [ ] Test store initialization with default state
    - [ ] Test full workflow: loadLevel → placePiece → transitionState → PLAYING
    - [ ] Test state persistence across multiple actions
- [ ] Task: Run all tests and verify they pass
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Level Data & Validation

- [ ] Task: Create level JSON files in `src/levels/campaign/`
    - [ ] Create `01-the-descent.json` (from level-data-schema.md §4)
    - [ ] Create `02-the-bank-shot.json`
    - [ ] Create `03-velocity-check.json`
    - [ ] Create `04-the-switchback.json`
    - [ ] Create `05-efficiency-crisis.json`
- [ ] Task: Create `src/levels/sandbox.json`
- [ ] Task: Implement runtime validator in `src/levels/validateLevel.ts`
    - [ ] Implement rule 1: ID uniqueness check (campaign set)
    - [ ] Implement rule 2: Bounds compliance check
    - [ ] Implement rule 3: No overlap check
    - [ ] Implement rule 4: Inventory validity check
    - [ ] Implement rule 5: Launchpad bounds check
    - [ ] Implement rule 6: Goal presence/absence check
    - [ ] Implement rule 7: Inventory non-negative check
    - [ ] Implement rule 8: Rotation index range check
    - [ ] Implement rule 9: Launchpad uniqueness check
    - [ ] Return `{ valid: boolean, errors: string[] }`
- [ ] Task: Create level index in `src/levels/index.ts`
    - [ ] Import all campaign levels
    - [ ] Import sandbox level
    - [ ] Export `campaignLevels` array
    - [ ] Export `sandboxLevel`
    - [ ] Export `getLevelById(id)` function
    - [ ] Export `getLevelByIndex(index)` function
- [ ] Task: Write Vitest tests in `tests/level-schema.test.ts`
    - [ ] Test all 6 level files pass validation
    - [ ] Test each validation rule individually with invalid data
    - [ ] Test ID uniqueness across campaign set
    - [ ] Test getLevelById and getLevelByIndex
- [ ] Task: Run all tests and verify they pass
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
