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

- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md) [checkpoint]

## Phase 3: Programmatic Level Solution Validation

- [ ] Task: Design test approach for level solution validation.
    - [ ] Define how to simulate a solution path programmatically (place pieces, run physics, check marble position).
    - [ ] Determine if Rapier determinism allows reproducible test outcomes.
    - [ ] Document test strategy in `tests/level-solution.test.ts` comments.

- [ ] Task: Write level solution validation tests.
    - [ ] Level 1: Place ramp at intended position, verify marble reaches goal.
    - [ ] Level 2: Place bumper pad at intended position, verify marble deflects to goal.
    - [ ] Level 3: Place ramp + speed booster, verify marble launches across gap to goal.
    - [ ] Level 4: Place 3 ramps + 2 half-pipes in zigzag, verify marble reaches goal.
    - [ ] Level 5: Place 2 ramps + 1 booster + 1 bumper, verify marble reaches goal.

- [ ] Task: Run solution validation tests and fix any failures.
    - [ ] If tests fail due to physics tuning, adjust level data or constants.
    - [ ] If tests fail due to test setup, fix test harness.
    - [ ] Verify all 5 tests pass.

- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: Physics Tuning & Manual Verification

- [ ] Task: Manual playthrough of Level 1.
    - [ ] Load level, place intended solution, run simulation.
    - [ ] Verify marble rolls smoothly along ramp to goal.
    - [ ] Tune ramp angle, marble friction if needed.
    - [ ] Document any changes made.

- [ ] Task: Manual playthrough of Level 2.
    - [ ] Load level, place bumper pad, verify deflection angle.
    - [ ] Tune bumper restitution if bounce feels wrong.
    - [ ] Document any changes made.

- [ ] Task: Manual playthrough of Level 3.
    - [ ] Load level, place ramp + speed booster.
    - [ ] Verify marble launches across gap with satisfying distance.
    - [ ] Tune `BOOST_FORCE` if launch feels too weak/strong.
    - [ ] Document any changes made.

- [ ] Task: Manual playthrough of Level 4.
    - [ ] Load level, place zigzag ramp pattern.
    - [ ] Verify marble navigates switchbacks without getting stuck.
    - [ ] Tune marble mass/friction if momentum feels wrong.
    - [ ] Document any changes made.

- [ ] Task: Manual playthrough of Level 5.
    - [ ] Load level, place solution with resource constraints.
    - [ ] Verify marble reaches goal with tight inventory.
    - [ ] Ensure no trivial shortcuts exist.
    - [ ] Document any changes made.

- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)

## Phase 5: Sandbox Mode Verification

- [ ] Task: Verify sandbox inventory and grid.
    - [ ] Load sandbox mode in browser.
    - [ ] Verify 16 pieces available (5 ramps, 4 bumpers, 3 boosters, 4 half-pipes).
    - [ ] Verify grid is 10×10×5.
    - [ ] Verify no goal bucket appears.

- [ ] Task: Test sandbox edge cases.
    - [ ] Place pieces at max Y (y=4 for 5-height grid).
    - [ ] Attempt to place overlapping pieces (should be rejected).
    - [ ] Place all 16 pieces, verify inventory shows 0 for each type.
    - [ ] Remove all pieces, verify inventory restores.
    - [ ] Run physics for extended period (30+ seconds), verify no glitches.

- [ ] Task: Conductor - User Manual Verification 'Phase 5' (Protocol in workflow.md)

## Phase 6: Final Integration & Cleanup

- [ ] Task: Run full test suite.
    - [ ] Execute `pnpm run test` and verify all tests pass.
    - [ ] Execute `pnpm run typecheck` and verify no type errors.
    - [ ] Execute `pnpm run lint` and verify no lint errors.

- [ ] Task: Verify no unintended shortcuts in campaign levels.
    - [ ] For each level, attempt to reach goal without using the intended mechanic.
    - [ ] Document findings and fix any shortcuts found.

- [ ] Task: Final documentation update.
    - [ ] Update `level-data-schema.md` if any schema changes were made.
    - [ ] Document final physics constants in `physics.ts` comments.
    - [ ] Update ROADMAP.md TRACK-009 Definition of Done checkboxes.

- [ ] Task: Conductor - User Manual Verification 'Phase 6' (Protocol in workflow.md)
</protect>
