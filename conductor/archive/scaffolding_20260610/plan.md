<protect>
# Implementation Plan: TRACK-001 — Project Scaffolding

## Phase 1: Init & Install

- [x] Task: Initialize pnpm project and create package.json
    - [x] Run `pnpm init` to create base `package.json`
    - [x] Add project metadata (name, version, description, type: "module")
    - [x] Define all scripts: dev, build, lint, typecheck, test
- [x] Task: Install core runtime dependencies
    - [x] Install `react` and `react-dom` (^19.0.0)
    - [x] Install `three` (^0.170.0)
    - [x] Install `@react-three/fiber` (^8.0.0)
    - [x] Install `@react-three/drei` (^9.0.0)
    - [x] Install `@react-three/rapier` (^1.5.0)
    - [x] Install `zustand` (^5.0.0)
- [x] Task: Install development dependencies
    - [x] Install `typescript` (^5.6.0)
    - [x] Install `vite` (^8.0.0) and `@vitejs/plugin-react` (^4.0.0)
    - [x] Install `vitest` (^4.0.0)
    - [x] Install `biome` (^1.9.0)
    - [x] Install `@playwright/test` (^1.48.0)
- [x] Task: Verify lockfile integrity
    - [x] Run `pnpm install --frozen-lockfile` to verify lockfile
    - [x] Confirm `pnpm-lock.yaml` exists and is consistent
- [x] Task: Conductor - User Manual Verification 'Phase 1: Init & Install' (Protocol in workflow.md) [checkpoint: 1258235]

## Phase 2: Tooling Configuration

- [x] Task: Configure TypeScript
    - [x] Create `tsconfig.json` with strict mode, ESNext target, JSX react-jsx
    - [x] Configure path aliases (`@/` → `src/`)
    - [x] Add `vitest/globals` types for test files
- [x] Task: Configure Vite [7b625e8]
    - [x] Create `vite.config.ts` with React plugin
    - [x] Add path alias resolution matching tsconfig
    - [x] Set dev server port to 5173
- [x] Task: Configure Biome [e332b3b]
    - [x] Create `biome.json` with TypeScript + React settings
    - [x] Configure formatter (indent style: space, indent width: 2)
    - [x] Configure linter with recommended rules
    - [x] Configure file includes/excludes
- [x] Task: Configure Vitest [4175b3c]
    - [x] Create `vitest.config.ts` extending Vite config
    - [x] Set up Browser Mode with Playwright provider
    - [x] Configure globals: true
- [x] Task: Create environment and git configuration [116dd0d]
    - [x] Create `.env.example` with placeholder vars
    - [x] Create/update `.gitignore` (node_modules, dist, .env, coverage)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Tooling Configuration' (Protocol in workflow.md) [checkpoint: f25123e]

## Phase 3: Project Skeleton

- [x] Task: Create `index.html` entry point [a3ff2f2]
    - [x] Create `index.html` with root div and script reference
    - [x] Set document title to "TumbleGrid"
    - [x] Add viewport meta tag for mobile
- [x] Task: Create directory structure [a3ff2f2]
    - [x] Create `src/components/scene/`
    - [x] Create `src/components/pieces/`
    - [x] Create `src/components/physics/`
    - [x] Create `src/components/ui/`
    - [x] Create `src/store/`
    - [x] Create `src/levels/campaign/`
    - [x] Create `src/audio/`
    - [x] Create `src/hooks/`
    - [x] Create `src/utils/`
    - [x] Create `src/constants/`
    - [x] Create `src/styles/`
    - [x] Create `tests/`
    - [x] Create `public/`
- [x] Task: Create stub entry files [a3ff2f2]
    - [x] Create `src/main.tsx` with ReactDOM.createRoot render
    - [x] Create `src/App.tsx` with minimal blank component
    - [x] Create `src/styles/main.css` with basic reset
- [x] Task: Create placeholder test [a3ff2f2]
    - [x] Create `tests/placeholder.test.ts` with a trivial passing test
- [x] Task: Verify all dev commands [a3ff2f2]
    - [x] Run `pnpm run dev` — confirm HMR starts without errors
    - [x] Run `pnpm run build` — confirm production build succeeds
    - [x] Run `pnpm run lint` — confirm zero warnings
    - [x] Run `pnpm run typecheck` — confirm zero errors
    - [x] Run `pnpm run test` — confirm placeholder test passes
- [x] Task: Conductor - User Manual Verification 'Phase 3: Project Skeleton' (Protocol in workflow.md) [checkpoint: a3ff2f2]
</protect>
