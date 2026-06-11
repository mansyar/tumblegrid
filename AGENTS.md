# TumbleGrid — AGENTS.md

**Isometric 3D marble physics puzzle game.** Web-based (desktop + mobile browser).

---

## Where to find things

| What | Where |
|---|---|
| Game design | `docs/GDD.md` |
| Technical design | `docs/TDD.md` |
| Level data schema + campaign JSON templates | `docs/level-data-schema.md` |
| Development track plan | `docs/ROADMAP.md` |
| Conductor tracks & plans | `conductor/tracks/` |

---

## Search first, always

This project is indexed with **SocratiCode** (semantic + keyword hybrid search). Before reading any file:

1. Use `codebase_search` with natural language queries ("how are ramps rotated", "physics setup", "victory condition")
2. Use `codebase_graph_query` or `codebase_impact` before modifying/deleting to understand blast radius
3. Only read files directly after search narrows to 1–3 candidates

**Do not speculatively open files.** Prefer `codebase_search` over `grep` for conceptual questions. Use `grep` only for exact identifiers, error strings, or regex patterns you already know.

---

## Stack

- **Build:** Vite 8, pnpm (strict lockfile)
- **Frontend:** React 19, TypeScript
- **3D:** Three.js via React Three Fiber + @react-three/drei + @react-three/rapier
- **State:** Zustand (single centralized store — see TDD §3)
- **Quality:** Biome (lint + format), Vitest 4 with Browser Mode (Playwright)

---

## Dev commands

```bash
pnpm install --frozen-lockfile  # strict install
pnpm run dev                     # Vite dev server (localhost:5173)
pnpm run build                   # tsc --noEmit && vite build → dist/
pnpm run lint                    # Biome lint only (./src)
pnpm run format                  # Biome format only (./src)
pnpm run typecheck               # tsc --noEmit
pnpm run test                    # Vitest (unit + schema validation)
pnpm run test:browser            # Vitest Browser Mode via Playwright (physics integration)
```

**`pnpm run build` includes typecheck** — it runs `tsc --noEmit` before `vite build`.

---

## Git hooks (Husky)

- **pre-commit:** `biome check --fix ./src` then `tsc --noEmit` — Biome auto-fixes on commit; type errors block commit.
- **pre-push:** `pnpm vitest run --coverage` — tests with 80% coverage threshold block push.

---

## Biome strictness (will fail CI/hooks)

These rules are `error` level and will block commits:
- `noExplicitAny` — no `any` types
- `noNonNullAssertion` — no `!` postfix assertions
- `useImportType` — must use `import type` for type-only imports
- `noUnusedImports`, `noUnusedVariables` — dead code is an error

**Style:** single quotes, semicolons always, 2-space indent, 80-char line width.

---

## Path aliases

`@/*` → `src/*` (configured in both `tsconfig.json` and `vite.config.ts`). Use `@/` imports, not relative `../` paths.

---

## Testing

- Tests live in `tests/` (not `src/`). Test files: `tests/**/*.test.ts`
- Vitest globals enabled (`describe`, `it`, `expect` available without import, but explicit imports also work)
- Coverage thresholds: 80% branches, functions, lines, statements
- Level data validation rules in `docs/level-data-schema.md` §2 — enforce these in schema tests
- No snapshot or visual regression tests planned for MVP

---

## Conductor methodology

Development follows the Conductor lifecycle: **Context → Spec & Plan → Implement → Review → Archive/Delete.**

- Every feature belongs to a numbered **track** defined in `docs/ROADMAP.md`
- Track IDs: `TRACK-001` through `TRACK-010`
- Each track has a single **Core Dependency** that must be 100% committed before it starts
- Never start implementing a track until its spec and plan are approved

---

---

## Coverage & testability pattern

**Problem:** Three.js / R3F code that runs inside `<Canvas>` cannot be instrumented by V8 coverage in JSDOM. Piece components (meshes, materials, effects applied via `useLayoutEffect` + `group.traverse`) show 0% function/branch coverage even when functionally tested.

**Solution:** Separate pure Three.js logic from R3F rendering wrappers.

| Layer | Location | Coverage | Tests |
|---|---|---|---|
| Pure Three.js logic | `src/utils/` | ✅ Measured | Pure function tests (no Canvas needed) |
| React component wrappers | `src/components/` (most) | ✅ Measured | Standard `renderHook`/render tests |
| R3F-only rendering | `src/components/pieces/` | ❌ Excluded | Still run but excluded from coverage via `vitest.config.ts` |

**The pattern:**

1. Write a **pure function** in `src/utils/` that accepts Three.js objects (Group, Mesh, Material) and returns/modifies them. No React, no Canvas.
2. Write a **thin R3F wrapper component** in `src/components/pieces/` that calls the pure function inside `useLayoutEffect`.
3. Test the pure function directly — it's fully coverable.
4. Exclude the R3F wrapper directory from coverage in `vitest.config.ts`.

**Example from the codebase:**

```typescript
// src/utils/pieceEffects.ts — PURE, fully testable
export function applyPieceEffects(
  group: THREE.Group,
  ghost: boolean,
  selected: boolean,
  originalMap: Map<THREE.Mesh, SavedEmissive>,
): void { /* Three.js-only logic */ }

// src/components/pieces/PieceFactory.tsx — THIN WRAPPER (excluded from coverage)
useLayoutEffect(() => {
  if (!groupRef.current) return;
  applyPieceEffects(groupRef.current, ghost, selected, originalEmissiveRef.current);
}, [ghost, selected]);
```

Other examples:
- `src/components/pieces/StraightRamp.tsx` exports `createRampGeometry()` (pure function)
- `src/components/pieces/Launchpad.tsx` exports `createLaunchpadBaseGeometry()`, `createLaunchpadCenterGeometry()`, `createLaunchpadRingGeometry()` (pure functions)

---

## Key conventions (non-obvious)

- **Grid cell:** 2×2×2 world units. All pieces occupy exactly 1 cell.
- **Rotation:** Y-axis only, 90° increments (`rotationIndex`: 0=0°, 1=90°, 2=180°, 3=270°).
- **Straight Ramp directions:**
  - `rot 0`: descending, exit +X
  - `rot 1`: descending, exit +Z
  - `rot 2`: ascending, exit -X
  - `rot 3`: ascending, exit -Z
- **Bumper Pad** doubles as wall/pillar when `restitution=0` (static terrain).
- **State machine:** `BUILDING ↔ PLAYING → LEVEL_CLEARED`. Sandbox variants: `SANDBOX_BUILDING`, `SANDBOX_PLAYING`.
- **Levels:** JSON files in `src/levels/campaign/` + `src/levels/sandbox.json`. Schema validated at build time and runtime.
