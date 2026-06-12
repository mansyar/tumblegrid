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

- [x] Task: Conductor - User Manual Verification 'Phase 4: Responsive Inventory' (Protocol in workflow.md)

## Phase 5: Touch Target Sizing & Safe Areas

- [x] Task: Audit all interactive elements for ≥44px touch targets
    - [x] Play/Stop buttons (ModeToggle.tsx) — min-height: 44px, min-width: 120px
    - [x] Rotate button (RotateButton.tsx) — min-width: 44px, min-height: 44px
    - [x] Piece type selectors (InventoryPanel.tsx) — min-height: 44px (desktop), 56px (mobile)
    - [x] Menu buttons (MainMenu.tsx, LevelSelect.tsx) — inherited from button styles
    - [x] Victory overlay buttons — min-height: 48px
    - [x] Mute toggle — width: 44px, height: 44px

- [x] Task: Apply touch target sizing
    - [x] All elements already meet ≥44px threshold — no CSS changes needed
    - [x] Visual appearance unchanged

- [x] Task: Update `index.html` viewport meta tag
    - [x] Set `width=device-width, initial-scale=1, viewport-fit=cover`
    - [x] Enables safe area CSS env() variables

- [x] Task: Apply safe area handling to UI elements (`src/styles/mobile.css`)
    - [x] Mute toggle: `top: calc(16px + env(safe-area-inset-top))`, `right: calc(16px + env(safe-area-inset-right))`
    - [x] Rotate button container: `right: calc(16px + env(safe-area-inset-right))`
    - [x] Victory overlay buttons: `padding-bottom: env(safe-area-inset-bottom)`

- [x] Task: Apply safe area to bottom drawer inventory
    - [x] Already handled in Phase 4: `padding-bottom: calc(8px + env(safe-area-inset-bottom))`
    - [x] Removed duplicate media query from RotateButton.css (consolidated in mobile.css)

- [x] Task: Tests — `tests/styles/mobile.test.ts` expanded from 10 to 14 tests
    - [x] All 14 mobile CSS tests pass
    - [x] All 601 tests pass across 65 files
    - [x] Biome lint clean
    - [x] TypeScript typecheck clean

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
