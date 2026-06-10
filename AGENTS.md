# TumbleGrid — AGENTS.md

**Isometric 3D marble physics puzzle game.** Web-based (desktop + mobile browser).

**Current state:** Pre-scaffolding. No source code exists. All planning lives in `docs/`.

---

## Where to find things

| What | Where |
|---|---|
| Game design | `docs/GDD.md` |
| Technical design | `docs/TDD.md` |
| Level data schema + campaign JSON templates | `docs/level-data-schema.md` |
| Development track plan | `docs/ROADMAP.md` |

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

No `.ts`/`.tsx` files exist yet. TRACK-001 (Scaffolding) must complete first.

---

## Conductor methodology

Development follows the Conductor lifecycle: **Context → Spec & Plan → Implement → Review → Archive/Delete.**

- Every feature belongs to a numbered **track** defined in `docs/ROADMAP.md`
- Track IDs: `TRACK-001` through `TRACK-010`
- Each track has a single **Core Dependency** that must be 100% committed before it starts
- Never start implementing a track until its spec and plan are approved

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

---

## Testing

- `pnpm run test` — unit + schema validation tests
- `pnpm run test:browser` — Vitest Browser Mode via Playwright (physics integration tests)
- Level data validation rules in `docs/level-data-schema.md` §2 — enforce these in schema tests
- No snapshot or visual regression tests planned for MVP

---

## Dev commands (populated by TRACK-001)

```bash
pnpm install --frozen-lockfile  # strict install
pnpm run dev                     # Vite dev server (localhost:5173)
pnpm run build                   # production build → dist/
pnpm run lint                    # Biome lint + format check
pnpm run typecheck               # tsc --noEmit
pnpm run test                    # Vitest
```
