<protect>
# Implementation Plan: TRACK-009 — Campaign Levels & Sandbox

## Phase 1: Physics Constants Consolidation

- [x] Task: Audit existing physics constants in `src/utils/physics.ts` and identify any missing constants (fail Y threshold, goal dwell time) that should be extracted from component code.
    - [x] Search for hardcoded physics values in `src/components/physics/` and `src/utils/goalDetector.ts`.
    - [x] Document which constants are already extracted vs. still hardcoded.

- [x] Task: Add missing physics constants to `src/utils/physics.ts`:
    - [x] Add `FAIL_Y_THRESHOLD = -5` (currently hardcoded in FailDetector).
    - [x] Add `GOAL_DWELL_TIME = 1.5` (currently hardcoded in goalDetector.ts).
    - [x] Add `BUMPER_RESTITUTION_ELASTIC = 1.0` and `BUMPER_RESTITUTION_STATIC = 0`.
    - [x] Update all consumers to import from `physics.ts` instead of using hardcoded values.

- [x] Task: Write unit tests for new constants.
    - [x] Verify `FAIL_Y_THRESHOLD`, `GOAL_DWELL_TIME`, bumper restitution values are exported correctly.
    - [x] Verify `createPhysicsConfig()` uses the constants.

- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md) [checkpoint: 6fb2cb9]

## Phase 2: Level Data Updates

- [x] Task: Update campaign level JSON files with tutorial hints in `description` field.
    - [x] Level 1: "Place ramps to guide the marble from the launchpad to the goal bucket."
    - [x] Level 2: "The goal is around the corner. Use a bumper pad to redirect the marble past the pillar."
    - [x] Level 3: "A massive chasm blocks the path. Use a Speed Booster to launch your marble across the gap."
    - [x] Level 4: "Navigate the cliff face by creating a zigzag path. Alternate ascending and descending ramps."
    - [x] Level 5: "4 gaps but only 2 ramps. Use momentum and the Speed Booster to stretch your resources."

- [x] Task: Add static terrain (Bumper Pads with restitution=0) to campaign levels where walls/pillars are needed.
    - [x] Review each level's intended solution path and add static Bumper Pads as structural obstacles.
    - [x] Verify no static terrain overlaps with launchpad or goal positions.
    - [x] Verify all static terrain positions are within gridBounds.

- [x] Task: Verify sandbox JSON matches spec (5 ramps, 4 bumpers, 3 boosters, 4 half-pipes).
    - [x] Read `src/levels/sandbox.json` and verify inventory counts.
    - [x] Verify grid is 10×10×5 and no goalPosition is present.

- [x] Task: Write schema validation tests for updated level data.
    - [x] Verify all campaign levels pass existing schema validation.
    - [x] Verify sandbox passes schema validation.
    - [x] Verify no static terrain overlaps with launchpad.

- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md) [checkpoint: ee0bff5]

## Phase 3: Programmatic Level Solution Validation

- [x] Task: Design test approach for level solution validation.
    - [x] Chose structural validation (Option B) — verify solution data integrity without Rapier simulation.
    - [x] Rationale: Fast, zero new dependencies, catches most common errors (wrong positions, missing pieces, out-of-bounds).
    - [x] Future enhancement: Add direct Rapier simulation tests as separate track.

- [x] Task: Create `src/utils/solutionValidator.ts` with pure validation functions.
    - [x] `validateSolution(levelData, solutionPieces)` — validates inventory fit, bounds, overlaps, piece types.
    - [x] `SolutionPiece` type: `{ pieceType: PieceType; position: [number, number, number]; rotationIndex: 0|1|2|3 }`.
    - [x] `ValidationResult`: `{ valid: boolean; errors: string[] }`.
    - [x] Also added `countSolutionPieces()` helper.

- [x] Task: Write structural validation tests in `tests/solution-validation.test.ts`.
    - [x] Level 1: Validate 2 ramps solution fits inventory, within bounds, no overlaps.
    - [x] Level 2: Validate 1 bumper pad solution fits inventory, within bounds, no overlaps.
    - [x] Level 3: Validate ramp + booster solution fits inventory, within bounds, no overlaps.
    - [x] Level 4: Validate corrected 3 ramps + 2 half-pipes solution (original had overlap with goal_bucket).
    - [x] Level 5: Validate 2 ramps + 1 booster + 1 bumper solution fits inventory, within bounds, no overlaps.
    - [x] Added edge case tests: invalid piece type, duplicate positions, launchpad overlap.

- [x] Task: Run validation tests and fix any failures.
    - [x] Level 4 original solution had overlap with static goal_bucket — corrected by adjusting last ramp position from [4,0,3] to [4,1,3].
    - [x] All 15 tests pass (61 test files, 555 total tests).
    - [x] TypeScript typecheck: clean. Biome lint: clean.

- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md) [checkpoint: b4508e9]

## Phase 4: Physics Tuning & Manual Verification

- [x] Task: Manual playthrough of Level 1.
    - [x] Load level, place intended solution, run simulation.
    - [x] Verify marble rolls smoothly along ramp to goal.
    - [x] Tune ramp angle, marble friction if needed.
    - [x] Document any changes made.

- [x] Task: Manual playthrough of Level 2.
    - [x] Load level, place bumper pad, verify deflection angle.
    - [x] Tune bumper restitution if bounce feels wrong.
    - [x] Document any changes made.

- [x] Task: Manual playthrough of Level 3.
    - [x] Load level, place ramp + speed booster.
    - [x] Verify marble launches across gap with satisfying distance.
    - [x] Tune `BOOST_FORCE` if launch feels too weak/strong.
    - [x] Document any changes made.

- [x] Task: Manual playthrough of Level 4.
    - [x] Load level, place zigzag ramp pattern.
    - [x] Verify marble navigates switchbacks without getting stuck.
    - [x] Tune marble mass/friction if momentum feels wrong.
    - [x] Document any changes made.

- [x] Task: Manual playthrough of Level 5.
    - [x] Load level, place solution with resource constraints.
    - [x] Verify marble reaches goal with tight inventory.
    - [x] Ensure no trivial shortcuts exist.
    - [x] Document any changes made.

- [x] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)

## Phase 5: Sandbox Mode Verification

- [x] Task: Verify sandbox inventory and grid.
    - [x] Load sandbox mode in browser.
    - [x] Verify 16 pieces available (5 ramps, 4 bumpers, 3 boosters, 4 half-pipes).
    - [x] Verify grid is 10×10×5.
    - [x] Verify no goal bucket appears.

- [x] Task: Test sandbox edge cases.
    - [x] Place pieces at max Y (y=4 for 5-height grid).
    - [x] Attempt to place overlapping pieces (should be rejected).
    - [x] Place all 16 pieces, verify inventory shows 0 for each type.
    - [x] Remove all pieces, verify inventory restores.
    - [x] Run physics for extended period (30+ seconds), verify no glitches.

- [x] Task: Conductor - User Manual Verification 'Phase 5' (Protocol in workflow.md)

## Phase 6: Final Integration & Cleanup

- [x] Task: Run full test suite.
    - [x] Execute `pnpm run test` and verify all tests pass.
    - [x] Execute `pnpm run typecheck` and verify no type errors.
    - [x] Execute `pnpm run lint` and verify no lint errors.

- [x] Task: Verify no unintended shortcuts in campaign levels.
    - [x] For each level, attempt to reach goal without using the intended mechanic.
    - [x] Document findings and fix any shortcuts found.

- [x] Task: Final documentation update.
    - [x] Update `level-data-schema.md` if any schema changes were made.
    - [x] Document final physics constants in `physics.ts` comments.
    - [x] Update ROADMAP.md TRACK-009 Definition of Done checkboxes.

- [ ] Task: Conductor - User Manual Verification 'Phase 6' (Protocol in workflow.md)
</protect>
