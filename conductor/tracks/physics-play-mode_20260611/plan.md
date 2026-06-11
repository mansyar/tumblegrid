<protect>
# Implementation Plan: TRACK-006 — Physics Engine & Play Mode

## Phase 1: Physics World & Marble

- [x] Task: Physics World setup [df64f7d]
    - [x] Create `src/components/physics/PhysicsWorld.tsx` — Rapier `<Physics>` wrapper with gravity `[0, -9.81, 0]` and fixed timestep (1/60s)
    - [x] Write test: verify physics world instantiates without errors
    - [x] Write test: verify gravity vector is correctly applied
    - [x] Wire `PhysicsWorld` into `GameCanvas.tsx` — only active during `PLAYING` / `SANDBOX_PLAYING` states
- [x] Task: Marble dynamic rigid body [75c57bd]
    - [x] Create `src/components/physics/Marble.tsx` — dynamic sphere rigid body (radius ~0.5)
    - [x] Set physics properties: mass=1, restitution~0.3, friction~0.5, linearDamping~0.1
    - [x] Implement spawn logic: read `launchpadPosition` from store on Play
    - [x] Write test: verify marble spawns at correct launchpad position
    - [x] Write test: verify marble properties match expected values
- [x] Task: Marble visual & trail [6553427]
    - [x] Add neon emissive sphere visual mesh (child of the rigid body)
    - [x] Implement simple fading ribbon trail: array of recent positions -> THREE.BufferGeometry Line with opacity fade over ~1s
    - [x] Write test: verify trail points are recorded as marble moves (pure function test)
- [~] Task: Conductor - User Manual Verification 'Phase 1: Physics World & Marble' (Protocol in workflow.md)

## Phase 2: Piece Colliders

- [ ] Task: Straight Ramp collider
    - [ ] Create `src/components/physics/PieceCollider.tsx` — factory that dispatches by piece type
    - [ ] Implement straight ramp tilted cuboid collider (pitch aligned with rotation index)
    - [ ] Write test: verify collider orientation matches rotation index
- [ ] Task: Bumper Pad collider
    - [ ] Implement vertical cuboid collider with `restitution = 1.0`
    - [ ] Support `staticTerrain` variant with `restitution = 0` (immovable wall)
    - [ ] Write test: verify restitution values
- [ ] Task: Speed Booster sensor collider
    - [ ] Implement sensor cuboid collider
    - [ ] On overlap detection: compute exit direction vector from rotation index
    - [ ] Apply linear impulse to marble's center of mass
    - [ ] Write test: verify impulse direction matches rotation index
    - [ ] Write test: verify sensor detects overlap correctly
- [ ] Task: Half-Pipe Tunnel compound collider
    - [ ] Implement compound collider: flat base cuboid + two thin vertical rail cuboids
    - [ ] Write test: verify compound collider has 3 child colliders
- [ ] Task: Goal Bucket sensor collider
    - [ ] Implement invisible interior sensor trigger volume
    - [ ] On marble entry, track overlap state for TRACK-007 dwell timer
    - [ ] Write test: verify sensor detects marble entry
- [ ] Task: Launchpad collider
    - [ ] Implement static cuboid collider (kinematic during Play)
    - [ ] Marble drops from position above launchpad
- [ ] Task: Collider lifecycle (static <-> kinematic)
    - [ ] On Play: convert all placed pieces from static to kinematic colliders
    - [ ] On Stop: revert all kinematic colliders to static, preserving positions and rotations
    - [ ] Write test: verify collider state transition
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Piece Colliders' (Protocol in workflow.md)

## Phase 3: Play Loop Lifecycle & Debug

- [ ] Task: `usePlayLoop` lifecycle hook
    - [ ] Create `src/hooks/usePlayLoop.ts`
    - [ ] Subscribe to store state: on `PLAYING`/`SANDBOX_PLAYING` -> build colliders, spawn marble
    - [ ] On Stop -> destroy marble (brief fade), revert colliders, transition to `BUILDING`/`SANDBOX_BUILDING`
    - [ ] Write test: verify lifecycle transitions (Play -> cleanup on Stop)
    - [ ] Write test: verify pieces preserved after Stop
- [ ] Task: Fail detection (`useFailDetector`)
    - [ ] Create `src/hooks/useFailDetector.ts`
    - [ ] Monitor marble Y position each physics tick
    - [ ] If Y < -5 -> trigger 0.5s delay -> auto-Stop
    - [ ] Write test: verify fail detection triggers at Y < -5
    - [ ] Write test: verify the 0.5s delay exists before auto-stop
- [ ] Task: Debug visualization toggle
    - [ ] Implement `D` key listener: toggle collider wireframe visibility
    - [ ] Render Rapier collider wireframes for all pieces + marble when debug is on
    - [ ] Disable in production build (`import.meta.env.PROD`)
    - [ ] Write test: verify debug toggle key listener fires
- [ ] Task: GameCanvas integration
    - [ ] Wire `usePlayLoop` into `GameCanvas.tsx`
    - [ ] Ensure Collider components mount/unmount with Play/Stop transitions
    - [ ] Wire Stop button (from TRACK-005) to actually trigger physics cleanup
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Play Loop Lifecycle & Debug' (Protocol in workflow.md)
</protect>
