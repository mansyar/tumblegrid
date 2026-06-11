import { describe, expect, it } from 'vitest';

import {
  FIXED_TIMESTEP,
  GRAVITY,
  MARBLE_CONFIG,
  createPhysicsConfig,
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
