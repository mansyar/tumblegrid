<protect>
# TRACK-002: Core 3D Scene & Grid System — Implementation Plan

## Phase 1: Canvas & Lighting [COMPLETE]

- [x] Task: Write Failing Tests for GameCanvas Component
    - [ ] Create test file `tests/components/scene/GameCanvas.test.tsx`
    - [ ] Write test: GameCanvas renders without errors
    - [ ] Write test: Canvas fills viewport (width=100%, height=100%)
    - [ ] Write test: Three-point lighting setup is present (key, fill, back lights)
    - [ ] Run tests and confirm they fail (Red Phase)

- [x] Task: Implement GameCanvas Component [641baa8]
    - [ ] Create `src/components/scene/GameCanvas.tsx`
    - [ ] Import Canvas from @react-three/fiber
    - [ ] Configure Canvas with appropriate pixel ratio and performance settings
    - [ ] Add key light (DirectionalLight) at position complementing isometric view
    - [ ] Add fill light (softer DirectionalLight or AmbientLight) to reduce shadows
    - [ ] Add back light (PointLight or SpotLight) for rim/edge separation
    - [ ] Export GameCanvas component
    - [ ] Run tests and confirm they pass (Green Phase)

- [x] Task: Refactor and Verify Coverage [f982acf]
    - [x] Review GameCanvas implementation for clarity and simplicity
    - [ ] Verify test coverage meets >80% requirement
    - [ ] Run `pnpm run lint` to ensure code passes Biome checks
    - [ ] Commit changes with message: `feat(scene): Implement GameCanvas with three-point lighting`
    - [ ] Attach git note with task summary
    - [ ] Update plan.md with commit SHA

- [x] Task: Integrate GameCanvas into App [ab44d9f]
    - [ ] Modify `src/App.tsx` to import and mount GameCanvas
    - [ ] Remove any placeholder content from App.tsx
    - [ ] Verify scene renders in browser at `http://localhost:5173`
    - [ ] Commit changes with message: `feat(app): Mount GameCanvas in App component`
    - [ ] Attach git note with task summary
    - [ ] Update plan.md with commit SHA

- [x] Task: Conductor - User Manual Verification 'Phase 1: Canvas & Lighting' [8c9c074]
    - [x] Run `pnpm run dev` and open browser
    - [x] Verify: 3D canvas fills viewport with dark background
    - [x] Verify: Lighting creates depth (visible key, fill, back lights)
    - [x] Verify: No console errors or Three.js warnings
    - [x] Confirm with user: "Does this meet your expectations?"
    - [x] Create checkpoint commit
    - [x] Attach verification report as git note
    - [x] Update plan.md with checkpoint SHA

---

## Phase 2: Grid Floor [COMPLETE]

- [x] Task: Write Failing Tests for GridFloor Component [a4f7e59]
    - [x] Create test file `tests/components/scene/GridFloor.test.tsx`
    - [x] Write test: GridFloor renders without errors
    - [x] Write test: Grid uses 2×2 world unit cell size
    - [x] Write test: Grid has infinite fade effect at edges
    - [x] Run tests and confirm they fail (Red Phase)

- [x] Task: Implement GridFloor Component [a4f7e59]
    - [x] Create `src/components/scene/GridFloor.tsx`
    - [x] Import Grid from @react-three/drei
    - [x] Configure Grid with cellSize={2} for 2×2 world units
    - [x] Configure infinite grid with fade distance
    - [x] Apply soft pastel color palette for grid lines
    - [x] Set dark background color (matching product aesthetic)
    - [x] Export GridFloor component
    - [x] Run tests and confirm they pass (Green Phase)

- [x] Task: Refactor and Verify Coverage [a4f7e59]
    - [x] Review GridFloor implementation for visual quality
    - [x] Verify test coverage meets >80% requirement
    - [x] Run `pnpm run lint` to ensure code passes Biome checks
    - [x] Commit changes with message: `feat(scene): Implement GridFloor with custom grid helper`
    - [x] Attach git note with task summary
    - [x] Update plan.md with commit SHA

- [x] Task: Integrate GridFloor into GameCanvas [ec9aaee]
    - [x] Import and mount GridFloor in GameCanvas component
    - [x] Position GridFloor at world origin (0, 0, 0)
    - [x] Verify grid renders correctly in browser
    - [x] Commit changes with message: `feat(scene): Mount GridFloor in GameCanvas`
    - [x] Attach git note with task summary
    - [x] Update plan.md with commit SHA

- [x] Task: Conductor - User Manual Verification 'Phase 2: Grid Floor' [804cfa8]
    - [x] Run `pnpm run dev` and open browser
    - [x] Verify: Grid floor visible with 2-unit cell size
    - [x] Verify: Infinite fade effect at edges creates depth
    - [x] Verify: Soft pastel grid lines on dark background
    - [x] Verify: 10×10 cells visible within 20×20 world unit area
    - [x] Confirm with user: "Does this meet your expectations?"
    - [x] Create checkpoint commit
    - [x] Attach verification report as git note
    - [x] Update plan.md with checkpoint SHA

---

## Phase 3: Camera System [COMPLETE] [checkpoint: 3995fed]

- [x] Task: Write Failing Tests for useCamera Hook
    - [ ] Create test file `tests/hooks/useCamera.test.ts`
    - [ ] Write test: useCamera hook returns autoFrame function
    - [ ] Write test: autoFrame accepts bounds object with x, y, z, width, height, depth
    - [ ] Write test: autoFrame animates camera position over ~0.5s
    - [ ] Run tests and confirm they fail (Red Phase)

- [x] Task: Implement useCamera Hook [d63b442]
    - [ ] Create `src/hooks/useCamera.ts`
    - [ ] Import useThree, useFrame from @react-three/fiber
    - [ ] Import OrbitControls from @react-three/drei
    - [ ] Implement autoFrame(bounds) function:
        - Calculate target camera position to frame specified bounds
        - Use lerp to smoothly animate over ~0.5 seconds
        - Update controls.target to center of bounds
    - [ ] Export useCamera hook
    - [ ] Run tests and confirm they pass (Green Phase)

- [x] Task: Refactor and Verify Coverage
    - [ ] Review useCamera implementation for smooth animation
    - [ ] Verify test coverage meets >80% requirement
    - [ ] Run `pnpm run lint` to ensure code passes Biome checks
    - [ ] Commit changes with message: `feat(camera): Implement useCamera hook with autoFrame`
    - [ ] Attach git note with task summary
    - [ ] Update plan.md with commit SHA

- [x] Task: Configure OrbitControls in GameCanvas [b0a0dd4]
    - [ ] Import OrbitControls in GameCanvas component
    - [ ] Configure initial position: 45° pitch, 45° yaw
    - [ ] Set pitch clamp: minPolarAngle={10°}, maxPolarAngle={80°}
    - [ ] Set zoom limits: minDistance={5}, maxDistance={50}
    - [ ] Enable damping for smooth orbit feel
    - [ ] Mount useCamera hook and expose autoFrame
    - [ ] Verify camera controls work in browser
    - [ ] Commit changes with message: `feat(camera): Configure OrbitControls with clamps and damping`
    - [ ] Attach git note with task summary
    - [ ] Update plan.md with commit SHA

- [x] Task: Implement Auto-Framing Integration [8850903]
    - [ ] Create example usage of autoFrame with test bounds
    - [ ] Verify camera smoothly animates to frame specified volume
    - [ ] Test with different grid sizes (6×4×3, 10×10×5)
    - [ ] Commit changes with message: `feat(camera): Integrate autoFrame with test bounds`
    - [ ] Attach git note with task summary
    - [ ] Update plan.md with commit SHA

- [x] Task: Conductor - User Manual Verification 'Phase 3: Camera System' [3995fed] (Protocol in workflow.md)
    - [ ] Run `pnpm run dev` and open browser
    - [ ] Verify: Initial view is 45° pitch / 45° yaw isometric angle
    - [ ] Verify: Mouse drag orbits camera (right button)
    - [ ] Verify: Scroll wheel zooms within [5, 50] limits
    - [ ] Verify: Pitch cannot flip below 10° or above 80°
    - [ ] Verify: Damping provides smooth orbit feel
    - [ ] Verify: autoFrame smoothly animates to different grid sizes
    - [ ] Confirm with user: "Does this meet your expectations?"
    - [ ] Create checkpoint commit
    - [ ] Attach verification report as git note
    - [ ] Update plan.md with checkpoint SHA

---

## Phase: Review Fixes

- [x] Task: Apply review suggestions [623e0ae]
    - [x] GridFloor: Replace THREE.GridHelper with drei Grid component (spec compliance)
    - [x] GridFloor: Use product guideline colors (#C0B8B0, #E8E0D8)
    - [x] GameCanvas: Remove window.testAutoFrame global (no test code in production)
    - [x] Scene: Remove unused onAutoFrame prop and dead ambientLight position
    - [x] useCamera: Replace useRef<any> with proper OrbitControlsImpl type
    - [x] GameCanvas.test: Fix import path to use @/ alias
    - [x] Add three-stdlib as dev dependency for OrbitControls type

---

## Definition of Done

- [x] Grid floor renders at correct world scale (2-unit cells)
- [x] OrbitControls orbit, zoom, and pitch clamp all work
- [x] `autoFrame(bounds)` correctly positions camera for any volume
- [x] No console errors or Three.js warnings
- [x] Code passes static analysis review
- [x] All tests pass with >80% coverage
- [x] All commits have attached git notes
- [x] All phases have checkpoint commits with verification reports
</protect>
