# GAME DESIGN DOCUMENT (GDD)
## Project Name: TumbleGrid

---

### 1. Executive Summary
TumbleGrid is a minimalist, isometric 3D physics puzzle game built for the web (desktop and mobile browsers). Players are tasked with guiding a rolling marble from a fixed starting point to a designated goal bucket. However, the path is fragmented. Players must work within a grid system and a strict piece inventory to place ramps, deflectors, and speed boosters to bridge the gaps. The game challenges spatial awareness and mechanical problem-solving through a distinct two-phase gameplay loop. In addition to the campaign, a sandbox mode offers free-form experimentation with a generous piece pool and no goal to chase.

---

### 2. Core Gameplay Loop
The game toggles between two strictly isolated operational modes:
1. **Build Mode (Static):** The universe is frozen. Time does not progress, and gravity is disabled for the player's tools. The player reviews the puzzle landscape, selects structural components from their limited inventory, and places/rotates them onto a 3D tactical grid.
2. **Play Mode (Dynamic):** The grid disappears, gravity activates, and the marble spawns at the launchpad. The simulation plays out in real-time. If the marble misses or falls into the void, the player stops the simulation, returning instantly to Build Mode with their placements preserved to tweak the design.

+-----------------------------------+
    |            MAIN MENU              |
    | (Campaign / Sandbox buttons)     |
    +-----------------------------------+
                      |
          +-----------+------------+
          |                        |
          v                        v
   +-------------+          +------------+
   | LEVEL SELECT|          |  SANDBOX   |
   | (5 levels,  |          | (no goal)  |
   |  locked/un  |          +------------+
   |  locked)    |               |
   +------+------+               |
          |                      |
          v                      v
    +-----------------------------------+
    |         LEVEL INTRO OVERLAY       |
    |  (title + description, 3s auto-   |
    |   dismiss or click to dismiss)    |
    +-----------------------------------+
                      |
                      v
    +-----------------------------------+
    |            BUILD MODE             | <---------+
    | (Place/Rotate Ramps on Grid,      |           |
    |  Review limited inventory)        |           |
    +-----------------------------------+           | Tweak /
                      |                             | Fail State
                      | Press "Play"                |
                      v                             |
    +-----------------------------------+           |
    |            PLAY MODE              | ----------+
    | (Physics active, Marble drops,    |
    |  Simulation runs)                 |
    +-----------------------------------+
                      |
                      | Success (Goal Reached, 1.5s bucket dwell)
                      v
    +-----------------------------------+
    |       VICTORY OVERLAY             |
    |  "Level Complete!"                |
    |  [Next Level] [Retry] [Back]      |
    +-----------------------------------+



   ---
   
   ### 3. Mechanics & Constraints
   
   #### The Grid & Connection System (Anchor & Cell)
   * All interactions in Build Mode snap to a uniform, volumetric 3D grid coordinate system ($2 \times 2 \times 2$ units per cell). 
   * Structural alignment is governed by a strict "Anchor & Cell" standard. Every path-based piece features entry and exit vectors centered precisely at the midpoints of the cell's outer faces. This ensures that adjacent pieces lock seamlessly without a physical lip to disrupt the marble's momentum.
   * Objects cannot overlap or share a coordinate address.
   
   #### Rotation Constraints (The 90-Degree Rule)
   * To preserve clean grid alignment and eliminate complex diagonal tracking math, piece rotation is strictly restricted to **90-degree increments** around the vertical Y-axis. 
   * Turning a piece redirects its exit path perfectly across a flat neighboring cell face, naturally lining up with straight tracks.
   
    #### Vertical Tiering
    * Puzzles utilize true 3D spatial routing (`[X, Y, Z]`), allowing tracks to stack vertically into tiers. 
    * Vertical transition is accomplished exclusively by specialized angled components designed to act as architectural kinetic bridges between layers.
    
    #### Grid Volume Boundary
    * Each level occupies a bounded volume of **10×10×5 cells** (`[X, Z, Y]`). Pieces cannot be placed outside this boundary. The lower Y bound is the floor plane at Y=0; pieces cannot clip through it. On mobile, the viewport auto-adjusts the camera to frame the full volume.

    #### Inventory Limitation
    * Levels do not grant infinite resources. A level provides a strict, predetermined inventory of pieces (e.g., *1 Straight Ramp, 2 Bumper Pads*). Success requires managing these exact resources.
    
    #### Free Removal & Undo
    * Any placed piece can be freely removed in Build Mode by clicking/tapping it. Removed pieces return to the inventory pool. There is no penalty for removal — the constraint is the inventory count, not placement permanence.
    
    #### Piece Footprint (Uniform Cell)
    * Every piece occupies exactly **1 grid cell** (`1 × 1 × 1` in grid units). No piece spans multiple cells.
    * Entry and exit vectors are positioned at the **midpoints of cell faces**. Adjacent pieces whose faces touch have perfectly aligned entry/exit points.
    * Because all footprints are uniform, the grid math (placement, overlap detection, stacking) is identical for every piece type. Rotation happens around the cell center.
    
    #### Placement Freedom (No Adjacency Requirement)
    * Pieces may be placed at **any empty cell** within the grid volume bounds. They do not need to be adjacent to the launchpad or any existing piece.
    * The constraint is **inventory count**, not physical connectivity. Placing an orphan piece wastes a limited resource — the player self-penalises.
    * To aid spatial reasoning during placement, a faint **dotted trajectory preview** is shown, estimating the marble's path from the nearest connected structure through the hovered piece.
    
    #### Post-Placement Rotation
    * A placed piece can be **selected by clicking/tapping** it, which highlights it.
    * While selected, pressing **R** (desktop) or the **Rotate button** (mobile) spins it 90° around the Y-axis in-place.
    * Clicking/tapping the selected piece a second time **removes** it (same as the removal mechanic).
    * Clicking empty space **deselects** the piece.
   
   ---
   
### 4. MVP Component Library

All pieces occupy exactly **1 grid cell**. Each piece defines an **entry face** (where the marble arrives) and an **exit face** (where the marble departs). Rotation changes which faces are entry/exit.

| Piece | Occupies | Entry Face | Exit Face | Behaviour |
|---|---|---|---|---|
| **Launchpad** | 1 cell (fixed, unmovable) | None (origin) | Bottom face | Glowing ring marker on the floor. Marble spawns above this position and drops straight down (no horizontal impulse). Cannot be removed. |
| **Straight Ramp** | 1 cell | Top face (descending) or Bottom face (ascending) | Side face in exit direction | Diagonal slope filling the cell. **Descending (rot 0,1):** marble enters top, converts vertical drop into horizontal momentum, exits at side face (rot0=+X, rot1=+Z). **Ascending (rot 2,3):** marble enters bottom, climbs slope, exits at side face (rot2=-X, rot3=-Z). |
| **Speed Booster** | 1 cell | Any side face | Opposite side face | Flat track. Detects marble overlap via sensor collider and applies an instantaneous impulse along the exit direction. No gravity conversion — pure launch. |
| **Bumper Pad** | 1 cell | Any side face | Same face (reflect) | Vertical wall. Restitution = 1.0 (tunable during playtesting). Marble bounces back at a right-angle reflection. Entry = exit face (incoming direction determines outgoing). Can be placed as static terrain with restitution = 0 to act as an immovable wall/pillar. |
| **Half-Pipe Tunnel** | 1 cell | Any side face | Opposite side face | Flat track with two thin side rails. Prevents the marble from rolling off edges. Pass-through — no impulse, just guidance. |
| **Goal Bucket** | 1 cell | Top face | None (sink) | Trigger volume. When the marble enters and stays for 1.5s, the level is cleared. Campaign only — not present in sandbox. |
   
   ---
   
### 5. Controls & Interaction

#### Desktop Controls
* **Mouse Left Click (empty cell):** Places the selected inventory piece at that cell.
* **Mouse Left Click (placed piece):** Selects the piece (highlighted). Click again to remove it.
* **"R" Key:** Rotates the active hover piece (pre-placement) OR the selected placed piece (post-placement) by 90° around the Y-axis.
* **"Stop" Button / Escape Key:** During Play Mode, stops the active simulation and returns to Build Mode. All placed pieces are preserved.
* **Mouse Right Click + Drag:** Orbits the camera freely around the board.
* **Mouse Scroll Wheel:** Zooms the camera in and out.
* **Click empty space:** Deselects any selected piece.

#### Mobile / Touch Controls
* **Single Tap (empty cell):** Places the selected inventory piece at that cell.
* **Single Tap (placed piece):** Selects the piece (highlighted). Tap again to remove it.
* **"Rotate" UI Button:** Rotates the hover piece or selected placed piece by 90°.
* **Two-Finger Twist Gesture:** Alternative rotation gesture for the selected piece.
* **"Stop" UI Button:** Always visible during Play Mode. Tapping stops the simulation and returns to Build Mode. All placed pieces are preserved.
* **Pinch (two fingers):** Zooms camera in/out.
* **Single Finger Drag (empty grid area):** Orbits the camera.
* **Tap empty space:** Deselects any selected piece.
* **All interactions snap to the 3D grid** — no precision drag-to-place on mobile.
   
   ---
   
### 6. Win & Lose Conditions
* **Victory (Win):** The marble enters the physical volume of the Goal Bucket and remains fully contained within its boundaries for an uninterrupted duration of 1.5 seconds. On victory, a "Level Complete!" overlay appears with a "Next Level" button and a "Back to Menu" option. (Campaign levels only.)
* **Defeat (Lose):** The marble plummets past the lowest boundary tier plane of the game map (Y < -5), triggering an automatic simulation pause and prompting a return to Build Mode.
* **Sandbox Mode (Free-Play):** No win or lose condition exists. The marble runs indefinitely or until stopped manually. No Goal Bucket is present. The player presses "Stop" at any time to return to Build Mode and continue iterating.
   
   ---
   
   ### 7. Aesthetics & Visual Direction
   * **Style:** Clean, high-contrast, low-poly minimalism.
   * **Palette:** Soft pastel monochromatic grid surfaces, dark matte background environments for depth contrast, and a bright neon emissive material for the marble.
    * **Feedback:** Smooth real-time directional shadows cast underneath components to instantly anchor their height visually, coupled with a light trail following the marble's path.
    * **Camera:** Freely orbitable via OrbitControls. Default angle is 45° pitch / 45° yaw relative to grid center. On level load, camera auto-frames the full `gridBounds` volume. Pitch is clamped to 10°–80° to prevent floor-clipping.
    * **Audio:** Basic spatial audio implemented via Web Audio API — marble rolling sound (pitch follows velocity), UI click sounds for Build Mode interactions, a victory chime on level completion, and a fail tone when the marble falls below Y < -5. All sounds are generated programmatically (no audio files required for MVP).
    
    ---
    
    ### 8. Game Modes

#### Sandbox Mode (Free-Play)
* **Status:** Unlocked from the start on the main menu.
* **Description:** A flat, open grid volume (10×10×5) with no Goal Bucket and no win condition. The player is given a generous pool of ~15–20 pieces covering all component types. The purpose is experimentation, learning piece behaviors, and creative building without pressure.
* **Marble Drop:** The launchpad is positioned in the center. The player can hit "Play" to watch their creation run, and "Stop" to return to Build Mode with all pieces preserved.
* **Inventory:** 16 pieces with a balanced mix (5 Straight Ramps, 4 Bumper Pads, 3 Speed Boosters, 4 Half-Pipe Tunnels).

#### Campaign Mode
A curated 5-level campaign that introduces mechanics progressively. Campaign progression (completed levels) persists via `localStorage`. Completing level N unlocks level N+1. Level 1 is always unlocked. The "Next Level" button is disabled on the final level (level 5).

* **Level 1 — The Descent (Tutorial):** A straight vertical gap. Teaches basic item selection and placing a Straight Ramp to bridge an elevation change. Small grid (6×4×3).
* **Level 2 — The Bank Shot:** The goal is offset at a 90-degree turn. Teaches the player to use a Bumper Pad to redirect velocity around a central structural pillar.
* **Level 3 — Velocity Check:** A massive horizontal chasm spans 6 empty cells. The player places a Straight Ramp below the launchpad to convert the drop into horizontal momentum, then a Speed Booster at the base to launch the marble across the gap. A static bumper pillar on the far wall catches the marble and drops it into the sunken goal bucket. Grid: 9×4×4.
* **Level 4 — The Switchback:** A steep vertical cliffside with minimal horizontal clearance. The player creates a zigzag pattern using alternating ascending and descending Straight Ramps at staggered heights, connected by Half-Pipe Tunnels on flat sections. Grid: 6×5×5.
* **Level 5 — Efficiency Crisis:** 4 gaps but only 2 ramps provided. The player must use momentum from Speed Booster launches and Bumper Pad deflections, combined with static Half-Pipe segments, to traverse the course with minimal resources. Grid: 10×6×4.
