<protect>
# Specification: TRACK-009 — Campaign Levels & Sandbox

## Overview

This track focuses on tuning and verifying the 5 campaign levels and the sandbox mode. The goal is to ensure each campaign level has a valid, satisfying solution path using only its provided inventory, and that sandbox mode offers a clean free-form experimentation experience. Physics parameters will be tuned for consistent, satisfying feel across all levels.

## Functional Requirements

### FR-1: Campaign Level Verification & Tuning
- Load each of the 5 campaign levels in-engine and verify the intended solution path works end-to-end.
- Place the intended solution pieces, run simulation, confirm marble reaches the goal bucket.
- Tune level JSON data (piece positions, rotations, inventory counts) as needed to fix broken solutions.
- Ensure no unintended shortcuts exist (marble cannot bypass obstacles or reach goal without using required mechanics).
- Each level must teach its designated mechanic (per Product Definition §3).

### FR-2: Static Terrain via Bumper Pads
- Use existing Bumper Pad pieces with `restitution=0` as static walls, pillars, and obstacles.
- No new piece types needed. Bumper Pad already supports static terrain mode.
- Add pre-placed Bumper Pads to campaign level JSONs where walls/pillars are needed.
- Update level JSON schema documentation if pre-placed pieces are a new concept.

### FR-3: Level Intro Tutorial Hints
- Each campaign level's `description` field in the JSON should contain a concise gameplay hint.
- Hints are displayed in the existing LevelIntro overlay (title + description) before the level starts.
- Hints should teach the level's mechanic without giving away the exact solution.
- Example: Level 1 hint — "Place ramps to guide the marble from the launchpad to the goal bucket."

### FR-4: Physics Parameter Tuning
- Extract tunable physics constants to `src/constants/physics.ts`:
  - Marble mass, restitution, friction
  - Speed booster impulse strength
  - Bumper pad restitution (elastic=1.0, static=0)
  - Gravity magnitude
  - Fail detection Y threshold (-5)
  - Goal dwell time (1.5s)
- Write programmatic validation tests (`tests/level-solution.test.ts`) that simulate each level's intended solution and verify the marble reaches the goal.
- Manually play through all levels to tune for "feel" — satisfying bounce distances, appropriate marble weight, smooth rolling.
- Ensure physics feel is consistent across all 5 campaign levels.

### FR-5: Sandbox Mode Verification
- Verify sandbox inventory matches spec: 5 ramps, 4 bumpers, 3 boosters, 4 half-pipes (16 total).
- Sandbox has no goal bucket, no win condition — pure free-form experimentation.
- Test edge cases: placing pieces at max Y, overlapping rejection, empty inventory, removing all pieces.
- Verify sandbox grid is 10×10×5 as per Product Definition.

### FR-6: Inventory Balance
- Verify each campaign level's inventory count is balanced:
  - Enough pieces to reach the goal.
  - Not so many pieces that the puzzle becomes trivial.
  - Each piece type in inventory should be necessary for the intended solution.

## Non-Functional Requirements

- **NFR-1: Performance** — Marble physics simulation must run at 60fps on desktop browsers. No tunneling or jitter.
- **NFR-2: Determinism** — Rapier's fixed timestep ensures consistent behavior across refresh rates.
- **NFR-3: Code Quality** — All changes must pass Biome lint, TypeScript typecheck, and existing test suite.

## Acceptance Criteria

- [ ] All 5 campaign levels are solvable with their provided inventory.
- [ ] Each level's solution uses the mechanic it's designed to teach.
- [ ] No unintended shortcuts exist in any campaign level.
- [ ] Physics constants are extracted to `src/constants/physics.ts`.
- [ ] Programmatic validation tests pass for all 5 campaign levels.
- [ ] Sandbox inventory matches spec (5 ramps, 4 bumpers, 3 boosters, 4 half-pipes).
- [ ] Sandbox has no goal bucket, no win condition.
- [ ] Level intro hints are present for all 5 campaign levels.
- [ ] Physics feel is consistent across all levels (manual verification).
- [ ] All existing tests continue to pass.
- [ ] Code passes static analysis review.

## Out of Scope

- New piece types or changes to core mechanics.
- New UI screens or menu changes.
- Audio changes.
- Mobile-specific tuning (deferred to TRACK-010).
- Progressive difficulty balancing beyond what the ROADMAP specifies.
</protect>
