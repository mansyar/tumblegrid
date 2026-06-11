import { describe, expect, it } from 'vitest';

import type { ColliderDescriptor } from '@/utils/pieceColliders';
import {
  getBumperPadColliders,
  getGoalBucketColliders,
  getHalfPipeColliders,
  getLaunchpadColliders,
  getSpeedBoosterColliders,
  getStraightRampColliders,
} from '@/utils/pieceColliders';

// Helper for HalfPipe tests to avoid implicit any
function isRail(c: ColliderDescriptor): boolean {
  return Math.abs(c.position[2]) > 0.5;
}

function isBase(c: ColliderDescriptor): boolean {
  return Math.abs(c.position[2]) < 0.5;
}

describe('getStraightRampColliders', () => {
  it('should return a single collider descriptor', () => {
    const colliders = getStraightRampColliders(0);
    expect(colliders).toHaveLength(1);
  });

  it('should have type cuboid', () => {
    const colliders = getStraightRampColliders(0);
    expect(colliders[0].type).toBe('cuboid');
  });

  it('should not be a sensor', () => {
    const colliders = getStraightRampColliders(0);
    expect(colliders[0].sensor).toBe(false);
  });

  it('should have a nonzero rotation (pitch to match slope)', () => {
    const colliders = getStraightRampColliders(0);
    // Rotation should be non-zero along at least one axis (the pitch axis)
    const hasRotation = colliders[0].rotation.some(
      (v: number) => v !== 0,
    );
    expect(hasRotation).toBe(true);
  });

  it('should have same rotation for all rotation indices (Y rotation is handled by parent group)', () => {
    const r0 = getStraightRampColliders(0);
    const r1 = getStraightRampColliders(1);
    const r2 = getStraightRampColliders(2);
    const r3 = getStraightRampColliders(3);

    // Local rotation should be identical since parent group handles Y rotation
    expect(r0[0].rotation).toEqual(r1[0].rotation);
    expect(r1[0].rotation).toEqual(r2[0].rotation);
    expect(r2[0].rotation).toEqual(r3[0].rotation);
  });

  it('should have positive Z-rotation for descending slope (pitch down in +X)', () => {
    const colliders = getStraightRampColliders(0);
    // Tilted around Z axis: negative angle = pitch down in +X
    const zRot = colliders[0].rotation[2];
    expect(zRot).toBeLessThan(0);
  });

  it('should have position at center of ramp (y ~1)', () => {
    const colliders = getStraightRampColliders(0);
    // Ramp center is at y=1 in local space
    expect(colliders[0].position[1]).toBe(1);
  });

  it('should have position at x=0 (centered horizontally)', () => {
    const colliders = getStraightRampColliders(0);
    expect(colliders[0].position[0]).toBe(0);
  });

  it('should have position at z=0 (centered in depth)', () => {
    const colliders = getStraightRampColliders(0);
    expect(colliders[0].position[2]).toBe(0);
  });
});

describe('getBumperPadColliders', () => {
  it('should return a single collider with type cuboid', () => {
    const colliders = getBumperPadColliders(false);
    expect(colliders).toHaveLength(1);
    expect(colliders[0].type).toBe('cuboid');
  });

  it('should have restitution 1.0 for elastic bumper', () => {
    const colliders = getBumperPadColliders(false);
    expect(colliders[0].restitution).toBe(1.0);
  });

  it('should have restitution 0 for static terrain', () => {
    const colliders = getBumperPadColliders(true);
    expect(colliders[0].restitution).toBe(0);
  });

  it('should be tall (y half-extent ~1)', () => {
    const colliders = getBumperPadColliders(false);
    // Full cell height: half-height of ~1
    expect(colliders[0].halfExtents[1]).toBe(1);
  });

  it('should be thin in Z', () => {
    const colliders = getBumperPadColliders(false);
    expect(colliders[0].halfExtents[2]).toBeLessThan(0.5);
  });
});

describe('getSpeedBoosterColliders', () => {
  it('should return a single sensor collider', () => {
    const colliders = getSpeedBoosterColliders(0);
    expect(colliders).toHaveLength(1);
    expect(colliders[0].sensor).toBe(true);
  });

  it('should have type cuboid', () => {
    const colliders = getSpeedBoosterColliders(0);
    expect(colliders[0].type).toBe('cuboid');
  });

  it('should be thin (y half-extent < 0.3)', () => {
    const colliders = getSpeedBoosterColliders(0);
    expect(colliders[0].halfExtents[1]).toBeLessThan(0.3);
  });

  it('should have the same sensor dimensions for all rotations', () => {
    const r0 = getSpeedBoosterColliders(0);
    const r1 = getSpeedBoosterColliders(1);
    expect(r0[0].halfExtents).toEqual(r1[0].halfExtents);
  });
});

describe('getHalfPipeColliders', () => {
  it('should return 3 colliders (base + 2 rails)', () => {
    const colliders = getHalfPipeColliders();
    expect(colliders).toHaveLength(3);
  });

  it('should have all colliders as type cuboid', () => {
    const colliders = getHalfPipeColliders();
    for (const c of colliders) {
      expect(c.type).toBe('cuboid');
    }
  });

  it('should have no sensors', () => {
    const colliders = getHalfPipeColliders();
    for (const c of colliders) {
      expect(c.sensor).toBe(false);
    }
  });

  it('should position rail colliders at z = ±1', () => {
    const colliders = getHalfPipeColliders();
    const rails = colliders.filter(isRail);
    expect(rails).toHaveLength(2);
    expect(rails[0].position[2]).toBeCloseTo(-1);
    expect(rails[1].position[2]).toBeCloseTo(1);
  });

  it('should position base collider at z = 0', () => {
    const colliders = getHalfPipeColliders();
    const base = colliders.find(isBase);
    expect(base).toBeDefined();
    expect(base?.position[2]).toBe(0);
  });
});

describe('getGoalBucketColliders', () => {
  it('should return 4 colliders (floor + 2 Z-walls + 1 sensor)', () => {
    const colliders = getGoalBucketColliders();
    expect(colliders).toHaveLength(4);
  });

  it('should have exactly 3 physical colliders (sensor=false)', () => {
    const colliders = getGoalBucketColliders();
    const physical = colliders.filter((c) => !c.sensor);
    expect(physical).toHaveLength(3);
  });

  it('should have exactly 1 sensor collider', () => {
    const colliders = getGoalBucketColliders();
    const sensors = colliders.filter((c) => c.sensor);
    expect(sensors).toHaveLength(1);
    expect(sensors[0].type).toBe('cuboid');
    expect(sensors[0].halfExtents[0]).toBeLessThan(1);
    expect(sensors[0].halfExtents[2]).toBeLessThan(1);
  });

  it('should have floor at Y=0.1', () => {
    const colliders = getGoalBucketColliders();
    const floor = colliders.find(
      (c) => !c.sensor && Math.abs(c.position[1] - 0.1) < 0.01,
    );
    expect(floor).toBeDefined();
    expect(floor?.halfExtents[1]).toBe(0.1);
  });

  it('should have walls at Z=±0.95', () => {
    const colliders = getGoalBucketColliders();
    const zWalls = colliders.filter(
      (c) => !c.sensor && Math.abs(c.position[0]) < 0.01 && Math.abs(c.position[2]) > 0.9,
    );
    expect(zWalls).toHaveLength(2);
    expect(zWalls[0].halfExtents[2]).toBe(0.05);
  });

  it('should have no X-direction walls (open entry sides)', () => {
    const colliders = getGoalBucketColliders();
    const xWalls = colliders.filter(
      (c) => !c.sensor && Math.abs(c.position[2]) < 0.01 && Math.abs(c.position[0]) > 0.9,
    );
    expect(xWalls).toHaveLength(0);
  });

  it('should have restitution 0.3 on physical colliders', () => {
    const colliders = getGoalBucketColliders();
    const physical = colliders.filter((c) => !c.sensor);
    for (const c of physical) {
      expect(c.restitution).toBe(0.3);
    }
  });

  it('should have sensor positioned inside the bucket cavity', () => {
    const colliders = getGoalBucketColliders();
    const sensor = colliders.find((c) => c.sensor);
    expect(sensor).toBeDefined();
    // Sensor should be centered (x=0, z=0) inside the cavity
    expect(sensor?.position[0]).toBe(0);
    expect(sensor?.position[2]).toBe(0);
    // Sensor height should be within the wall cavity (Y 0.2 to 0.7)
    expect(sensor?.position[1]).toBeGreaterThan(0.3);
    expect(sensor?.position[1]).toBeLessThan(0.6);
  });
});

describe('getLaunchpadColliders', () => {
  it('should return a single cuboid collider', () => {
    const colliders = getLaunchpadColliders();
    expect(colliders).toHaveLength(1);
    expect(colliders[0].type).toBe('cuboid');
  });

  it('should be a flat platform (small y half-extent)', () => {
    const colliders = getLaunchpadColliders();
    expect(colliders[0].halfExtents[1]).toBeLessThan(0.3);
  });

  it('should not be a sensor', () => {
    const colliders = getLaunchpadColliders();
    expect(colliders[0].sensor).toBe(false);
  });
});
