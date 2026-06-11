import { describe, expect, it } from 'vitest';

import {
  TRAIL_DURATION_MS,
  computeTrailOpacity,
  recordTrailPoint,
} from '@/utils/marbleTrail';
import type { TrailPoint } from '@/utils/marbleTrail';

describe('recordTrailPoint', () => {
  it('should add a point to an empty trail', () => {
    const trail: TrailPoint[] = [];
    const result = recordTrailPoint(trail, { x: 1, y: 2, z: 3 }, 1000);

    expect(result).toHaveLength(1);
    expect(result[0].x).toBe(1);
    expect(result[0].y).toBe(2);
    expect(result[0].z).toBe(3);
    expect(result[0].timestamp).toBe(1000);
  });

  it('should append a new point to an existing trail', () => {
    const trail: TrailPoint[] = [
      { x: 0, y: 0, z: 0, timestamp: 0 },
    ];
    const result = recordTrailPoint(trail, { x: 2, y: 3, z: 4 }, 100);

    expect(result).toHaveLength(2);
    expect(result[1].x).toBe(2);
    expect(result[1].timestamp).toBe(100);
  });

  it('should remove points older than TRAIL_DURATION_MS', () => {
    const now = 2000;
    const trail: TrailPoint[] = [
      { x: 0, y: 0, z: 0, timestamp: 0 }, // expired: 2000ms old
      { x: 1, y: 0, z: 0, timestamp: 1500 }, // not expired: 500ms old
    ];
    const result = recordTrailPoint(trail, { x: 2, y: 0, z: 0 }, now);

    // The expired point (timestamp 0) should be removed
    expect(result).toHaveLength(2);
    expect(result[0].timestamp).toBe(1500);
    expect(result[1].timestamp).toBe(2000);
  });

  it('should remove all points at the boundary of TRAIL_DURATION_MS', () => {
    const now = 1000;
    const trail: TrailPoint[] = [
      { x: 0, y: 0, z: 0, timestamp: 0 }, // exactly TRAIL_DURATION_MS ago
    ];
    const result = recordTrailPoint(trail, { x: 1, y: 0, z: 0 }, now);

    // The point at exact cutoff is removed (age >= duration)
    expect(result).toHaveLength(1);
    expect(result[0].timestamp).toBe(1000);
  });

  it('should not mutate the original array', () => {
    const trail: TrailPoint[] = [
      { x: 0, y: 0, z: 0, timestamp: 100 },
    ];
    const result = recordTrailPoint(trail, { x: 1, y: 0, z: 0 }, 200);

    expect(trail).toHaveLength(1);
    expect(result).toHaveLength(2);
    expect(result).not.toBe(trail);
  });

  it('should keep points that are within the duration window', () => {
    const now = 1000;
    const trail: TrailPoint[] = [
      { x: 0, y: 0, z: 0, timestamp: 1 }, // just within range: age = 999ms
    ];
    const result = recordTrailPoint(trail, { x: 1, y: 0, z: 0 }, now);

    // 999ms < 1000ms, so it stays
    expect(result).toHaveLength(2);
    expect(result[0].timestamp).toBe(1);
  });
});

describe('computeTrailOpacity', () => {
  it('should return 1 for a brand new point (age = 0)', () => {
    const point: TrailPoint = { x: 0, y: 0, z: 0, timestamp: 500 };
    const opacity = computeTrailOpacity(point, 500);

    expect(opacity).toBe(1);
  });

  it('should return ~0.5 for a point at half duration', () => {
    const point: TrailPoint = { x: 0, y: 0, z: 0, timestamp: 0 };
    const opacity = computeTrailOpacity(point, TRAIL_DURATION_MS / 2);

    expect(opacity).toBeCloseTo(0.5);
  });

  it('should return 0 for a fully expired point', () => {
    const point: TrailPoint = { x: 0, y: 0, z: 0, timestamp: 0 };
    const opacity = computeTrailOpacity(point, TRAIL_DURATION_MS);

    expect(opacity).toBe(0);
  });

  it('should return 0 for a point older than the duration', () => {
    const point: TrailPoint = { x: 0, y: 0, z: 0, timestamp: 0 };
    const opacity = computeTrailOpacity(point, TRAIL_DURATION_MS + 100);

    expect(opacity).toBe(0);
  });

  it('should decrease linearly with age', () => {
    const point: TrailPoint = { x: 0, y: 0, z: 0, timestamp: 0 };
    const quarterOpacity = computeTrailOpacity(point, TRAIL_DURATION_MS * 0.25);
    const threeQuarterOpacity = computeTrailOpacity(
      point,
      TRAIL_DURATION_MS * 0.75,
    );

    expect(quarterOpacity).toBeCloseTo(0.75);
    expect(threeQuarterOpacity).toBeCloseTo(0.25);
  });
});
