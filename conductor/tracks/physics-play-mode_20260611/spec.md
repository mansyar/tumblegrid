# Specification: TRACK-006 — Physics Engine & Play Mode

## Overview

Implement the real-time physics simulation layer that powers Play Mode. When the player presses "Play", the marble spawns at the launchpad position and rolls along placed pieces under gravity. The physics engine (Rapier via `@react-three/rapier`) runs at a fixed timestep for deterministic behavior. On "Stop" or fail detection (marble falls below Y < -5), the simulation ends and the player returns to Build Mode with all pieces preserved.

This track is the core gameplay mechanic — without it, Build Mode has no payoff.

## Functional Requirements

### FR1: Physics World & Fixed Timestep
- A Rapier `<Physics>` wrapper with gravity `[0, -9.81, 0]` and a fixed timestep (e.g., 1/60s) to prevent tunneling.
- Physics runs only during `PLAYING` / `SANDBOX_PLAYING` states. In Build Mode, the physics world is present but inert (no dynamic bodies active).

### FR2: Marble as Dynamic Rigid Body
- A dynamic sphere rigid body with **radius ~0.5** (medium, occupying roughly 1/4 of a 2x2x2 cell).
- Physical properties: `mass = 1`, `restitution ~0.3`, `friction ~0.5`, `linearDamping ~0.1`.
- Spawns at `launchpadPosition` (from level data) when Play is pressed.
- Visual: A neon emissive sphere with a **simple fading ribbon trail** — a thin, semi-transparent THREE.Line that follows the marble's recent positions and fades out over ~1 second (comet-tail style).
- Destroyed on Stop or fail (after delay).

### FR3: Piece Colliders
Each piece type gets a matching collider when entering Play Mode:
- **Straight Ramp:** Tilted cuboid collider matching the ramp geometry (pitch axis).
- **Bumper Pad:** Vertical cuboid with `restitution = 1.0` (elastic bounce). When used as `staticTerrain` (restitution = 0), acts as an immovable wall.
- **Speed Booster:** Sensor cuboid collider. On overlap, applies a directional impulse to the marble along the exit face vector.
- **Half-Pipe Tunnel:** Compound collider — one flat base cuboid + two thin vertical rail cuboids along lateral edges.
- **Goal Bucket:** Sensor trigger volume (invisible interior). On entry, starts a 1.5s dwell timer for victory (deferred to TRACK-007 for the actual win logic, but the sensor detection is implemented here).
- **Launchpad:** A static cuboid (kinematic during Play). The marble drops vertically from above.
- Pieces switch from static (Build Mode) to kinematic colliders (Play Mode) on state transition, and back on Stop.

### FR4: Play Loop Lifecycle
- **Play button pressed** -> Store transitions to `PLAYING` / `SANDBOX_PLAYING`. Physics activates. Kinematic colliders built from all placed pieces. Marble spawned at launchpad.
- **Stop button pressed** (or `Esc` key) -> Marble destroyed (with brief fade). Colliders reverted to static. Store transitions back to `BUILDING` / `SANDBOX_BUILDING`. All pieces preserved.
- **Fail detection** (marble Y < -5) -> 0.5s short delay (to let player see the fall), then auto-Stop triggers the same return sequence.
- On `LEVEL_CLEARED` state, the marble is destroyed but pieces remain visible for the victory moment (handled in TRACK-007).

### FR5: Debug Visualization
A toggle (default: off, activated via `D` key) that renders Rapier collider wireframes for all pieces and the marble. Useful for development and tuning. Disabled in production builds.

### FR6: State Integration
- `usePlayLoop` hook orchestrates the lifecycle: on state change to `PLAYING` -> build colliders, spawn marble. On `STOP` or fail -> cleanup.
- Store actions `setMode('playing')` and `setMode('building')` (already wired by TRACK-005) trigger the lifecycle.
- `SANDBOX_PLAYING` / `SANDBOX_BUILDING` follow the same physics logic but bypass goal bucket checks.

## Non-Functional Requirements

- **Deterministic timing:** Rapier fixed timestep ensures consistent behavior across refresh rates.
- **Performance:** Primitive colliders only (no mesh collisions). Compound colliders for complex shapes.
- **No tunneling:** Fixed timestep + appropriate CCD (continuous collision detection) settings prevent marble phasing through thin pieces.
- **Mobile-safe:** Same physics engine runs on mobile via Rapier WASM. No additional GPU load beyond standard Three.js rendering.

## Acceptance Criteria

1. Marble spawns correctly at `launchpadPosition` on Play.
2. Marble rolls along Straight Ramps under gravity, exiting at the correct face.
3. Speed Booster applies a visible impulse on overlap, launching the marble forward.
4. Bumper Pad reflects the marble (restitution ~1.0), angle of incidence approx. angle of reflection.
5. Half-Pipe side rails prevent lateral fall-off (marble stays between rails).
6. Goal Bucket sensor detects marble entry (timer wiring deferred to TRACK-007).
7. Fail detection (Y < -5) triggers auto-stop after ~0.5s delay.
8. Stop button returns to Build Mode with all pieces preserved.
9. Debug toggle (`D` key) shows/hides collider wireframes.
10. No physics warnings or errors in browser console.
11. Marble trail renders as a fading ribbon behind the marble.

## Out of Scope

- Victory celebration UI, "Next Level" button, level transitions (TRACK-007).
- Audio for physics events (marble roll, impact sounds) (TRACK-008).
- Level-specific physics tuning and balancing (TRACK-009).
- Touch-specific gesture handling (TRACK-010).
