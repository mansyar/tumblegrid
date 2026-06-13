# TumbleGrid

**Isometric 3D marble physics puzzle game** — built for the web (desktop + mobile browser).

Guide a rolling marble from a launchpad to a goal bucket by strategically placing ramps, deflectors, and boosters on a 3D grid. Think spatially, build creatively, and let physics do the rest.

---

## Gameplay

TumbleGrid alternates between two phases:

1. **Build Mode** — The grid is frozen. Select pieces from your inventory and place/rotate them onto a 3×3 isometric grid. A dotted trajectory preview shows how the marble will flow through your structure.

2. **Play Mode** — Hit Play. Gravity activates, the marble drops from the launchpad, and the physics simulation runs in real-time. Watch it roll along ramps, bounce off bumper pads, get launched by speed boosters, and (hopefully) land in the goal bucket.

Miss the mark? Hit Stop to return to Build Mode with all your pieces preserved — iterate until you nail it.

### Piece Library

| Piece | Behaviour |
|---|---|
| **Launchpad** | Fixed spawn point. Marble drops straight down from here. |
| **Straight Ramp** | Converts vertical drop into horizontal momentum (descending) or climbs a slope (ascending). |
| **Speed Booster** | Flat track with a sensor that launches the marble forward with a powerful impulse. |
| **Bumper Pad** | Reflects the marble with a right-angle bounce. Also doubles as a static wall/pillar. |
| **Half-Pipe Tunnel** | Flat track with side rails — prevents the marble from rolling off edges. |
| **Goal Bucket** | Sunken trigger zone. Marble must stay inside for 1.5 seconds to clear the level. |

Each piece occupies exactly **1 grid cell** (2×2×2 world units) and rotates in 90° increments around the Y-axis.

### Controls

| Action | Desktop | Mobile |
|---|---|---|
| Place piece | Left-click empty cell | Tap empty cell |
| Select piece | Left-click placed piece | Tap placed piece |
| Remove piece | Click selected piece again | Tap selected piece again |
| Rotate piece | **R** key | Rotate button / two-finger twist |
| Start simulation | Play button | Play button |
| Stop simulation | Stop button / **Esc** | Stop button |
| Orbit camera | Right-click + drag | Single-finger drag |
| Zoom | Scroll wheel | Pinch |

---

## Game Modes

### Campaign (5 levels)

A curated progression that introduces mechanics one by one:

| # | Level | Mechanic |
|---|---|---|
| 1 | **The Descent** | Place your first ramp. |
| 2 | **The Bank Shot** | Redirect the marble around a corner with a bumper pad. |
| 3 | **Velocity Check** | Use a speed booster to launch across a chasm. |
| 4 | **The Switchback** | Zigzag up a cliffside with alternating ramps and half-pipes. |
| 5 | **Efficiency Crisis** | Four gaps, only two ramps — master momentum management. |

Progress persists in your browser via `localStorage`.

### Sandbox

A 10×10×5 open grid with 16 pieces covering all types. No goal, no win condition — just free-form experimentation. Hit Play to watch your creation run and Stop to tweak it.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Build** | [Vite 8](https://vite.dev/) |
| **Frontend** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **3D Rendering** | [Three.js](https://threejs.org/) via [React Three Fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei) |
| **Physics** | [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) (WASM-compiled Rust physics) |
| **State** | [Zustand](https://github.com/pmndrs/zustand) |
| **Audio** | Web Audio API (procedural synthesis — no audio files) |
| **Lint / Format** | [Biome](https://biomejs.dev/) |
| **Testing** | [Vitest 4](https://vitest.dev/) + [Playwright](https://playwright.dev/) (browser mode) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9

### Install

```bash
pnpm install --frozen-lockfile
```

### Development

```bash
pnpm run dev
```

Opens a Vite dev server at `http://localhost:5173` with Hot Module Replacement.

### Build

```bash
pnpm run build
```

Runs TypeScript type checking, then builds to `dist/`. The output is ready for static hosting or Docker deployment.

### Testing

```bash
pnpm run test        # Unit + schema validation tests
pnpm run test:browser  # Browser-mode tests (requires Playwright browsers)
```

### Code Quality

```bash
pnpm run lint       # Biome lint
pnpm run format     # Biome format
pnpm run typecheck  # tsc --noEmit
```

---

## Project Structure

```
tumblegrid/
├── docs/                    # Design documents (GDD, TDD, ROADMAP, schema)
├── public/                  # Static assets
├── src/
│   ├── audio/               # Procedural sound synthesis engine
│   ├── components/
│   │   ├── physics/         # Marble, colliders, fail detector
│   │   ├── pieces/          # 3D piece meshes (ramp, booster, bumper, etc.)
│   │   ├── scene/           # Canvas, grid floor, trajectory line
│   │   └── ui/              # HUD, menus, inventory, overlays
│   ├── hooks/               # Custom React hooks (interaction, camera, audio, etc.)
│   ├── levels/              # Campaign JSON files + sandbox + validators
│   ├── store/               # Zustand state machine + actions + types
│   ├── styles/              # CSS (main + mobile responsive overrides)
│   ├── utils/               # Pure functions (physics, colliders, input, etc.)
│   ├── App.tsx              # Root component (screen routing)
│   └── main.tsx             # Entry point
├── tests/                   # Vitest test files
├── conductor/               # Conductor methodology tracks
└── AGENTS.md                # Agent instructions for AI-assisted dev
```

---

## Architecture Highlights

- **Pure logic → thin wrapper pattern:** Three.js geometry and physics logic lives in pure functions (`src/utils/`) that are fully unit-testable. R3F components are thin wrappers that call these functions.
- **Single Zustand store:** All game state (machine state, inventory, placed pieces, selections) lives in one centralized store, keeping the 60fps physics loop detached from React re-renders.
- **Deterministic physics:** Rapier runs at a fixed 1/60s timestep. All colliders are primitive shapes (boxes, spheres) — no mesh collision tracing.
- **Procedural audio:** All sounds (marble roll, UI clicks, victory jingle, fail tone) are synthesized at runtime via the Web Audio API — zero audio files.
- **Mobile-first input:** Pointer events are normalized into a unified `{ x, y, button, isTouch }` format. Touch gestures (tap, drag, pinch, two-finger twist) work alongside desktop controls.

---

## Docker

A `Dockerfile` and `docker-compose.yml` are included for containerised deployment:

```bash
docker compose up -d
```

Serves the built app on port 80 via Nginx.

---

## License

MIT
