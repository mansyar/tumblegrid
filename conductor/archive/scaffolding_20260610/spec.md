<protect>
# Specification: TRACK-001 — Project Scaffolding

## Objective
Set up a fully configured Vite 8 + React 19 + TypeScript workspace with all core dependencies, development tooling, and a standardized project directory structure. No game logic is implemented in this track — the goal is a working, CI-ready development environment.

## User Story
As a developer, I want a fully configured Vite 8 + React + R3F + Rapier workspace with linting, formatting, testing, and a CI-ready project structure, so that I can write code without tooling friction.

## Scope Boundary

### Will Do
- Initialize pnpm project with `package.json`
- Install all core dependencies (React, Three.js, R3F, drei, Rapier, Zustand)
- Install all dev dependencies (TypeScript, Vite, Vitest, Biome, Playwright)
- Configure TypeScript (`tsconfig.json`) with strict mode and path aliases
- Configure Vite (`vite.config.ts`) with React plugin and path aliases
- Configure Biome (`biome.json`) for linting and formatting
- Configure Vitest (`vitest.config.ts`) with Browser Mode (Playwright)
- Create `.env.example` with placeholder environment variables
- Create `.gitignore` appropriate for a Node.js/TypeScript project
- Create `index.html` entry point
- Create full project directory skeleton under `src/`
- Create a placeholder `main.tsx` and `App.tsx` that renders a blank page
- Create a passing placeholder Vitest test
- Verify all dev commands work (dev, build, lint, typecheck, test)

### Will NOT Do
- Write any game logic
- Render any 3D scene
- Implement any game feature
- Create any piece components or physics code

## Tech Stack

| Component | Technology |
|---|---|
| Package Manager | pnpm (strict lockfile) |
| Language | TypeScript 5.x |
| Build | Vite 8 |
| UI Framework | React 19 |
| 3D Rendering | Three.js + @react-three/fiber + @react-three/drei + @react-three/rapier |
| State | Zustand |
| Lint/Format | Biome |
| Testing | Vitest 4 with Browser Mode (Playwright) |

## Project Directory Structure

```
src/
├── components/
│   ├── scene/           # R3F scene components
│   ├── pieces/          # 3D piece meshes
│   ├── physics/         # Physics world, marble, colliders
│   └── ui/              # 2D overlay UI
├── store/               # Zustand store
├── levels/
│   └── campaign/        # Campaign JSON level files
├── audio/               # Web Audio API procedural sounds
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── constants/           # Tunable constants
├── styles/              # CSS files
├── main.tsx             # Entry point
└── App.tsx              # Root component
```

## Verification

- `pnpm install --frozen-lockfile` passes without errors
- `pnpm run dev` starts without warnings on `localhost:5173`
- `pnpm run build` outputs to `dist/` without errors
- `pnpm run lint` passes with zero warnings
- `pnpm run typecheck` passes with zero errors
- `pnpm run test` runs and passes a placeholder test
- Browser shows blank white page with "TumbleGrid" title in the tab
</protect>
