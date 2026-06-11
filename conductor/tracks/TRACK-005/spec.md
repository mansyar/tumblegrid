<protect>
# Specification: Build Mode UI (Inventory & Controls)

## Overview

Build the Build Mode user interface layer for TumbleGrid. This includes an inventory sidebar displaying available piece types with remaining counts, mode control buttons (Play/Stop), a mode indicator, and a 3D trajectory preview system that visualizes the marble's estimated path from the nearest connected structure through the hovered cell.

**Track ID:** TRACK-005
**Type:** Feature
**Dependencies:** TRACK-003 (State & Level Data), TRACK-004 (Piece System & Interaction)

---

## Functional Requirements

### FR-1: Inventory Panel (Left Sidebar)

- **Position:** Fixed left sidebar overlay, vertically centered.
- **Content:** Displays each piece type from the level's inventory with:
  - A visual icon/representation of the piece type
  - The piece type label
  - Remaining count (e.g., "x3")
- **Interaction:** Clicking a piece type sets `selectedBlueprintType` in the store, which drives both the ghost preview piece type and the trajectory preview's target.
- **Active State:** The currently selected piece type is visually highlighted.
- **Empty State:** Piece types with 0 remaining count are greyed out and disabled.
- **Data Source:** Reads from `store.inventory` and `store.selectedBlueprintType`.

### FR-2: Mode Controls

- **Play Button:**
  - Always enabled (no guard conditions).
  - Dispatches state transition from `BUILDING` → `PLAYING` (or `SANDBOX_BUILDING` → `SANDBOX_PLAYING`).
  - Located in the bottom-center of the viewport.
- **Stop Button:**
  - Visible during `PLAYING` and `SANDBOX_PLAYING` states only.
  - Wired to store action that transitions state back to `BUILDING` / `SANDBOX_BUILDING`.
  - Located in the same position as Play button (replaces it).
  - All placed pieces are preserved on Stop.
- **Keyboard Shortcut:** `Escape` key also triggers Stop (desktop).

### FR-3: Mode Indicator

- **Display:** Shows current mode text ("Build Mode" or "Play Mode") in the top-center of the viewport.
- **Visual Style:** Subtle, non-intrusive text overlay.
- **Updates:** Reactively reflects store `machineState`.

### FR-4: Trajectory Preview

- **Trigger:** Activates when hovering over an empty cell in Build Mode.
- **Algorithm:**
  1. Scan `placedComponents` for the piece geometrically closest to the hovered cell.
  2. Compute waypoints from that piece's exit face → empty cells along the facing direction → the hovered piece's entry face → its exit face.
  3. Store waypoints in `trajectoryPreviewCache` as `[x, y, z]` triplets.
- **Rendering:** Faint dotted polyline (low-opacity, pastel color) connecting waypoints through the 3D scene.
- **Visibility:** Hidden during Play Mode. Hidden when no cell is hovered.
- **Selection Mode:** When a piece is selected (post-placement), preview recomputes from the selected piece.
- **Data Source:** Reads/writes `store.trajectoryPreviewCache`.

### FR-5: HUD Container

- **Purpose:** Overlay container that positions all 2D UI elements (Inventory, Mode Controls, Mode Indicator) relative to the viewport.
- **Layering:** Rendered above the R3F Canvas using CSS positioning (not inside the 3D scene).
- **Responsiveness:** Scales with viewport dimensions.

---

## Non-Functional Requirements

- **Performance:** UI updates must not cause frame drops in the 3D scene. Inventory panel re-renders only when `inventory` or `activeBlueprintNode` changes.
- **Accessibility:** All interactive elements have minimum 44px touch targets for mobile compatibility.
- **Code Quality:** Passes Biome linting with zero warnings. No `any` types. No unused imports.

---

## Acceptance Criteria

1. Inventory panel renders with all piece types and correct remaining counts from the loaded level.
2. Clicking a piece type in the inventory panel sets `activeBlueprintNode.type` in the store.
3. Active piece type is visually highlighted in the inventory panel.
4. Piece types with 0 count are greyed out and not clickable.
5. Play button dispatches `BUILDING → PLAYING` state transition.
6. Stop button is visible during Play Mode and dispatches `PLAYING → BUILDING` transition.
7. Escape key triggers Stop during Play Mode.
8. Mode indicator displays "Build Mode" or "Play Mode" based on current state.
9. Trajectory preview computes waypoints from nearest connected piece through hovered cell.
10. Trajectory preview renders as a faint dotted polyline in the 3D scene.
11. Trajectory preview is hidden during Play Mode.
12. UI is responsive and scales with viewport.
13. All code passes `pnpm run lint` and `pnpm run typecheck`.

---

## Out of Scope

- Physics simulation (TRACK-006)
- Main menu screens (TRACK-007)
- Victory/defeat overlays (TRACK-007)
- Audio feedback (TRACK-008)
- Mobile touch gestures (TRACK-010)
- Campaign progression (TRACK-007)
</protect>
