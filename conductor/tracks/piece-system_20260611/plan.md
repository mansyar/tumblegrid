<protect>
# TRACK-004: Piece System & Interaction — Implementation Plan

## Phase 1: Piece Mesh Components `[checkpoint: 0b27377]`

- [x] **Task: Create StraightRamp mesh component** `[8c48d7d]`
    - [ ] Create `src/components/pieces/StraightRamp.tsx`
    - [ ] Implement diagonal slope geometry using BoxGeometry
    - [ ] Apply pastel blue material
    - [ ] Ensure piece occupies 1 grid cell (2×2×2 world units)
    - [ ] Write unit test for StraightRamp rendering

- [x] **Task: Create BumperPad mesh component** `[b5d0657]`
    - [ ] Create `src/components/pieces/BumperPad.tsx`
    - [ ] Implement vertical wall geometry using BoxGeometry
    - [ ] Apply pastel orange material
    - [ ] Ensure piece occupies 1 grid cell
    - [ ] Write unit test for BumperPad rendering

- [x] **Task: Create SpeedBooster mesh component** `[adf3061]`
    - [ ] Create `src/components/pieces/SpeedBooster.tsx`
    - [ ] Implement flat track geometry with directional arrows
    - [ ] Apply pastel green material
    - [ ] Ensure piece occupies 1 grid cell
    - [ ] Write unit test for SpeedBooster rendering

- [x] **Task: Create HalfPipe mesh component** `[5f6c82d]`
    - [ ] Create `src/components/pieces/HalfPipe.tsx`
    - [ ] Implement flat track with side rails geometry
    - [ ] Apply pastel purple material
    - [ ] Ensure piece occupies 1 grid cell
    - [ ] Write unit test for HalfPipe rendering

- [x] **Task: Create GoalBucket mesh component** `[645f212]`
    - [ ] Create `src/components/pieces/GoalBucket.tsx`
    - [ ] Implement open container geometry
    - [ ] Apply pastel yellow material with emissive glow
    - [ ] Ensure piece occupies 1 grid cell
    - [ ] Write unit test for GoalBucket rendering

- [x] **Task: Create Launchpad mesh component** `[1197da6]`

- [x] **Task: Create PieceFactory component** `[17eb9e8]`

- [x] **Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)**

---

## Phase 2: Grid Interaction (Raycasting)

- [x] **Task: Implement useGridInteraction hook** `[45e4c8f]`
    - [x] Create `src/hooks/useGridInteraction.ts`
    - [x] Implement ray casting from camera through pointer position
    - [x] Implement floor plane intersection (Y=0)
    - [x] Implement grid snapping (integer coordinate rounding)
    - [x] Support normalized pointer events (mouse + touch)
    - [x] Write unit test for grid snapping logic

- [x] **Task: Implement GridGhost preview component** `[8c791da]`
    - [x] Create `src/components/scene/GridGhost.tsx`
    - [x] Render semi-transparent piece at hovered cell
    - [x] Update position in real-time as mouse moves
    - [x] Reflect current rotationIndex from Active Blueprint Node
    - [x] Hide when outside grid bounds or over occupied cell
    - [x] Write unit test for GridGhost visibility logic

- [ ] **Task: Integrate raycasting with store actions**
    - [ ] Connect useGridInteraction to Zustand store
    - [ ] Call store.updateActiveBlueprint() on hover
    - [ ] Call store.placePiece() on click (if valid placement)
    - [ ] Handle overlap detection (prevent placement on occupied cell)
    - [ ] Write unit test for placement integration

- [ ] **Task: Mount pieces from store in GameCanvas**
    - [ ] Modify `src/components/scene/GameCanvas.tsx`
    - [ ] Iterate over store.placedPieces array
    - [ ] Render PieceFactory for each placed piece
    - [ ] Apply correct position and rotation from store
    - [ ] Write unit test for piece rendering from store

- [ ] **Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)**

---

## Phase 3: Selection & Rotation

- [ ] **Task: Implement usePieceSelection hook**
    - [ ] Create `src/hooks/usePieceSelection.ts`
    - [ ] Implement click detection on placed pieces (raycasting)
    - [ ] Call store.selectPiece() when piece clicked
    - [ ] Call store.clearSelection() when empty space clicked
    - [ ] Call store.removePiece() when selected piece clicked again
    - [ ] Write unit test for selection logic

- [ ] **Task: Implement selection highlight effect**
    - [ ] Add outline glow effect to selected piece
    - [ ] Use post-processing or custom shader for glow
    - [ ] Ensure highlight is clearly visible but not distracting
    - [ ] Write unit test for highlight rendering

- [ ] **Task: Implement rotation via R key**
    - [ ] Add keyboard event listener for R key
    - [ ] Call store.rotatePiece() when R pressed and piece selected
    - [ ] Implement rotation cycling (0→1→2→3→0)
    - [ ] Update mesh rotation immediately
    - [ ] Write unit test for rotation logic

- [ ] **Task: Implement pre-placement rotation**
    - [ ] Allow R key to rotate ghost preview (Active Blueprint Node)
    - [ ] Update rotationIndex in store.updateActiveBlueprint()
    - [ ] Ghost preview reflects new rotation in real-time
    - [ ] Write unit test for pre-placement rotation

- [ ] **Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)**

---

## Phase 4: Integration & Polish

- [ ] **Task: Integrate all systems in GameCanvas**
    - [ ] Mount useGridInteraction hook
    - [ ] Mount usePieceSelection hook
    - [ ] Render GridGhost preview
    - [ ] Render all placed pieces with selection state
    - [ ] Ensure all interactions work together seamlessly

- [ ] **Task: Verify inventory integration**
    - [ ] Placement decrements inventory count correctly
    - [ ] Removal increments inventory count correctly
    - [ ] Inventory prevents placement when count is 0
    - [ ] Write unit test for inventory math

- [ ] **Task: Performance optimization**
    - [ ] Memoize piece mesh components
    - [ ] Optimize raycasting calculations
    - [ ] Ensure 60fps rendering with multiple pieces
    - [ ] Profile and fix any performance bottlenecks

- [ ] **Task: Final verification and cleanup**
    - [ ] Run full test suite (pnpm run test)
    - [ ] Run linting (pnpm run lint)
    - [ ] Run type checking (pnpm run typecheck)
    - [ ] Verify all acceptance criteria met
    - [ ] Remove any console.log statements
    - [ ] Update documentation if needed

- [ ] **Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)**
</protect>
