<protect>
# Implementation Plan: TRACK-010 — Mobile Polish & Final QA

## Phase 1: Touch Input Pipeline

- [x] Task: Create `src/utils/input/normalizePointer.ts` — unified pointer/touch/mouse → `{ x, y, button, isTouch }` format
    - [x] Export `NormalizedPointer` type interface
    - [x] Export `normalizePointer(event)` function handling MouseEvent, TouchEvent, PointerEvent
    - [x] Handle touch coordinate normalization (clientX/Y → normalized)
    - [x] Write tests in `tests/normalizePointer.test.ts`

- [x] Task: Modify `src/hooks/useGridInteraction.ts` — integrate normalized pointer input
    - [x] Replace direct mouse event usage with `normalizePointer()`
    - [x] Ensure tap-to-place works on touch devices
    - [x] Ensure tap-to-select works on touch devices
    - [x] Verify desktop mouse controls have zero regression
    - [x] Write/update tests

- [x] Task: Modify `src/components/scene/GameCanvas.tsx` — add touch event bindings
    - [x] Attach touch event listeners (touchstart, touchmove, touchend)
    - [x] Pass normalized events to interaction hooks
    - [x] Prevent default touch behaviors (scroll, zoom) on game canvas
    - [x] Write/update tests

- [ ] Task: Conductor - User Manual Verification 'Phase 1: Touch Input Pipeline' (Protocol in workflow.md)

## Phase 2: Touch Gestures

- [x] Task: Create `src/hooks/useTouchRotation.ts` — two-finger twist gesture
    - [x] Track two touch points (touchstart with 2 fingers)
    - [x] Compute angle delta between finger positions
    - [x] Map angle delta to rotationIndex cycle (threshold: ~45° per step)
    - [x] Export `useTouchRotation()` hook returning current rotation action
    - [x] Write tests in `tests/useTouchRotation.test.ts`

- [x] Task: Integrate pinch-to-zoom with OrbitControls
    - [x] Verify OrbitControls handles pinch natively (R3F drei)
    - [x] Tune damping parameters for smooth feel
    - [x] Test on mobile device emulation

- [x] Task: Wire single-finger drag for camera orbit
    - [x] Verify OrbitControls handles single-finger drag as orbit
    - [x] Ensure single tap (not drag) still places pieces
    - [x] Differentiate tap vs drag with distance threshold

- [x] Task: Integrate useTouchRotation into GameCanvas
    - [x] Mount useTouchRotation hook
    - [x] Connect twist action to store rotation dispatch
    - [x] Write integration tests

- [ ] Task: Conductor - User Manual Verification 'Phase 2: Touch Gestures' (Protocol in workflow.md)

## Phase 3: Rotate Button (Mobile)

- [x] Task: Create RotateButton component in `src/components/ui/RotateButton.tsx`
    - [x] Render button with ≥44px touch target
    - [x] Dispatch rotation action on tap
    - [x] Show only on touch devices (or always visible with responsive styling)
    - [x] Write tests

- [x] Task: Mount RotateButton in HUD (`src/components/ui/HUD.tsx`)
    - [x] Position appropriately (near bottom or side of viewport)
    - [x] Ensure it doesn't overlap with other UI elements
    - [x] Wire to store: rotate hover piece (pre-placement) or selected piece (post-placement)

- [ ] Task: Conductor - User Manual Verification 'Phase 3: Rotate Button' (Protocol in workflow.md)

## Phase 4: Responsive Inventory Panel (Bottom Drawer) [checkpoint: 9e115d6]

- [x] Task: Create `src/styles/mobile.css` — mobile-specific CSS
    - [x] Media query for ≤768px width
    - [x] Bottom drawer layout: fixed bottom, horizontal scroll
    - [x] Compact piece icons + counts
    - [x] Safe area padding using `env(safe-area-inset-bottom)`
    - [x] Import in main entry point

- [x] Task: Responsive inventory via CSS (no component changes needed)
    - [x] CSS-only responsive: `.inventory-item-label` hidden on mobile via `display: none`
    - [x] Horizontal scrollable container via media query
    - [x] Compact piece type display (icon + count, no label)
    - [x] Desktop layout unchanged (zero regression — media query only ≤768px)
    - [x] Tests: `tests/styles/mobile.test.ts` (10 tests)

- [ ] Task: Conductor - User Manual Verification 'Phase 4: Responsive Inventory' (Protocol in workflow.md)

## Phase 5: Touch Target Sizing & Safe Areas

- [ ] Task: Audit all interactive elements for ≥44px touch targets
    - [ ] Play/Stop buttons (ModeToggle.tsx)
    - [ ] Rotate button (new)
    - [ ] Piece type selectors (InventoryPanel.tsx)
    - [ ] Menu buttons (MainMenu.tsx, LevelSelect.tsx)
    - [ ] Victory overlay buttons

- [ ] Task: Apply touch target sizing
    - [ ] Use CSS min-height/min-width/padding to achieve 44px
    - [ ] Ensure visual appearance remains clean
    - [ ] Write CSS tests or visual verification

- [ ] Task: Update `index.html` viewport meta tag
    - [ ] Set `width=device-width, initial-scale=1, viewport-fit=cover`
    - [ ] Enables safe area CSS env() variables

- [ ] Task: Apply safe area handling to HUD (`src/components/ui/HUD.tsx`)
    - [ ] Top padding: `env(safe-area-inset-top)`
    - [ ] Bottom padding: `env(safe-area-inset-bottom)` (for inventory drawer)
    - [ ] Left/Right padding: `env(safe-area-inset-left)`, `env(safe-area-inset-right)`

- [ ] Task: Apply safe area to bottom drawer inventory
    - [ ] Ensure inventory doesn't overlap home indicator
    - [ ] Test on iPhone notch simulation

- [ ] Task: Conductor - User Manual Verification 'Phase 5: Touch Targets & Safe Areas' (Protocol in workflow.md)

## Phase 6: Cross-Browser QA & Final Verification

- [ ] Task: Desktop browser testing
    - [ ] Chrome (latest) — all features work
    - [ ] Firefox (latest) — all features work
    - [ ] Safari (latest) — all features work
    - [ ] Edge (latest) — all features work
    - [ ] Document any browser-specific issues

- [ ] Task: Mobile browser testing
    - [ ] iOS Safari — touch, gestures, responsive layout
    - [ ] Android Chrome — touch, gestures, responsive layout
    - [ ] Test on real device if possible (or Chrome DevTools emulation)
    - [ ] Document any mobile-specific issues

- [ ] Task: Regression testing
    - [ ] All desktop controls work identically to before
    - [ ] No console errors or warnings
    - [ ] Physics simulation unaffected
    - [ ] Audio system unaffected

- [ ] Task: Run full test suite
    - [ ] `pnpm run test` — all tests pass
    - [ ] `pnpm run lint` — Biome clean
    - [ ] `pnpm run typecheck` — TypeScript clean
    - [ ] `pnpm run build` — production build succeeds

- [ ] Task: Conductor - User Manual Verification 'Phase 6: Cross-Browser QA' (Protocol in workflow.md)

</protect>
