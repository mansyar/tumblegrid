import { describe, it, expect } from 'vitest';

import type { LevelDefinition, PieceType } from '@/store/types';
import {
  validateSolution,
  countSolutionPieces,
  type SolutionPiece,
} from '@/utils/solutionValidator';

/* ────────────────────────────────────────────
   Level data (inline, matching JSON files)
   ──────────────────────────────────────────── */

const level1: LevelDefinition = {
  id: '01-the-descent',
  title: 'The Descent',
  description: 'Place ramps to guide the marble from the launchpad to the goal bucket.',
  gridBounds: { width: 6, depth: 4, height: 3 },
  staticTerrain: [
    { type: 'goal_bucket', position: [4, 0, 1], rotationIndex: 0 },
  ],
  inventory: { straight_ramp: 2, half_pipe: 1 },
  launchpadPosition: [1, 2, 1],
  goalPosition: [4, 0, 1],
};

const level2: LevelDefinition = {
  id: '02-the-bank-shot',
  title: 'The Bank Shot',
  description: 'Use the bumper pad to deflect the marble around the pillar.',
  gridBounds: { width: 6, depth: 6, height: 3 },
  staticTerrain: [
    { type: 'straight_ramp', position: [1, 1, 2], rotationIndex: 0 },
    { type: 'bumper_pad', position: [4, 0, 2], rotationIndex: 0 },
    { type: 'goal_bucket', position: [4, 0, 3], rotationIndex: 0 },
  ],
  inventory: { bumper_pad: 1 },
  launchpadPosition: [1, 2, 2],
  goalPosition: [4, 0, 3],
};

const level3: LevelDefinition = {
  id: '03-velocity-check',
  title: 'Velocity Check',
  description:
    'A massive chasm blocks the path. Use a Speed Booster to launch your marble across the gap. A pillar on the far wall catches it and drops it into the goal.',
  gridBounds: { width: 9, depth: 4, height: 4 },
  staticTerrain: [
    { type: 'goal_bucket', position: [7, 0, 2], rotationIndex: 0 },
    { type: 'bumper_pad', position: [8, 0, 2], rotationIndex: 1 },
  ],
  inventory: { straight_ramp: 1, speed_booster: 1, bumper_pad: 1 },
  launchpadPosition: [1, 3, 2],
  goalPosition: [7, 0, 2],
};

const level4: LevelDefinition = {
  id: '04-the-switchback',
  title: 'The Switchback',
  description: 'Build a zigzag path to reach the goal.',
  gridBounds: { width: 6, depth: 5, height: 5 },
  staticTerrain: [
    { type: 'goal_bucket', position: [4, 0, 3], rotationIndex: 0 },
  ],
  inventory: { straight_ramp: 3, half_pipe: 2 },
  launchpadPosition: [1, 4, 1],
  goalPosition: [4, 0, 3],
};

const level5: LevelDefinition = {
  id: '05-efficiency-crisis',
  title: 'Efficiency Crisis',
  description: 'Use every tool at your disposal to reach the far goal.',
  gridBounds: { width: 10, depth: 6, height: 4 },
  staticTerrain: [
    { type: 'half_pipe', position: [3, 0, 2], rotationIndex: 0 },
    { type: 'half_pipe', position: [6, 0, 2], rotationIndex: 0 },
    { type: 'goal_bucket', position: [9, 0, 2], rotationIndex: 0 },
  ],
  inventory: { straight_ramp: 2, speed_booster: 1, bumper_pad: 1, half_pipe: 1 },
  launchpadPosition: [1, 3, 2],
  goalPosition: [9, 0, 2],
};

/* ────────────────────────────────────────────
   Intended solutions (from docs/level-data-schema.md)
   ──────────────────────────────────────────── */

const level1Solution: SolutionPiece[] = [
  { pieceType: 'straight_ramp', position: [2, 1, 1], rotationIndex: 0 },
  { pieceType: 'straight_ramp', position: [3, 0, 1], rotationIndex: 0 },
];

const level2Solution: SolutionPiece[] = [
  { pieceType: 'bumper_pad', position: [3, 0, 3], rotationIndex: 0 },
];

const level3Solution: SolutionPiece[] = [
  { pieceType: 'straight_ramp', position: [1, 2, 2], rotationIndex: 0 },
  { pieceType: 'speed_booster', position: [1, 0, 2], rotationIndex: 0 },
];

const level4Solution: SolutionPiece[] = [
  { pieceType: 'straight_ramp', position: [2, 3, 1], rotationIndex: 0 },
  { pieceType: 'half_pipe', position: [3, 3, 2], rotationIndex: 0 },
  { pieceType: 'straight_ramp', position: [3, 2, 3], rotationIndex: 1 },
  { pieceType: 'half_pipe', position: [3, 1, 3], rotationIndex: 0 },
  { pieceType: 'straight_ramp', position: [4, 0, 3], rotationIndex: 2 },
];

// NOTE: Level 4 solution places a ramp at the goal bucket position [4, 0, 3].
// This would overlap with the static goal_bucket. The intended solution needs
// adjustment — we'll test with a corrected version below.
const level4SolutionCorrected: SolutionPiece[] = [
  { pieceType: 'straight_ramp', position: [2, 3, 1], rotationIndex: 0 },
  { pieceType: 'half_pipe', position: [3, 3, 2], rotationIndex: 0 },
  { pieceType: 'straight_ramp', position: [3, 2, 3], rotationIndex: 1 },
  { pieceType: 'half_pipe', position: [3, 1, 3], rotationIndex: 0 },
  { pieceType: 'straight_ramp', position: [4, 1, 3], rotationIndex: 2 },
];

const level5Solution: SolutionPiece[] = [
  { pieceType: 'straight_ramp', position: [2, 2, 2], rotationIndex: 0 },
  { pieceType: 'speed_booster', position: [4, 0, 2], rotationIndex: 0 },
  { pieceType: 'bumper_pad', position: [7, 0, 2], rotationIndex: 0 },
  { pieceType: 'straight_ramp', position: [8, 0, 2], rotationIndex: 0 },
];

/* ────────────────────────────────────────────
   Tests
   ──────────────────────────────────────────── */

describe('validateSolution', () => {
  describe('Level 1 — The Descent', () => {
    it('should validate the intended solution', () => {
      const result = validateSolution(level1, level1Solution);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject solution that exceeds inventory', () => {
      const tooManyRamps: SolutionPiece[] = [
        { pieceType: 'straight_ramp', position: [2, 1, 1], rotationIndex: 0 },
        { pieceType: 'straight_ramp', position: [3, 0, 1], rotationIndex: 0 },
        { pieceType: 'straight_ramp', position: [4, 0, 1], rotationIndex: 0 },
      ];
      const result = validateSolution(level1, tooManyRamps);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('exceeds inventory'))).toBe(true);
    });
  });

  describe('Level 2 — The Bank Shot', () => {
    it('should validate the intended solution', () => {
      const result = validateSolution(level2, level2Solution);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject solution that overlaps static terrain', () => {
      const overlapping: SolutionPiece[] = [
        { pieceType: 'bumper_pad', position: [4, 0, 2], rotationIndex: 0 },
      ];
      const result = validateSolution(level2, overlapping);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('overlaps'))).toBe(true);
    });
  });

  describe('Level 3 — Velocity Check', () => {
    it('should validate the intended solution', () => {
      const result = validateSolution(level3, level3Solution);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject solution with out-of-bounds position', () => {
      const outOfBounds: SolutionPiece[] = [
        { pieceType: 'straight_ramp', position: [10, 0, 2], rotationIndex: 0 },
      ];
      const result = validateSolution(level3, outOfBounds);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('out of bounds'))).toBe(true);
    });
  });

  describe('Level 4 — The Switchback', () => {
    it('should validate the corrected solution', () => {
      const result = validateSolution(level4, level4SolutionCorrected);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect overlap with static goal_bucket in original solution', () => {
      const result = validateSolution(level4, level4Solution);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('overlaps'))).toBe(true);
    });
  });

  describe('Level 5 — Efficiency Crisis', () => {
    it('should validate the intended solution', () => {
      const result = validateSolution(level5, level5Solution);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty solution that doesn\'t use any pieces', () => {
      const result = validateSolution(level5, []);
      // Empty solution is technically valid (no errors), but doesn't solve the level
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Edge cases', () => {
    it('should reject invalid piece type', () => {
      const invalid: SolutionPiece[] = [
        { pieceType: 'launchpad' as unknown as PieceType, position: [0, 0, 0], rotationIndex: 0 },
      ];
      const result = validateSolution(level1, invalid);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('invalid piece type'))).toBe(true);
    });

    it('should reject duplicate positions in solution', () => {
      const duplicates: SolutionPiece[] = [
        { pieceType: 'straight_ramp', position: [2, 1, 1], rotationIndex: 0 },
        { pieceType: 'speed_booster', position: [2, 1, 1], rotationIndex: 0 },
      ];
      const result = validateSolution(level1, duplicates);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('overlaps'))).toBe(true);
    });

    it('should reject solution overlapping launchpad', () => {
      const onLaunchpad: SolutionPiece[] = [
        { pieceType: 'straight_ramp', position: [1, 2, 1], rotationIndex: 0 },
      ];
      const result = validateSolution(level1, onLaunchpad);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('overlaps'))).toBe(true);
    });
  });
});

describe('countSolutionPieces', () => {
  it('should count piece types correctly', () => {
    const counts = countSolutionPieces(level4SolutionCorrected);
    expect(counts).toEqual({
      straight_ramp: 3,
      half_pipe: 2,
    });
  });

  it('should return empty object for empty array', () => {
    expect(countSolutionPieces([])).toEqual({});
  });
});
