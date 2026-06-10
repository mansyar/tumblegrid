<protect>
# TRACK-002: Core 3D Scene & Grid System — Specification

## Overview

**User Story:** As a player, I want to see a 3D isometric grid floor with orbitable camera controls when I load the game, so that the spatial puzzle environment is visually established.

**Track Type:** Feature

**Core Dependency:** TRACK-001 (Project Scaffolding)

---

## Functional Requirements

### FR-1: R3F Canvas & Scene Setup
- Mount a React Three Fiber `<Canvas>` component in `src/components/scene/GameCanvas.tsx`
- Canvas must be full-viewport (fills entire browser window)
- Configure appropriate pixel ratio and performance settings

### FR-2: Three-Point Lighting System
- Implement cinematic three-point lighting:
  - **Key Light:** Primary directional light for main illumination and shadows
  - **Fill Light:** Softer light to reduce harsh shadows
  - **Back Light:** Rim/edge light for depth separation
- All lights must be positioned to complement the isometric camera angle

### FR-3: Grid Floor Rendering
- Use `@react-three/drei`'s `<Grid>` component for floor grid
- **Cell Size:** 2×2 world units per cell (matching product spec)
- **Grid Dimensions:** 10×10 cells (20×20 world units)
- **Visual Style:** Infinite fade grid — extends visually and fades at edges for depth perception
- **Color Palette:** Soft pastel grid lines on dark background (per product guidelines)

### FR-4: Camera System with OrbitControls
- Implement `OrbitControls` from `@react-three/drei`
- **Initial Position:** 45° pitch, 45° yaw (isometric view)
- **Pitch Clamp:** [10°, 80°] — prevents camera flipping below floor
- **Zoom Limits:** [5, 50] — min/max distance from target
- **Damping:** Enable smooth orbit damping for polished feel

### FR-5: Auto-Framing Hook
- Create `src/hooks/useCamera.ts` with `autoFrame(bounds)` function
- **Input:** Grid bounds object `{ x, y, z, width, height, depth }`
- **Behavior:** Smoothly animate camera position and controls target to frame the specified volume
- **Animation:** Lerp over ~0.5 seconds for polished UX
- **Use Case:** Called when loading levels with different grid sizes

### FR-6: Component Integration
- Modify `src/App.tsx` to mount `GameCanvas` component
- Scene renders immediately on app load (no loading states for MVP)

---

## Non-Functional Requirements

### NFR-1: Performance
- Canvas must maintain 60fps on modern desktop browsers
- Grid rendering should not cause frame drops during orbit/zoom
- Three-point lighting must not significantly impact render performance

### NFR-2: Visual Quality
- Clean, minimalist aesthetic matching product vision
- Grid lines must be clearly visible but not distracting
- Lighting should create sense of depth without harsh shadows

### NFR-3: Cross-Browser Compatibility
- Must work on Chrome, Firefox, Safari, Edge (latest 2 major versions)
- WebGL context must initialize without errors

---

## Acceptance Criteria

### AC-1: Grid Floor Renders Correctly
- [ ] Grid floor visible at correct world scale (2-unit cells)
- [ ] 10×10 cell grid renders within 20×20 world unit area
- [ ] Infinite fade effect creates visual depth at edges
- [ ] Soft pastel color palette applied to grid lines

### AC-2: Camera Controls Work
- [ ] OrbitControls orbit with mouse drag (right button)
- [ ] Scroll wheel zooms in/out within [5, 50] limits
- [ ] Pitch cannot flip below 10° or above 80°
- [ ] Initial view is 45° pitch / 45° yaw isometric angle
- [ ] Damping provides smooth orbit feel

### AC-3: Auto-Framing Functions
- [ ] `autoFrame(bounds)` accepts grid bounds object
- [ ] Camera smoothly animates to frame specified volume over ~0.5s
- [ ] Controls target updates to center of specified bounds
- [ ] Works correctly for different grid sizes (6×4×3, 10×10×5, etc.)

### AC-4: Lighting Creates Depth
- [ ] Three-point lighting setup visible in scene
- [ ] Key light provides primary illumination
- [ ] Fill light reduces harsh shadows
- [ ] Back light creates rim/edge separation
- [ ] Lighting complements isometric camera angle

### AC-5: No Errors or Warnings
- [ ] No console errors during scene initialization
- [ ] No Three.js warnings about missing materials/geometries
- [ ] WebGL context initializes successfully
- [ ] No React rendering errors

### AC-6: Code Quality
- [ ] All new files follow project TypeScript conventions
- [ ] Components are properly typed with interfaces
- [ ] No `any` types used
- [ ] Code passes Biome lint and format checks

---

## Out of Scope

- ❌ Piece placement, physics, or game mode logic
- ❌ Inventory UI or HUD elements
- ❌ Marble rendering or physics simulation
- ❌ Audio system
- ❌ Mobile touch controls (deferred to TRACK-010)
- ❌ Level loading or state management (deferred to TRACK-003)
- ❌ Piece meshes or interaction (deferred to TRACK-004)

---

## Technical Notes

### Files to Create
- `src/components/scene/GameCanvas.tsx` — R3F Canvas wrapper with lighting
- `src/components/scene/GridFloor.tsx` — Grid floor component using drei
- `src/hooks/useCamera.ts` — Camera hook with autoFrame function

### Files to Modify
- `src/App.tsx` — Mount GameCanvas component

### Dependencies
- `@react-three/fiber` (Canvas, useFrame)
- `@react-three/drei` (OrbitControls, Grid)
- `three` (Vector3, Euler, MathUtils for lerp)
</protect>
