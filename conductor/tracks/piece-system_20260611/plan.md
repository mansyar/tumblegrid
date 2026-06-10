<protect>
# TRACK-004: Piece System & Interaction — Implementation Plan

## Phase 1: Piece Mesh Components

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

- [ ] **Task: Create HalfPipe mesh component**
    - [ ] Create `src/components/pieces/HalfPipe.tsx`
    - [ ] Implement flat track with side rails geometry
    - [ ] Apply pastel purple material
    - [ ] Ensure piece occupies 1 grid cell
    - [ ] Write unit test for HalfPipe rendering

- [ ] **Task: Create GoalBucket mesh component**
    - [ ] Create `src/components/pieces/GoalBucket.tsx`
    - [ ] Implement open container geometry
    - [ ] Apply pastel yellow material with emissive glow
    - [ ] Ensure piece occupies 1 grid cell
    - [ ] Write unit test for GoalBucket rendering

- [ ] **Task: Create Launchpad mesh component**
    - [ ] Create `src/components/pieces/Launchpad.tsx`
    - [ ] Implement fixed platform with raised center
    - [ ] Apply dark gray base with neon accent
    - [ ] Ensure piece occupies 1 grid cell
    - [ ] Write unit test for Launchpad rendering

- [ ] **Task: Create PieceFactory component**
    - [ ] Create `src/components/pieces/PieceFactory.tsx`
    - [ ] Implement type-dispatching logic (switch on PieceType)
    - [ ] Handle rotation transform (Y-axis, 90° increments)
    - [ ] Support both placed pieces and ghost preview modes
    - [ ] Write unit test for PieceFactory dispatching

- [ ] **Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)**

---

## Phase 2: Grid Interaction (Raycasting)

- [ ] **Task: Implement useGridInteraction hook**
    - [ ] Create `src/hooks/useGridInteraction.ts`
    - [ ] Implement ray casting from camera through pointer position
    - [ ] Implement floor plane intersection (Y=0)
    - [ ] Implement grid snapping (integer coordinate rounding)
    - [ ] Support normalized pointer events (mouse + touch)
    - [ ] Write unit test for grid snapping logic

- [ ] **Task: Implement GridGhost preview component**
    - [ ] Create `src/components/scene/GridGhost.tsx`
    - [ ] Render semi-transparent piece at hovered cell
    - [ ] Update position in real-time as mouse moves
    - [ ] Reflect current rotationIndex from Active Blueprint Node
    - [ ] Hide when outside grid bounds or over occupied cell
    - [ ] Write unit test for GridGhost visibility logic

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
