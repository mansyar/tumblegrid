# Specification: TRACK-010 — Mobile Polish & Final QA

## Overview

Implement comprehensive mobile touch support and responsive UI for TumbleGrid, ensuring the game is fully playable on phones and tablets. Additionally, perform final cross-browser QA to verify desktop and mobile experiences.

**Track Type:** Feature
**Core Dependency:** TRACK-009 (Campaign Levels & Sandbox)

## Functional Requirements

### FR-1: Touch Input Pipeline
- Normalize all pointer/touch/mouse events into a unified `{ x, y, button, isTouch }` format
- Feed normalized input into existing raycasting and interaction hooks
- Verify tap-to-place and tap-to-select work on touch devices
- No regression to desktop mouse controls

### FR-2: Touch Gestures
- **Two-Finger Twist:** Track two touch points, compute angle delta → cycle `rotationIndex` (0→1→2→3)
- **Pinch-to-Zoom:** Works with OrbitControls (may need damping tuning)
- **Single-Finger Drag:** Orbits camera on empty grid area
- **Tap:** Places pieces, selects/deselects pieces

### FR-3: Rotate Button (Mobile)
- Add a "Rotate" UI button visible only on touch devices (or always visible)
- Tapping it rotates the hover piece (pre-placement) or selected placed piece (post-placement) by 90°
- Alternative to two-finger twist gesture

### FR-4: Responsive Inventory Panel (Bottom Drawer)
- On mobile (≤768px width), inventory panel becomes a horizontal scrollable row at the bottom of the screen
- Always visible, does not block the 3D viewport significantly
- Piece type icons + remaining counts displayed in compact format
- On desktop, remains as current sidebar layout

### FR-5: Touch Target Sizing
- All interactive elements (buttons, piece selectors) must have ≥44px touch targets
- Applies to: Play/Stop buttons, Rotate button, piece type selectors, menu buttons
- Use CSS padding/min-height/min-width to achieve targets

### FR-6: Safe Area Handling
- Use CSS `env(safe-area-inset-*)` variables for notched devices
- Top safe area: iPhone notch/dynamic island
- Bottom safe area: iPhone home indicator (gesture bar)
- Camera cutout: Android punch-hole/notch
- Apply to HUD positioning and bottom drawer inventory

### FR-7: Viewport Meta Tag
- Ensure `index.html` has proper viewport meta: `width=device-width, initial-scale=1, viewport-fit=cover`
- Enables safe area CSS env() variables

### FR-8: Cross-Browser QA (Manual)
- Test on Chrome, Firefox, Safari, Edge (desktop)
- Test on iOS Safari, Android Chrome (mobile)
- Document any browser-specific issues found
- Fix critical issues; document known limitations

## Non-Functional Requirements

### NFR-1: Performance
- Touch input must not introduce noticeable input lag
- Pinch-to-zoom must feel smooth (60fps)
- No jank during inventory panel scroll

### NFR-2: Accessibility
- Touch targets meet WCAG 2.5.5 (minimum 44×44px)
- Visual feedback on touch (active states)

### NFR-3: Backward Compatibility
- Desktop controls remain identical (zero regression)
- Game works on browsers without touch support (graceful degradation)

## Acceptance Criteria

1. Tap-to-place and tap-to-select work on touch devices
2. Two-finger twist gesture rotates the selected piece
3. Rotate button works on mobile
4. Pinch-to-zoom works comfortably
5. All interactive elements have ≥44px touch targets
6. Safe area insets applied for notched devices
7. Inventory panel is usable on 375px-wide screens (bottom drawer)
8. Desktop controls have zero regression
9. Cross-browser test passes (Chrome, Firefox, Safari, Edge)
10. Code passes static analysis review (Biome lint + TypeScript)

## Out of Scope

- New game features or piece types
- Changes to desktop controls
- Progressive Web App (PWA) support
- Automated browser testing (manual QA only)
- Background music or audio changes

## New Files

| File | Purpose |
|---|---|
| `src/hooks/useTouchRotation.ts` | Two-finger twist gesture → rotationIndex |
| `src/utils/input/normalizePointer.ts` | Pointer, touch, mouse → unified format |
| `src/styles/mobile.css` | Mobile-specific responsive overrides |

## Modified Files

| File | Change |
|---|---|
| `src/hooks/useGridInteraction.ts` | Use normalized pointer input |
| `src/components/ui/InventoryPanel.tsx` | Responsive bottom drawer layout |
| `index.html` | Viewport meta tag, safe-area CSS env vars |
| `src/components/scene/GameCanvas.tsx` | Touch gesture bindings |
| `src/components/ui/HUD.tsx` | Responsive positioning, safe areas |
| `src/components/ui/ModeToggle.tsx` | Touch target sizing |
| `src/components/ui/ModeIndicator.tsx` | Touch target sizing |
