# Initial Concept

TumbleGrid is a minimalist, isometric 3D physics puzzle game built for the web (desktop and mobile browsers). Players guide a rolling marble from a launchpad to a goal bucket by placing ramps, bumper pads, speed boosters, and half-pipe tunnels on a 3D grid. The game features a two-phase BUILDING/PLAYING loop, a 5-level campaign, and a sandbox mode for free-form experimentation.

---

# Product Guide

## 1. Product Vision

**TumbleGrid** is a web-based isometric 3D physics puzzle game that challenges players to guide a rolling marble from a launchpad to a goal bucket. Players work within a strict grid system and limited piece inventory to place ramps, deflectors, and speed boosters — bridging gaps and navigating obstacles through spatial reasoning and mechanical problem-solving.

The game targets desktop and mobile browser players who enjoy physics-based puzzle games and minimalist construction challenges.

## 2. Target Audience

- **Primary:** Casual puzzle gamers who enjoy spatial reasoning challenges (e.g., fans of *Bad Piggies*, *World of Goo*)
- **Secondary:** Sandbox/creative players who enjoy free-form experimentation and physics simulation
- **Platform:** Web browsers (desktop + mobile) — no install required

## 3. Core Game Modes

### Campaign Mode
A curated 5-level progressive difficulty campaign:
| Level | Mechanic Introduced | Grid Size |
|---|---|---|
| **1 — The Descent** | Basic ramp placement | 6×4×3 |
| **2 — The Bank Shot** | Bumper pad deflection | 6×6×3 |
| **3 — Velocity Check** | Speed booster launch | 9×4×4 |
| **4 — The Switchback** | Ascending/descending zigzag | 6×5×5 |
| **5 — Efficiency Crisis** | Resource management | 10×6×4 |

### Sandbox Mode
Unlocked from start. Flat 10×10×5 grid with no goal, a generous 16-piece inventory, and free experimentation.

## 4. Core Gameplay Loop

0. **Menu & Level Select:** Game starts at Main Menu (Campaign/Sandbox). Campaign players pick a level from the Level Select screen. Level intro overlay shows title + description.
1. **Build Mode (Static):** Pieces are placed/rotated on a 3D grid. No physics. No time pressure. Inventory is limited per level.
2. **Play Mode (Dynamic):** Physics activates. Marble drops from launchpad and rolls along the path. Simulation runs in real-time.
3. **Tweak/Iteration:** If the marble falls (Y < -5), or the player presses Stop, they return to Build Mode with all placements preserved.
4. **Victory:** Marble dwelling in the goal bucket for 1.5s triggers the victory overlay with Next Level, Retry, and Back to Menu options.

## 5. MVP Component Library

All pieces occupy exactly **1 grid cell** (2×2×2 world units):

| Piece | Function |
|---|---|
| **Launchpad** | Marble spawn point. Fixed, unmovable. Drops marble vertically. |
| **Straight Ramp** | Diagonal slope. Descending (entry top → exit side) or ascending (entry bottom → exit side). |
| **Speed Booster** | Flat track. Applies impulse to marble along exit direction. |
| **Bumper Pad** | Elastic wall. Restitution=1.0. Can act as static pillar (restitution=0). |
| **Half-Pipe Tunnel** | Flat track with side rails. Prevents lateral roll-off. |
| **Goal Bucket** | Trigger volume. Marble must dwell 1.5s for victory. Campaign only. |

## 6. Key Design Principles

- **Simplicity:** Minimum code. No speculative features. No abstractions for single-use code.
- **Visual Minimalism:** Clean, high-contrast, low-poly aesthetics. Soft pastel grid, dark background, neon emissive marble.
- **Responsive Design:** Full desktop + mobile touch support. Camera auto-frames to level bounds.
- **Accessibility:** Cross-platform input (mouse + touch). Clear visual feedback.
- **Zero External Assets:** All audio generated programmatically via Web Audio API. No audio files. All 3D meshes built from Three.js primitives.
- **Deterministic Physics:** Rapier's fixed timestep ensures consistent behavior across refresh rates.

## 7. Constraints

| Constraint | Value |
|---|---|
| Grid cell size | 2×2×2 world units |
| Grid volume max | 10×10×5 cells |
| Rotation | Y-axis only, 90° increments |
| State machine | BUILDING ↔ PLAYING → LEVEL_CLEARED (plus sandbox variants) |
| Level data | JSON files validated at build and runtime |
| Camera | OrbitControls, pitch [10°, 80°], zoom [5, 50] |
| Audio | Web Audio API only — no files |
| Physics | Rapier fixed timestep, primitive colliders only |

## 8. Success Criteria (MVP)

- [ ] 5 campaign levels are solvable with provided inventory
- [ ] Sandbox mode allows free-form building
- [ ] Touch controls work on mobile browsers
- [ ] All pieces render as distinct 3D meshes
- [ ] Physics simulation runs without tunneling or jitter
- [ ] Audio feedback exists for key game events
- [x] Campaign progression persists via localStorage
