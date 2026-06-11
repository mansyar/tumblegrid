import { describe, expect, it } from 'vitest';

import {
  BOOST_FORCE,
  FIXED_TIMESTEP,
  GRAVITY,
  INITIAL_MARBLE_IMPULSE,
  MARBLE_CONFIG,
  SPAWN_HEIGHT_OFFSET,
  computeMarbleSpawnPosition,
  createPhysicsConfig,
  getBoostDirection,
  getBoostImpulse,
  getInitialMarbleImpulse,
  getPhysicsPaused,
} from '@/utils/physics';

describe('Physics Constants', () => {
  it('should have gravity pointing downward', () => {
    expect(GRAVITY).toEqual([0, -9.81, 0]);
  });

  it('should have fixed timestep of 1/60', () => {
    expect(FIXED_TIMESTEP).toBe(1 / 60);
  });

  it('should have marble physics config', () => {
    expect(MARBLE_CONFIG).toBeDefined();
    expect(MARBLE_CONFIG.mass).toBe(1);
    expect(MARBLE_CONFIG.restitution).toBeCloseTo(0.3);
    expect(MARBLE_CONFIG.friction).toBeCloseTo(0.5);
    expect(MARBLE_CONFIG.linearDamping).toBeCloseTo(0.1);
    expect(MARBLE_CONFIG.radius).toBeCloseTo(0.5);
  });
});

describe('createPhysicsConfig', () => {
  it('should return config with gravity and timestep', () => {
    const config = createPhysicsConfig();
    expect(config.gravity).toEqual(GRAVITY);
    expect(config.timeStep).toBe(FIXED_TIMESTEP);
  });
});

describe('getPhysicsPaused', () => {
  it('should return true for BUILDING state', () => {
    expect(getPhysicsPaused('BUILDING')).toBe(true);
  });

  it('should return true for SANDBOX_BUILDING state', () => {
    expect(getPhysicsPaused('SANDBOX_BUILDING')).toBe(true);
  });

  it('should return true for LEVEL_CLEARED state', () => {
    expect(getPhysicsPaused('LEVEL_CLEARED')).toBe(true);
  });

  it('should return false for PLAYING state', () => {
    expect(getPhysicsPaused('PLAYING')).toBe(false);
  });

  it('should return false for SANDBOX_PLAYING state', () => {
    expect(getPhysicsPaused('SANDBOX_PLAYING')).toBe(false);
  });
});

describe('computeMarbleSpawnPosition', () => {
  it('should return position above launchpad by height offset', () => {
    const launchpadPos: [number, number, number] = [2, 0, 3];
    const spawnPos = computeMarbleSpawnPosition(launchpadPos);

    expect(spawnPos[0]).toBe(2);
    expect(spawnPos[1]).toBe(0 + SPAWN_HEIGHT_OFFSET);
    expect(spawnPos[2]).toBe(3);
  });

  it('should handle non-zero launchpad Y position', () => {
    const launchpadPos: [number, number, number] = [5, 2, 1];
    const spawnPos = computeMarbleSpawnPosition(launchpadPos);

    expect(spawnPos[1]).toBe(2 + SPAWN_HEIGHT_OFFSET);
  });

  it('should preserve X and Z coordinates unchanged', () => {
    const launchpadPos: [number, number, number] = [-3, 0, 7];
    const spawnPos = computeMarbleSpawnPosition(launchpadPos);

    expect(spawnPos[0]).toBe(-3);
    expect(spawnPos[2]).toBe(7);
  });
});

describe('Initial Marble Impulse', () => {
  it('should have a non-zero X component', () => {
    expect(INITIAL_MARBLE_IMPULSE[0]).toBe(2);
  });

  it('should have zero Y component (horizontal only)', () => {
    expect(INITIAL_MARBLE_IMPULSE[1]).toBe(0);
  });

  it('should have zero Z component', () => {
    expect(INITIAL_MARBLE_IMPULSE[2]).toBe(0);
  });

  it('should return a copy via getInitialMarbleImpulse', () => {
    const impulse = getInitialMarbleImpulse();
    expect(impulse).toEqual(INITIAL_MARBLE_IMPULSE);
    // Verify it's a copy, not the same reference
    impulse[0] = 99;
    expect(INITIAL_MARBLE_IMPULSE[0]).toBe(2);
  });
});

describe('Speed Booster Boost Functions', () => {
  it('should have BOOST_FORCE set to 8', () => {
    expect(BOOST_FORCE).toBe(8);
  });

  it('should return +X for rotation 0', () => {
    expect(getBoostDirection(0)).toEqual([1, 0, 0]);
  });

  it('should return +Z for rotation 1', () => {
    expect(getBoostDirection(1)).toEqual([0, 0, 1]);
  });

  it('should return -X for rotation 2', () => {
    expect(getBoostDirection(2)).toEqual([-1, 0, 0]);
  });

  it('should return -Z for rotation 3', () => {
    expect(getBoostDirection(3)).toEqual([0, 0, -1]);
  });

  it('should return +X as default for unknown rotation index', () => {
    expect(getBoostDirection(99)).toEqual([1, 0, 0]);
  });

  it('should compute impulse = direction * BOOST_FORCE for rotation 0', () => {
    expect(getBoostImpulse(0)).toEqual([BOOST_FORCE, 0, 0]);
  });

  it('should compute impulse = direction * BOOST_FORCE for rotation 1', () => {
    expect(getBoostImpulse(1)).toEqual([0, 0, BOOST_FORCE]);
  });

  it('should have zero Y component in impulse for all rotations', () => {
    for (let rot = 0; rot < 4; rot++) {
      const impulse = getBoostImpulse(rot);
      expect(impulse[1]).toBe(0);
    }
  });
});
