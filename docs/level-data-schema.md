# Level Data Schema
## Companion to TDD — TumbleGrid

---

This document defines the formal JSON schema for all campaign levels and the sandbox preset. Level files reside at `src/levels/campaign/` (indexed by `levelIndex`) and `src/levels/sandbox.json`.

---

### 1. Type Definitions

```typescript
// Allowed piece types in the MVP component library
type PieceType =
  | "straight_ramp"   // Sloped track: descends (rot 0=top→+X, rot 1=top→+Z) or ascends (rot 2=bottom→-X, rot 3=bottom→-Z)
  | "speed_booster"   // Flat track: instant impulse along facing direction
  | "bumper_pad"      // Elastic wall: right-angle bounce (restitution=1.0, tunable). Reused as wall/pillar with restitution=0
  | "half_pipe"       // Straight track with side rails
  | "goal_bucket";    // Finish-line trigger volume (campaign only)

// A single placed piece in the 3D grid
type PiecePlacement = {
  type: PieceType;

  /** Integer grid coordinates [x, y, z] within the level volume.
   *  Each unit = one 2x2x2 cell. Y=0 is the floor plane. */
  position: [x: number, y: number, z: number];

  /** Y-axis rotation index:
   *  0 = 0°    (default orientation)
   *  1 = 90°   (quarter turn CW)
   *  2 = 180°  (half turn)
   *  3 = 270°  (three-quarter turn CW) */
  rotationIndex: 0 | 1 | 2 | 3;
};

// Complete definition for one level
type LevelDefinition = {
  /** Unique level ID for progression tracking and save data.
   *  Format: `campaign_XX` for campaign levels, `sandbox` for the free-play mode. */
  id: string;

  /** Human-readable title shown in the level-start overlay. */
  title: string;

  /** Tutorial or flavour text displayed when the level loads. */
  description: string;

  /** Grid volume boundary. Players cannot place pieces outside this volume. */
  gridBounds: {
    width: number;   // X-axis cell count
    depth: number;   // Z-axis cell count
    height: number;  // Y-axis cell count (max Y is height-1)
  };

  /** Pre-placed static geometry: walls, platforms, existing track segments,
   *  and the goal bucket (for campaign levels). These are not part of the
   *  player's inventory and cannot be removed. */
  staticTerrain: PiecePlacement[];

  /** Player's starting inventory: maps each PieceType to the quantity
   *  the player may place. Zero-count entries can be omitted. */
  inventory: Partial<Record<PieceType, number>>;

  /** Grid position of the launchpad — the marble spawns here when
   *  Play Mode activates. */
  launchpadPosition: [x: number, y: number, z: number];

  /** Grid position of the goal bucket. Required for campaign levels.
   *  Omitted entirely for sandbox mode. */
  goalPosition?: [x: number, y: number, z: number];
};
```

---

### 2. Validation Rules

At build time (Vitest) and at runtime on level load, the following invariants are enforced:

| Rule | Description |
|---|---|
| **ID uniqueness** | No two campaign levels share the same `id`. |
| **Bounds compliance** | Every `position` in `staticTerrain` and all piece placements must satisfy `0 ≤ x < gridBounds.width`, `0 ≤ z < gridBounds.depth`, `0 ≤ y < gridBounds.height`. |
| **No overlap** | No two placements (static or player-placed) share the same `[x, y, z]` coordinate. |
| **Inventory validity** | All keys in `inventory` must be valid `PieceType` values. |
| **Launchpad bounds** | `launchpadPosition` must be within `gridBounds`. |
| **Goal presence** | Campaign levels require `goalPosition`. Sandbox level must not have it. |
| **Inventory non-negative** | All inventory counts must be ≥ 0. |
| **Rotation index range** | `rotationIndex` must be 0, 1, 2, or 3. |
| **Launchpad uniqueness** | `launchpadPosition` must not overlap with any `position` in `staticTerrain`. |

---

### 3. Sandbox Preset

The sandbox is defined by a single `sandbox.json` with no `goalPosition` field:

```json
{
  "id": "sandbox",
  "title": "Sandbox",
  "description": "Free-play mode. Build whatever you like — there's no goal to reach.",
  "gridBounds": { "width": 10, "depth": 10, "height": 5 },
  "staticTerrain": [],
  "inventory": {
    "straight_ramp": 5,
    "speed_booster": 3,
    "bumper_pad": 4,
    "half_pipe": 4,
    "goal_bucket": 0
  },
  "launchpadPosition": [5, 4, 5]
}
```

---

### 4. Campaign Level Templates

#### Level 1 — The Descent
```json
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
    "half_pipe": 0
  },
  "launchpadPosition": [1, 2, 1],
  "goalPosition": [4, 0, 1]
}
```

#### Level 2 — The Bank Shot
```json
{
  "id": "campaign_02",
  "title": "The Bank Shot",
  "description": "The goal is around the corner. Use a bumper pad to redirect the marble past the pillar.",
  "gridBounds": { "width": 6, "depth": 6, "height": 3 },
  "staticTerrain": [
    { "type": "straight_ramp", "position": [1, 1, 2], "rotationIndex": 0 },
    { "type": "bumper_pad", "position": [3, 0, 2], "rotationIndex": 0 },
    { "type": "goal_bucket", "position": [4, 0, 3], "rotationIndex": 0 }
  ],
  "inventory": {
    "straight_ramp": 0,
    "speed_booster": 0,
    "bumper_pad": 1,
    "half_pipe": 0
  },
  "launchpadPosition": [1, 2, 2],
  "goalPosition": [4, 0, 3]
}
```
*Note: The static `bumper_pad` acts as a central structural pillar (restitution=0, solid blocker). The marble drops onto the ramp, gains +X momentum, and must be redirected around the pillar using the player's bumper pad. The exact deflection angle will be verified in-engine during physics tuning.*

---

#### Level 3 — Velocity Check
```json
{
  "id": "campaign_03",
  "title": "Velocity Check",
  "description": "A massive chasm blocks the path. Use a Speed Booster to launch your marble across the gap.",
  "gridBounds": { "width": 9, "depth": 4, "height": 4 },
  "staticTerrain": [
    { "type": "goal_bucket", "position": [8, 0, 2], "rotationIndex": 0 }
  ],
  "inventory": {
    "straight_ramp": 1,
    "speed_booster": 1,
    "bumper_pad": 0,
    "half_pipe": 0
  },
  "launchpadPosition": [1, 3, 2],
  "goalPosition": [8, 0, 2]
}
```
*Solution: Place a Straight Ramp at [1, 2, 2] (descending +X) and a Speed Booster at [1, 0, 2] with entry face aligned to receive the marble. The booster launches the marble across 6 empty cells to the goal.*

---

#### Level 4 — The Switchback
```json
{
  "id": "campaign_04",
  "title": "The Switchback",
  "description": "Navigate the cliff face by creating a zigzag path. Alternate ascending and descending ramps.",
  "gridBounds": { "width": 6, "depth": 5, "height": 5 },
  "staticTerrain": [
    { "type": "goal_bucket", "position": [4, 0, 3], "rotationIndex": 0 }
  ],
  "inventory": {
    "straight_ramp": 3,
    "speed_booster": 0,
    "bumper_pad": 0,
    "half_pipe": 2
  },
  "launchpadPosition": [1, 4, 1],
  "goalPosition": [4, 0, 3]
}
```
*Solution: Place 3 Straight Ramps at staggered heights, using rotationIndex 0/1 for descending segments and rotationIndex 2/3 for ascending segments. Connect flat sections with Half-Pipe Tunnels. Requires understanding of the ramp's bidirectional behavior.*

---

#### Level 5 — Efficiency Crisis
```json
{
  "id": "campaign_05",
  "title": "Efficiency Crisis",
  "description": "4 gaps but only 2 ramps. Use momentum and the Speed Booster to stretch your resources.",
  "gridBounds": { "width": 10, "depth": 6, "height": 4 },
  "staticTerrain": [
    { "type": "half_pipe", "position": [3, 0, 2], "rotationIndex": 0 },
    { "type": "half_pipe", "position": [6, 0, 2], "rotationIndex": 0 },
    { "type": "goal_bucket", "position": [9, 0, 2], "rotationIndex": 0 }
  ],
  "inventory": {
    "straight_ramp": 2,
    "speed_booster": 1,
    "bumper_pad": 1,
    "half_pipe": 0
  },
  "launchpadPosition": [1, 3, 2],
  "goalPosition": [9, 0, 2]
}
```
*Solution: Place a Straight Ramp below the launchpad to reach the first static Half-Pipe. Use the Speed Booster to skip a gap. Use the Bumper Pad to redirect around an obstacle. The second Straight Ramp bridges the final descent to the goal. The exact layout requires the player to plan placements carefully — 4 elevation gaps must be overcome with only 2 ramps.*

---

### 5. File Organisation

```
src/levels/
├── campaign/
│   ├── 01-the-descent.json
│   ├── 02-the-bank-shot.json
│   ├── 03-velocity-check.json
│   ├── 04-the-switchback.json
│   └── 05-efficiency-crisis.json
├── sandbox.json
└── index.ts          # Exports all levels as typed arrays
```
