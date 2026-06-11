<protect>
# Implementation Plan: TRACK-006 — Physics Engine & Play Mode

## Phase 1: Physics World & Marble [checkpoint: 903e011]

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
- [x] Task: Conductor - User Manual Verification 'Phase 1: Physics World & Marble' (Protocol in workflow.md)

## Phase 2: Piece Colliders

- [x] Task: Straight Ramp collider [f93b614]
    - [x] Create `src/utils/pieceColliders.ts` — pure functions returning ColliderDescriptor[] for all piece types
    - [x] Create `src/components/physics/PieceCollider.tsx` — factory that dispatches by piece type
    - [x] Implement straight ramp tilted cuboid collider (pitch aligned with rotation index)
    - [x] 29 unit tests: collider orientation, restitution values, compound (3 child), sensor types, launchpad geometry
- [x] Task: Bumper Pad collider [f93b614]
    - [x] Implement vertical cuboid collider with `restitution = 1.0`
    - [x] Support `staticTerrain` variant with `restitution = 0` (immovable wall)
    - [x] Write test: verify restitution values
- [x] Task: Speed Booster sensor collider (w/ runtime impulse) [f93b614] + event handlers
    - [x] Collider definition: sensor cuboid with thin profile
    - [x] Write test: verify sensor collider dimensions and properties
    - [x] On overlap detection: compute exit direction vector from rotation index (`getBoostDirection(rotationIndex)`)
    - [x] Apply linear impulse to marble's center of mass via `payload.other.rigidBody.applyImpulse()`
    - [x] Write test: verify impulse direction matches rotation index (9 new tests: direction, impulse, Y=0)
- [x] Task: Half-Pipe Tunnel compound collider [f93b614]
    - [x] Implement compound collider: flat base cuboid + two thin vertical rail cuboids
    - [x] Write test: verify compound collider has 3 child colliders
- [x] Task: Goal Bucket sensor collider (w/ marble entry tracking) [f93b614] + event handlers
    - [x] Collider definition: invisible interior sensor trigger volume
    - [x] Write test: verify sensor collider dimensions
    - [x] On marble entry/exit: track `marbleInBucketIds` Set in game store via `onIntersectionEnter`/`onIntersectionExit`
- [x] Task: Launchpad collider [f93b614]
    - [x] Implement static cuboid collider
    - [x] Marble drops from position above launchpad (handled in Marble.tsx spawn logic)
- [x] Task: Collider lifecycle (static <-> kinematic) — DEFERRED to post-MVP
    - [~] Note: Static colliders work correctly for MVP. Kinematic switching is needed only for pushable/movable pieces (future feature).<br>Current behavior: PieceCollider mounts during PLAYING (static colliders), unmounts during BUILDING. Adequate for MVP.
- [~] Task: Conductor - User Manual Verification 'Phase 2: Piece Colliders' (Protocol in workflow.md)

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
- [x] Task: Debug visualization toggle
    - [x] Implement `D` key listener: toggle collider wireframe visibility
    - [x] Render Rapier collider wireframes via `<Physics debug={debugPhysics}>`
    - [x] Disable in production build (`import.meta.env.PROD`)
    - [x] Write test: verify debug toggle key listener fires
- [~] Task: GameCanvas integration
    - [x] Wire `usePlayLoop` into `GameCanvas.tsx`
    - [x] Ensure Collider components mount/unmount with Play/Stop transitions
    - [x] Wire Stop button (from TRACK-005) to actually trigger physics cleanup
    - [x] Wire `useDebugToggle` into `GameCanvas.tsx`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Play Loop Lifecycle & Debug' (Protocol in workflow.md)
</protect>
