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

## Phase 2: Mode Controls & Indicator [checkpoint: 7bac760]

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
- [x] Task: Write tests for Escape key handler [2d805b6]
    - [x] Test: Escape key triggers Stop during PLAYING state
    - [x] Test: Escape key does nothing during BUILDING state
    - [x] Test: Escape key dispatches SANDBOX_BUILDING during SANDBOX_PLAYING
    - [x] Test: Escape key does nothing during SANDBOX_BUILDING state
- [x] Task: Implement Escape key handler [2d805b6]
    - [x] Create useEscapeKey hook (src/hooks/useEscapeKey.ts)
    - [x] Listen for keydown events
    - [x] Dispatch Stop action when Escape pressed in Play Mode
- [x] Task: Conductor - User Manual Verification 'Phase 2: Mode Controls & Indicator' (Protocol in workflow.md)

## Phase 3: Trajectory Preview [checkpoint: 33a83b9]

- [x] Task: Write tests for trajectory waypoint computation
    - [x] Test: finds nearest placed piece to hovered cell
    - [x] Test: computes waypoints from nearest piece exit face to hovered cell entry face
    - [x] Test: returns empty array when no placed pieces exist
    - [x] Test: returns empty array when hovered cell is null
    - [x] Test: handles selected piece as source instead of nearest piece
- [x] Task: Implement trajectory waypoint computation
    - [x] Create src/hooks/useTrajectoryPreview.ts
    - [x] Scan placedComponents for nearest piece to hovered cell
    - [x] Compute waypoints based on piece exit face direction
    - [x] Handle edge cases (no pieces, null hover, selected piece)
    - [x] Write waypoints to store trajectoryPreviewCache
- [x] Task: Write tests for TrajectoryLine component [c6fabc1]
    - [x] Test: renders dotted polyline from waypoints array
    - [x] Test: renders nothing when waypoints array is empty
    - [x] Test: line has low-opacity pastel color
- [x] Task: Implement TrajectoryLine component [c6fabc1]
    - [x] Create src/components/scene/TrajectoryLine.tsx
    - [x] Read trajectoryPreviewCache from store
    - [x] Render Line component from @react-three/drei
    - [x] Apply dotted material with low opacity
- [x] Task: Integrate trajectory preview with hover system [ffbf79f]
    - [x] Connect useTrajectoryPreview to useGridInteraction hover state
    - [x] Clear trajectoryPreviewCache on mouse leave
    - [x] Hide trajectory during Play Mode
- [x] Task: Conductor - User Manual Verification 'Phase 3: Trajectory Preview' (Protocol in workflow.md)

## Phase 4: HUD Container & Integration

- [x] Task: Write tests for HUD component [bfbd8ae]
    - [x] Test: renders InventoryPanel, ModeToggle, and ModeIndicator
    - [x] Test: positions children correctly relative to viewport
- [x] Task: Implement HUD component [bfbd8ae]
    - [x] Create src/components/ui/HUD.tsx
    - [x] Import and render InventoryPanel, ModeToggle, ModeIndicator
    - [x] Apply CSS positioning for viewport overlay
    - [x] Ensure responsive scaling
- [x] Task: Integrate HUD into App [475e029]
    - [x] Mount HUD in src/App.tsx alongside GameCanvas
    - [x] Verify HUD renders above R3F Canvas
    - [x] Verify no z-index conflicts
- [x] Task: Integration testing [6d05a69]
    - [x] Test: inventory selection affects ghost preview in 3D scene
    - [x] Test: mode transitions update UI elements correctly
    - [x] Test: trajectory preview appears on hover in Build Mode
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
