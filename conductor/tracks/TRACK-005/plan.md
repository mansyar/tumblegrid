<protect>
# Implementation Plan: Build Mode UI (Inventory & Controls)

## Phase 1: Inventory Panel [checkpoint: 73a1d33]

- [x] Task: Write tests for InventoryPanel component [905b010]
    - [x] Test: renders all piece types from store inventory
    - [x] Test: displays correct remaining count for each piece type
    - [x] Test: highlights the active blueprint type
    - [x] Test: greys out and disables piece types with 0 count
    - [x] Test: clicking a piece type updates store activeBlueprintNode.type
- [x] Task: Implement InventoryPanel component [905b010]
    - [x] Create src/components/ui/InventoryPanel.tsx
    - [x] Read inventory and activeBlueprintNode from store
    - [x] Render piece type list with icons, labels, and counts
    - [x] Implement click handler to set active blueprint type
    - [x] Apply active state highlighting
    - [x] Apply disabled state for zero-count items
- [x] Task: Write tests for inventory item styling [4f0c101]
    - [x] Test: active item has distinct visual style
    - [x] Test: disabled item has greyed-out appearance
    - [x] Test: hover state provides visual feedback
- [x] Task: Implement inventory item styling [4f0c101]
    - [x] Create CSS styles for inventory panel layout
    - [x] Style active, disabled, and hover states
    - [x] Ensure 44px minimum touch targets
- [x] Task: Conductor - User Manual Verification 'Phase 1: Inventory Panel' (Protocol in workflow.md)

## Phase 2: Mode Controls & Indicator

- [x] Task: Write tests for ModeToggle component [b63be8a]
    - [x] Test: renders Play button by default
    - [x] Test: Play button dispatches PLAYING when state is BUILDING
    - [x] Test: Play button dispatches SANDBOX_PLAYING when state is SANDBOX_BUILDING
    - [x] Test: Stop button is not rendered during BUILDING state
    - [x] Test: Stop button is visible during PLAYING state
    - [x] Test: Stop button dispatches BUILDING when state is PLAYING
    - [x] Test: Stop button dispatches SANDBOX_BUILDING when state is SANDBOX_PLAYING
- [x] Task: Implement ModeToggle component [b63be8a]
    - [x] Create src/components/ui/ModeToggle.tsx
    - [x] Read machineState from store
    - [x] Render Play button (always enabled)
    - [x] Render Stop button (visible in PLAYING/SANDBOX_PLAYING states)
    - [x] Wire Play button to store transition action
    - [x] Wire Stop button to store transition action
- [x] Task: Write tests for ModeIndicator component [cd0c850]
    - [x] Test: displays Build Mode during BUILDING state
    - [x] Test: displays Build Mode during SANDBOX_BUILDING state
    - [x] Test: displays Play Mode during PLAYING state
    - [x] Test: displays Play Mode during SANDBOX_PLAYING state
- [x] Task: Implement ModeIndicator component [cd0c850]
    - [x] Create src/components/ui/ModeIndicator.tsx
    - [x] Read machineState from store
    - [x] Render mode text based on current state
- [ ] Task: Write tests for Escape key handler
    - [ ] Test: Escape key triggers Stop during PLAYING state
    - [ ] Test: Escape key does nothing during BUILDING state
- [ ] Task: Implement Escape key handler
    - [ ] Create useEscapeKey hook or integrate into ModeToggle
    - [ ] Listen for keydown events
    - [ ] Dispatch Stop action when Escape pressed in Play Mode
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Mode Controls & Indicator' (Protocol in workflow.md)

## Phase 3: Trajectory Preview

- [ ] Task: Write tests for trajectory waypoint computation
    - [ ] Test: finds nearest placed piece to hovered cell
    - [ ] Test: computes waypoints from nearest piece exit face to hovered cell entry face
    - [ ] Test: returns empty array when no placed pieces exist
    - [ ] Test: returns empty array when hovered cell is null
    - [ ] Test: handles selected piece as source instead of nearest piece
- [ ] Task: Implement trajectory waypoint computation
    - [ ] Create src/hooks/useTrajectoryPreview.ts
    - [ ] Scan placedComponents for nearest piece to hovered cell
    - [ ] Compute waypoints based on piece exit face direction
    - [ ] Handle edge cases (no pieces, null hover, selected piece)
    - [ ] Write waypoints to store trajectoryPreviewCache
- [ ] Task: Write tests for TrajectoryLine component
    - [ ] Test: renders dotted polyline from waypoints array
    - [ ] Test: renders nothing when waypoints array is empty
    - [ ] Test: line has low-opacity pastel color
- [ ] Task: Implement TrajectoryLine component
    - [ ] Create src/components/scene/TrajectoryLine.tsx
    - [ ] Read trajectoryPreviewCache from store
    - [ ] Render Line component from @react-three/drei
    - [ ] Apply dotted material with low opacity
- [ ] Task: Integrate trajectory preview with hover system
    - [ ] Connect useTrajectoryPreview to useGridInteraction hover state
    - [ ] Clear trajectoryPreviewCache on mouse leave
    - [ ] Hide trajectory during Play Mode
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Trajectory Preview' (Protocol in workflow.md)

## Phase 4: HUD Container & Integration

- [ ] Task: Write tests for HUD component
    - [ ] Test: renders InventoryPanel, ModeToggle, and ModeIndicator
    - [ ] Test: positions children correctly relative to viewport
- [ ] Task: Implement HUD component
    - [ ] Create src/components/ui/HUD.tsx
    - [ ] Import and render InventoryPanel, ModeToggle, ModeIndicator
    - [ ] Apply CSS positioning for viewport overlay
    - [ ] Ensure responsive scaling
- [ ] Task: Integrate HUD into App
    - [ ] Mount HUD in src/App.tsx alongside GameCanvas
    - [ ] Verify HUD renders above R3F Canvas
    - [ ] Verify no z-index conflicts
- [ ] Task: Integration testing
    - [ ] Test: inventory selection affects ghost preview in 3D scene
    - [ ] Test: mode transitions update UI elements correctly
    - [ ] Test: trajectory preview appears on hover in Build Mode
- [ ] Task: Conductor - User Manual Verification 'Phase 4: HUD Container & Integration' (Protocol in workflow.md)

## Phase 5: Final Verification

- [ ] Task: Run full test suite
    - [ ] Execute pnpm run test
    - [ ] Verify all tests pass
    - [ ] Verify coverage meets 80% threshold
- [ ] Task: Run linting and type checking
    - [ ] Execute pnpm run lint
    - [ ] Execute pnpm run typecheck
    - [ ] Fix any errors or warnings
- [ ] Task: Manual verification
    - [ ] Start dev server with pnpm run dev
    - [ ] Verify inventory panel displays correct counts
    - [ ] Verify piece selection works
    - [ ] Verify Play/Stop buttons function
    - [ ] Verify mode indicator updates
    - [ ] Verify trajectory preview appears on hover
    - [ ] Verify Escape key stops simulation
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Verification' (Protocol in workflow.md)
</protect>
