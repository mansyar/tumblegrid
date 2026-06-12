<protect>
# Implementation Plan: TRACK-010 — Mobile Polish & Final QA

## Phase 1: Touch Input Pipeline

- [ ] Task: Create `src/utils/input/normalizePointer.ts` — unified pointer/touch/mouse → `{ x, y, button, isTouch }` format
    - [ ] Export `NormalizedPointer` type interface
    - [ ] Export `normalizePointer(event)` function handling MouseEvent, TouchEvent, PointerEvent
    - [ ] Handle touch coordinate normalization (clientX/Y → normalized)
    - [ ] Write tests in `tests/normalizePointer.test.ts`

- [ ] Task: Modify `src/hooks/useGridInteraction.ts` — integrate normalized pointer input
    - [ ] Replace direct mouse event usage with `normalizePointer()`
    - [ ] Ensure tap-to-place works on touch devices
    - [ ] Ensure tap-to-select works on touch devices
    - [ ] Verify desktop mouse controls have zero regression
    - [ ] Write/update tests

- [ ] Task: Modify `src/components/scene/GameCanvas.tsx` — add touch event bindings
    - [ ] Attach touch event listeners (touchstart, touchmove, touchend)
    - [ ] Pass normalized events to interaction hooks
    - [ ] Prevent default touch behaviors (scroll, zoom) on game canvas
    - [ ] Write/update tests

- [ ] Task: Conductor - User Manual Verification 'Phase 1: Touch Input Pipeline' (Protocol in workflow.md)

## Phase 2: Touch Gestures

- [ ] Task: Create `src/hooks/useTouchRotation.ts` — two-finger twist gesture
    - [ ] Track two touch points (touchstart with 2 fingers)
    - [ ] Compute angle delta between finger positions
    - [ ] Map angle delta to rotationIndex cycle (threshold: ~45° per step)
    - [ ] Export `useTouchRotation()` hook returning current rotation action
    - [ ] Write tests in `tests/useTouchRotation.test.ts`

- [ ] Task: Integrate pinch-to-zoom with OrbitControls
    - [ ] Verify OrbitControls handles pinch natively (R3F drei)
    - [ ] Tune damping parameters for smooth feel
    - [ ] Test on mobile device emulation

- [ ] Task: Wire single-finger drag for camera orbit
    - [ ] Verify OrbitControls handles single-finger drag as orbit
    - [ ] Ensure single tap (not drag) still places pieces
    - [ ] Differentiate tap vs drag with distance threshold

- [ ] Task: Integrate useTouchRotation into GameCanvas
    - [ ] Mount useTouchRotation hook
    - [ ] Connect twist action to store rotation dispatch
    - [ ] Write integration tests

- [ ] Task: Conductor - User Manual Verification 'Phase 2: Touch Gestures' (Protocol in workflow.md)

## Phase 3: Rotate Button (Mobile)

- [ ] Task: Create RotateButton component in `src/components/ui/RotateButton.tsx`
    - [ ] Render button with ≥44px touch target
    - [ ] Dispatch rotation action on tap
    - [ ] Show only on touch devices (or always visible with responsive styling)
    - [ ] Write tests

- [ ] Task: Mount RotateButton in HUD (`src/components/ui/HUD.tsx`)
    - [ ] Position appropriately (near bottom or side of viewport)
    - [ ] Ensure it doesn't overlap with other UI elements
    - [ ] Wire to store: rotate hover piece (pre-placement) or selected piece (post-placement)

- [ ] Task: Conductor - User Manual Verification 'Phase 3: Rotate Button' (Protocol in workflow.md)

## Phase 4: Responsive Inventory Panel (Bottom Drawer)

- [ ] Task: Create `src/styles/mobile.css` — mobile-specific CSS
    - [ ] Media query for ≤768px width
    - [ ] Bottom drawer layout: fixed bottom, horizontal scroll
    - [ ] Compact piece icons + counts
    - [ ] Safe area padding using `env(safe-area-inset-bottom)`
    - [ ] Import in main entry point

- [ ] Task: Modify `src/components/ui/InventoryPanel.tsx` — responsive layout
    - [ ] Add CSS classes for bottom drawer mode
    - [ ] Horizontal scrollable container
    - [ ] Compact piece type display (icon + count, no label)
    - [ ] Desktop layout unchanged (zero regression)
    - [ ] Write/update tests

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
