# TRACK-004: Piece System & Interaction (3D Components) — Specification

## 1. Overview

**User Story:** As a player, I want to see 3D representations of all piece types (Launchpad, Straight Ramp, Bumper Pad, Speed Booster, Half-Pipe Tunnel, Goal Bucket) rendered on the grid, and I want to click cells to place them with the correct rotation.

**Scope Boundary:**
- **Will:** Build R3F mesh components for each piece type, implement raycasting (mouse → floor plane intersection → grid snapping), piece preview (ghost mesh while hovering), placement/removal by clicking, and rotation via R key. Each piece occupies exactly 1 grid cell (2×2×2 world units). Entry/exit face logic is visual only at this stage.
- **Will NOT:** Activate physics, run simulation, implement trajectory preview, or build inventory UI panels.

**Dependencies:** TRACK-002 (Core 3D Scene & Grid System), TRACK-003 (State Management & Level Data)

---

## 2. Functional Requirements

### 2.1 Piece Mesh Components (6 Types)

| Piece | Visual Representation | Material/Color |
|---|---|---|
| **Launchpad** | Fixed platform with raised center | Dark gray base, neon accent |
| **Straight Ramp** | Diagonal slope filling cell | Pastel blue |
| **Speed Booster** | Flat track with directional arrows | Pastel green |
| **Bumper Pad** | Vertical wall with bounce indicator | Pastel orange |
| **Half-Pipe Tunnel** | Flat track with side rails | Pastel purple |
| **Goal Bucket** | Open container with trigger zone | Pastel yellow, emissive glow |

**Requirements:**
- Each piece occupies exactly 1 grid cell (2×2×2 world units)
- Pieces built using Three.js primitive geometry (BoxGeometry, CylinderGeometry, etc.)
- Visually distinct materials per type (pastel color palette from GDD)
- Pieces render at correct grid position based on store state

### 2.2 Grid Interaction System

**Raycasting & Grid Snapping:**
- Cast ray from camera through pointer position
- Intersect with floor plane (Y=0) or existing piece top face
- Snap to nearest integer grid cell coordinates
- Support both mouse and touch input (normalized pointer events)

**Ghost Preview:**
- Semi-transparent piece mesh shown at hovered cell
- Updates in real-time as mouse moves
- Reflects current rotationIndex from Active Blueprint Node
- Hidden when hovering outside grid bounds or over occupied cell

**Placement Logic:**
- Click empty cell → place piece from inventory
- Call `store.placePiece()` with pieceType, position, rotationIndex
- Inventory count decremented automatically
- Overlap prevention (store rejects placement on occupied cell)

### 2.3 Selection & Rotation System

**Selection:**
- Click placed piece → select (store piece ID in `selectedPieceId`)
- Selected piece renders with outline glow effect (post-processing or shader)
- Click selected piece again → remove it (call `store.removePiece()`)
- Click empty space or different piece → deselect current selection

**Rotation:**
- Press R key → rotate selected piece 90° clockwise
- Rotation cycles: 0° → 90° → 180° → 270° → 0°
- Call `store.rotatePiece()` to update rotationIndex
- Mesh re-renders with new rotation immediately
- Also works on ghost preview (pre-placement rotation)

### 2.4 Piece Factory Component

**PieceFactory.tsx:**
- Type-dispatching wrapper component
- Takes `pieceType` prop and renders corresponding mesh
- Handles rotation transform (Y-axis, 90° increments)
- Used for both placed pieces and ghost preview

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Piece meshes render at 60fps without frame drops
- Raycasting calculations complete within single frame
- No unnecessary re-renders (memoization where needed)

### 3.2 Visual Quality
- Clean, low-poly aesthetic matching GDD
- Consistent pastel color palette across all piece types
- Clear visual distinction between piece types
- Selection highlight clearly visible but not distracting

### 3.3 Code Quality
- TypeScript strict mode compliance
- Biome linting passes with zero warnings
- Components follow React best practices (hooks, memoization)
- No `any` types, no non-null assertions

---

## 4. Acceptance Criteria

### 4.1 Piece Rendering
- [ ] All 6 piece types render as distinct 3D meshes
- [ ] Each piece occupies exactly 1 grid cell (2×2×2 world units)
- [ ] Pieces display correct pastel colors per type
- [ ] Pieces render at correct grid positions from store state

### 4.2 Grid Interaction
- [ ] Raycasting correctly snaps to integer grid coordinates
- [ ] Ghost preview appears at hovered cell (semi-transparent)
- [ ] Ghost preview updates in real-time as mouse moves
- [ ] Ghost preview reflects current rotationIndex
- [ ] Click empty cell places piece from inventory
- [ ] Overlap prevention works (no placement on occupied cell)

### 4.3 Selection & Rotation
- [ ] Click placed piece selects it (outline glow effect)
- [ ] Click selected piece removes it (returns to inventory)
- [ ] Click empty space deselects current selection
- [ ] R key rotates selected piece 90° clockwise
- [ ] Rotation cycles correctly (0→1→2→3→0)
- [ ] Rotation works on ghost preview (pre-placement)

### 4.4 Integration
- [ ] Pieces correctly read from Zustand store state
- [ ] Placement/removal updates store actions
- [ ] Inventory counts decrement/increment correctly
- [ ] No console errors or Three.js warnings

---

## 5. Out of Scope

- Physics simulation (deferred to TRACK-006)
- Trajectory preview (deferred to TRACK-005)
- Inventory UI panel (deferred to TRACK-005)
- Audio feedback (deferred to TRACK-008)
- Mobile touch gestures (deferred to TRACK-010)
- Win/lose conditions (deferred to TRACK-007)
