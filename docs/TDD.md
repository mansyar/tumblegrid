# TECHNICAL DESIGN DOCUMENT (TDD)
## Project Name: TumbleGrid

---

### 1. Engineering Environment & Developer Tool Stack
* **Build Engine & Dev Server:** Vite 8 
    * *Role:* Acts as the unified end-to-end toolchain. Leverages its Rust-based bundler architecture to merge development and production environments. This ensures fast production builds and instantaneous Hot Module Replacement (HMR), allowing sub-millisecond feedback loops when adjusting physics parameters.
* **Testing Infrastructure:** Vitest 4
    * *Role:* Serves as the native execution engine for unit, functional, and browser-level tests. Reuses Vite 8's exact transformation pipeline for absolute architectural consistency. Utilizes its Browser Mode via Playwright to simulate authentic physics behaviors, tracking component regressions and executing automated visual-snapshot capture assertions.
* **Dependency Orchestration:** PNPM
    * *Role:* Facilitates strict, non-hoisted dependency trees and a global content-addressable storage model to eliminate module bloat and prevent ghost dependency bugs.
* **Code Quality & Verification:** Biome
    * *Role:* Handles parsing, linting, and formatting at native speeds to maintain code uniformity across state, UI, and rendering sub-trees.

---

### 2. Runtime Technology Architecture
* **Framework Layer:** React (Declarative component lifecycle UI, state-to-view synchronization).
* **3D Engine Rendering:** Three.js via React Three Fiber (R3F) (Declarative abstraction over WebGL canvas context).
* **Utility Layer:** @react-three/drei (Orbital camera rigging, procedural geometric primitives, hardware-accelerated grid planes).
* **Physics Engine:** @react-three/rapier (WASM-compiled Rust physics backend for real-time, deterministic bounding box calculations).
* **Global State Engine:** Zustand (Sub-atomic reactive store structurally detached from the React DOM tree to protect performance from continuous 60Hz loop mutations).
* **Input Abstraction:** A cross-platform input handler that normalizes mouse, touch, and pointer events into a unified interaction model. On mobile, touch events map to raycasting via pointer X/Y normalized coordinates, and pinch gestures drive the OrbitControls damping target.

---

### 3. State Management Architecture
The application lifecycle relies entirely on a centralized Zustand store. This architecture isolates game state changes from UI rendering, keeping execution optimized at 60Hz+.

#### State Properties:
* **Current Machine State:** Enumerated string field (`BUILDING`, `PLAYING`, `LEVEL_CLEARED`, `SANDBOX_BUILDING`, `SANDBOX_PLAYING`). The `SANDBOX_*` states bypass goal bucket checks and disable win/loss timers.
* **Manual Stop:** A "Stop" UI button (and `Esc` key on desktop) during `PLAYING` and `SANDBOX_PLAYING` states immediately transitions back to `BUILDING` / `SANDBOX_BUILDING`. All Placed Components are preserved — no state is lost.
* **Active Mode:** Enum (`CAMPAIGN`, `SANDBOX`). Determines which state machine transitions apply and whether the goal bucket is rendered.
* **Active Level Index:** Progress tracking variable matching JSON campaign maps. Ignored in sandbox mode.
* **Level Inventory Configuration:** Key-value object mapping specific piece type constants to integer counts remaining.
* **Placed Components Array:** Collection of structural items currently committed to the map. Each item payload contains:
    * `id`: Unique cryptographic string string.
    * `type`: Enum designation matching the MVP library components.
    * `position`: Array representing discrete `[X, Y, Z]` grid integer coordinates.
    * `rotationIndex`: Integer scalar value (`0`, `1`, `2`, `3`) mapped directly to Y-axis rotation multipliers.
* **Active Blueprint Node:** State caching the temporary coordinate array and component type of the hover item during active hover previewing.
* **Selected Piece ID:** Nullable string field. When a placed piece is clicked/tapped, its `id` is stored here and the piece renders with a highlight/outline effect. While selected:
  * Pressing **R** rotates it in-place (rotationIndex cycles 0→1→2→3).
  * Clicking/tapping it again removes it (same as removal mechanic).
  * Clicking/tapping empty space or another piece clears the selection.
* **Trajectory Preview Cache:** Array of estimated `[x, y, z]` waypoints computed from the nearest connected structure through the hovered/selected piece. Updated on hover move and cleared on deselect. Used by the renderer to draw a faint dotted path for spatial guidance.

---

### 4. Scene Hierarchy & Component Structure
The R3F Canvas component maps a clean, distinct layout separating global lighting environments, physical sandboxes, and pure 2D HTML interaction layers.

### 5. High-Level Technical Mechanics
**Grid Math, Raycasting & Stacking**
To calculate piece positioning without clunky slider menus, the application casts an invisible ray from the camera lens through the pointer position down into the 3D scene. The same raycasting system works for both mouse and touch input — the cross-platform input handler normalizes the pointer coordinates to a standard `{ x, y }` range before passing them to the R3F raycaster.

If the ray intersects the base floor plane, the target vector resolves to Y = 0, and the raw X/Z values undergo integer rounding math to match the standard grid size.

To achieve vertical stacking, if the ray intersects the top face of an existing piece collider, the system extracts the item's coordinate data and sets the preview block's target state to Y = existing_Y + 1.

**Trajectory Preview for Placement Guidance**
Since pieces can be placed anywhere in the volume (no adjacency requirement), a visual trajectory preview helps the player assess connectivity at a glance.

On each hover frame, the system:
1. Scans the Placed Components Array for the piece geometrically closest to the hovered cell.
2. Computes a short chain of estimated waypoints: from that piece's exit face → empty cells along the facing direction → the hovered piece's entry face → its exit face.
3. Stores the waypoints in the Trajectory Preview Cache as `[x, y, z]` triplets.
4. The renderer draws a faint dotted polyline (low-opacity, pastel colour) connecting these waypoints through the 3D scene.

When a piece is selected (post-placement), the preview re-computes from the selected piece. The preview is purely cosmetic — it has no gameplay effect and is hidden during Play Mode.

**Rotation Matrix Mapping**
When the engine loops through the Placed Components Array, it takes the rotationIndex integer (0-3) and transforms it into radians (0, PI/2, PI, 3PI/2) along the Y-axis. The component center (cell midpoint) acts as the origin pivot, ensuring that the standardized exit face points directly into the flat entryway face of whatever cell sits adjacent to it.

Rotation applies in two contexts:
1. **Pre-placement:** The Active Blueprint Node carries a tentative rotationIndex. The preview mesh updates in real-time as R is pressed.
2. **Post-placement:** When a Placed Component has its `id` stored in Selected Piece ID, R-press increments its rotationIndex and the mesh re-renders in-place. No physics rebuild is needed until Play Mode.

**Dynamic Physical Body Lifecycle**
Rapier rigid bodies are highly performant but do not allow live positional adjustments during active simulations.

In Build Mode, components exist as fixed static colliders. They do not calculate gravity or physical velocities, acting purely as stationary spatial reference geometry.

In Play Mode, placements switch to a locked kinematic structural state. The marble instance initializes as a dynamic spherical bounding body, letting the physics engine assume total control over its kinetic velocity.

On Reset, the runtime unmounts the dynamic marble completely, flushing its physics engine cache, and reverts the grid placements to editable static objects.

**Piece-Specific Collider Implementations**
Straight Ramps / Bumper Pads: Solved using simple primitive cuboid colliders. Ramps tilt their bounding box along the pitch axis. Bumpers use restitution = 1.0 (tunable during playtesting) for an elastic rebound.

Speed Boosters: Utilizes a custom cuboid collider explicitly configured as a Sensor. This means it detects intersections without blocking physical movement. Upon overlap detection, the app calculates the forward directional vector of the piece and applies an instantaneous linear impulse vector directly to the marble's center of mass.

Half-Pipe Tunnels: Optimized as a performance-efficient Compound Collider. Rather than tracing a heavy, complex curved 3D mesh, it aggregates three primitive bounding boxes: one wide, flat horizontal base box for the floor track, and two thin vertical box rails running along the lateral borders to stop the marble from sliding off track.

Walls & Pillars: Reuse the `bumper_pad` PieceType with restitution = 0. No bounce — pure solid blocker. Defined in `staticTerrain` with a position and rotationIndex. The collider is a simple cuboid occupying the full grid cell volume.

**Goal Trigger Detection**
The Goal Bucket is structurally split into two assets: a visible outer mesh housing solid collision boundaries, and an invisible internal volumetric sensor collider. When the dynamic marble group registers an intersection with this internal sensor, a timer callback checks for structural continuity. If the intersection holds true across successive frames without a premature exit event, the engine shifts into victory state and prepares the next level configuration.

In sandbox mode (`SANDBOX_*` states), no Goal Bucket is instantiated and the goal trigger system is entirely bypassed. The marble is auto-destroyed (with a short trail fade-out) only if it falls below Y < -5, but no failure state is triggered — the simulation simply resets the marble to the launchpad.

**Camera Configuration**
The OrbitControls camera initializes at 45° pitch / 45° yaw relative to the grid center. On level load, `camera.position` and `controls.target` auto-frame the full `gridBounds` volume. Pitch is clamped to [10°, 80°] to prevent the camera from clipping below the floor plane. Zoom distance is bounded between 5 and 50 world units.

---

### 6. Audio (MVP)

A minimal audio layer implemented via the Web Audio API:

* **Marble Rolling:** Procedural noise source, pitch-scaled by marble velocity, spatialised to 3D position.
* **UI Interactions:** Short synthesized clicks for place, remove, and rotate actions in Build Mode.
* **Victory Jingle:** Synthesized rising tone sequence triggered on level completion.
* **Fail Tone:** Short descending tone when marble falls below Y < -5.
* No audio files required — all sounds generated programmatically.

---

### 7. Level Data Schema

All campaign levels and the sandbox preset are defined as JSON objects conforming to the schema below. Level files reside at `src/levels/campaign/` (indexed by `levelIndex`) and `src/levels/sandbox.json`.

```typescript
// --- TypeScript representation of the schema ---

type PieceType = "straight_ramp" | "speed_booster" | "bumper_pad" | "half_pipe" | "goal_bucket";

type PiecePlacement = {
  type: PieceType;
  /** Integer grid coordinates within the level volume */
  position: [x: number, y: number, z: number];
  /** Y-axis rotation: 0=0°, 1=90°, 2=180°, 3=270° */
  rotationIndex: 0 | 1 | 2 | 3;
};

type LevelDefinition = {
  /** Unique level ID for progression tracking */
  id: string;
  /** Human-readable title (e.g. "The Descent") */
  title: string;
  /** Tutorial / hint text shown at level start */
  description: string;
  /** Grid volume — pieces cannot be placed outside these bounds */
  gridBounds: {
    width: number;   // X-axis cell count
    depth: number;   // Z-axis cell count
    height: number;  // Y-axis cell count
  };
  /** Pre-placed static geometry (launchpad, environment walls, etc.) */
  staticTerrain: PiecePlacement[];
  /** Player's starting inventory: piece type → count */
  inventory: Record<PieceType, number>;
  /** The launchpad's grid position (marble spawn point) */
  launchpadPosition: [x: number, y: number, z: number];
  /** Goal bucket position (omitted for sandbox) */
  goalPosition?: [x: number, y: number, z: number];
};

// --- Example: Level 1 (The Descent) ---
{
  "id": "campaign_01",
  "title": "The Descent",
  "description": "Place a ramp to bridge the gap and guide the marble to the goal.",
  "gridBounds": { "width": 6, "depth": 4, "height": 3 },
  "staticTerrain": [
    { "type": "goal_bucket", "position": [4, 0, 1], "rotationIndex": 0 }
  ],
  "inventory": {
    "straight_ramp": 2,
    "speed_booster": 0,
    "bumper_pad": 0,
    "half_pipe": 0,
    "goal_bucket": 0
  },
  "launchpadPosition": [1, 2, 1],
  "goalPosition": [4, 0, 1]
}
```

The schema is validated at build time (Vitest type/schema tests) and at runtime on level load to prevent corrupted level data from causing hard-to-trace physics errors.

### 8. Performance and Optimization Guidelines
Fixed Timesteps: The Rapier physics subsystem must execute at a locked, fixed timestep to guarantee deterministic calculation threads across variable monitor refresh rates. This prevents tunneling (objects phasing through thin walls at high speeds).

Collider Simplification: No mesh-to-mesh geometric collision tracing is permitted. All pieces must resolve spatial impacts through standard primitive box/sphere combinations.
