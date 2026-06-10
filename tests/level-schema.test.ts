import { describe, expect, it } from 'vitest';

import {
  campaignLevels,
  getLevelById,
  getLevelByIndex,
  sandboxLevel,
} from '@/levels/index';
import type { LevelDefinition } from '@/store/types';
import { validateLevel, validateLevelSet } from '@/levels/validateLevel';

describe('Level Schema Validation', () => {
  describe('All campaign levels should pass validation', () => {
    for (const level of campaignLevels) {
      it(`should validate ${level.id}`, () => {
        const result = validateLevel(level);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    }
  });

  it('should validate sandbox level', () => {
    const result = validateLevel(sandboxLevel);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate entire level set for ID uniqueness', () => {
    const allLevels = [...campaignLevels, sandboxLevel];
    const result = validateLevelSet(allLevels);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  describe('Individual validation rules', () => {
    it('should reject duplicate IDs', () => {
      const levels: LevelDefinition[] = [
        { ...campaignLevels[0] },
        { ...campaignLevels[0], id: 'campaign_01' },
      ];
      const result = validateLevelSet(levels);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Duplicate level ID: campaign_01');
    });

    it('should reject out-of-bounds positions', () => {
      const level: LevelDefinition = {
        ...campaignLevels[0],
        staticTerrain: [
          { type: 'goal_bucket', position: [100, 0, 0], rotationIndex: 0 },
        ],
      };
      const result = validateLevel(level);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('out of bounds'))).toBe(
        true
      );
    });

    it('should reject overlapping positions', () => {
      const level: LevelDefinition = {
        ...campaignLevels[0],
        staticTerrain: [
          { type: 'straight_ramp', position: [1, 0, 0], rotationIndex: 0 },
          { type: 'bumper_pad', position: [1, 0, 0], rotationIndex: 0 },
        ],
      };
      const result = validateLevel(level);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Overlap'))).toBe(true);
    });

    it('should reject invalid inventory keys', () => {
      const level: LevelDefinition = {
        ...campaignLevels[0],
        inventory: { invalid_type: 5 } as unknown as Partial<
          Record<import('@/store/types').PieceType, number>
        >,
      };
      const result = validateLevel(level);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid inventory key'))).toBe(
        true
      );
    });

    it('should reject negative inventory counts', () => {
      const level: LevelDefinition = {
        ...campaignLevels[0],
        inventory: { straight_ramp: -1 },
      };
      const result = validateLevel(level);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('negative'))).toBe(true);
    });

    it('should reject sandbox level with goalPosition', () => {
      const level: LevelDefinition = {
        ...sandboxLevel,
        goalPosition: [5, 0, 5],
      };
      const result = validateLevel(level);
      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) => e.includes('must not have goalPosition'))
      ).toBe(true);
    });

    it('should reject campaign level without goalPosition', () => {
      const level: LevelDefinition = {
        ...campaignLevels[0],
        goalPosition: undefined,
      };
      const result = validateLevel(level);
      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) => e.includes('must have goalPosition'))
      ).toBe(true);
    });

    it('should reject invalid rotation index', () => {
      const level: LevelDefinition = {
        ...campaignLevels[0],
        staticTerrain: [
          {
            type: 'straight_ramp',
            position: [1, 0, 0],
            rotationIndex: 5 as 0 | 1 | 2 | 3,
          },
        ],
      };
      const result = validateLevel(level);
      expect(result.valid).toBe(false);
      expect(
        result.errors.some((e) => e.includes('invalid rotationIndex'))
      ).toBe(true);
    });

    it('should reject launchpad overlapping with static terrain', () => {
      const level: LevelDefinition = {
        ...campaignLevels[0],
        launchpadPosition: [4, 0, 1], // Same as goal_bucket position
      };
      const result = validateLevel(level);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Overlap'))).toBe(true);
    });
  });
});

describe('Level Index', () => {
  it('should have 5 campaign levels', () => {
    expect(campaignLevels).toHaveLength(5);
  });

  it('should have sandbox level', () => {
    expect(sandboxLevel).toBeDefined();
    expect(sandboxLevel.id).toBe('sandbox');
  });

  describe('getLevelById', () => {
    it('should return campaign level by ID', () => {
      const level = getLevelById('campaign_01');
      expect(level).toBeDefined();
      expect(level?.id).toBe('campaign_01');
    });

    it('should return sandbox level', () => {
      const level = getLevelById('sandbox');
      expect(level).toBeDefined();
      expect(level?.id).toBe('sandbox');
    });

    it('should return undefined for unknown ID', () => {
      const level = getLevelById('nonexistent');
      expect(level).toBeUndefined();
    });
  });

  describe('getLevelByIndex', () => {
    it('should return level at valid index', () => {
      const level = getLevelByIndex(0);
      expect(level).toBeDefined();
      expect(level?.id).toBe('campaign_01');
    });

    it('should return undefined for out-of-range index', () => {
      const level = getLevelByIndex(99);
      expect(level).toBeUndefined();
    });
  });
});
