# Implementation Plan: TRACK-001 — Project Scaffolding

## Phase 1: Init & Install

- [ ] Task: Initialize pnpm project and create package.json
    - [ ] Run `pnpm init` to create base `package.json`
    - [ ] Add project metadata (name, version, description, type: "module")
    - [ ] Define all scripts: dev, build, lint, typecheck, test
- [ ] Task: Install core runtime dependencies
    - [ ] Install `react` and `react-dom` (^19.0.0)
    - [ ] Install `three` (^0.170.0)
    - [ ] Install `@react-three/fiber` (^8.0.0)
    - [ ] Install `@react-three/drei` (^9.0.0)
    - [ ] Install `@react-three/rapier` (^1.5.0)
    - [ ] Install `zustand` (^5.0.0)
- [ ] Task: Install development dependencies
    - [ ] Install `typescript` (^5.6.0)
    - [ ] Install `vite` (^8.0.0) and `@vitejs/plugin-react` (^4.0.0)
    - [ ] Install `vitest` (^4.0.0)
    - [ ] Install `biome` (^1.9.0)
    - [ ] Install `@playwright/test` (^1.48.0)
- [ ] Task: Verify lockfile integrity
    - [ ] Run `pnpm install --frozen-lockfile` to verify lockfile
    - [ ] Confirm `pnpm-lock.yaml` exists and is consistent
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Init & Install' (Protocol in workflow.md)

## Phase 2: Tooling Configuration

- [ ] Task: Configure TypeScript
    - [ ] Create `tsconfig.json` with strict mode, ESNext target, JSX react-jsx
    - [ ] Configure path aliases (`@/` → `src/`)
    - [ ] Add `vitest/globals` types for test files
- [ ] Task: Configure Vite
    - [ ] Create `vite.config.ts` with React plugin
    - [ ] Add path alias resolution matching tsconfig
    - [ ] Set dev server port to 5173
- [ ] Task: Configure Biome
    - [ ] Create `biome.json` with TypeScript + React settings
    - [ ] Configure formatter (indent style: space, indent width: 2)
    - [ ] Configure linter with recommended rules
    - [ ] Configure file includes/excludes
- [ ] Task: Configure Vitest
    - [ ] Create `vitest.config.ts` extending Vite config
    - [ ] Set up Browser Mode with Playwright provider
    - [ ] Configure globals: true
- [ ] Task: Create environment and git configuration
    - [ ] Create `.env.example` with placeholder vars
    - [ ] Create/update `.gitignore` (node_modules, dist, .env, coverage)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Tooling Configuration' (Protocol in workflow.md)

## Phase 3: Project Skeleton

- [ ] Task: Create `index.html` entry point
    - [ ] Create `index.html` with root div and script reference
    - [ ] Set document title to "TumbleGrid"
    - [ ] Add viewport meta tag for mobile
- [ ] Task: Create directory structure
    - [ ] Create `src/components/scene/`
    - [ ] Create `src/components/pieces/`
    - [ ] Create `src/components/physics/`
    - [ ] Create `src/components/ui/`
    - [ ] Create `src/store/`
    - [ ] Create `src/levels/campaign/`
    - [ ] Create `src/audio/`
    - [ ] Create `src/hooks/`
    - [ ] Create `src/utils/`
    - [ ] Create `src/constants/`
    - [ ] Create `src/styles/`
    - [ ] Create `tests/`
    - [ ] Create `public/`
- [ ] Task: Create stub entry files
    - [ ] Create `src/main.tsx` with ReactDOM.createRoot render
    - [ ] Create `src/App.tsx` with minimal blank component
    - [ ] Create `src/styles/main.css` with basic reset
- [ ] Task: Create placeholder test
    - [ ] Create `tests/placeholder.test.ts` with a trivial passing test
- [ ] Task: Verify all dev commands
    - [ ] Run `pnpm run dev` — confirm HMR starts without errors
    - [ ] Run `pnpm run build` — confirm production build succeeds
    - [ ] Run `pnpm run lint` — confirm zero warnings
    - [ ] Run `pnpm run typecheck` — confirm zero errors
    - [ ] Run `pnpm run test` — confirm placeholder test passes
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Project Skeleton' (Protocol in workflow.md)
