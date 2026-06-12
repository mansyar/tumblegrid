import { describe, expect, it, vi } from 'vitest';
import {
  GoalBucket,
  createGoalBucketBaseGeometry,
  createGoalBucketWallGeometry,
  createGoalBucketLipGeometry,
} from '@/components/pieces/GoalBucket';

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(),
  useFrame: vi.fn(),
}));

describe('GoalBucket', () => {
  it('should be a memo-wrapped component', () => {
    expect(GoalBucket).toBeDefined();
  });

  it('should have the correct display name', () => {
    expect(GoalBucket.displayName).toBe('GoalBucket');
  });
});

describe('createGoalBucketBaseGeometry', () => {
  it('should create a base fitting within 1 grid cell', () => {
    const geometry = createGoalBucketBaseGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    expect(bbox.max.x - bbox.min.x).toBeLessThanOrEqual(2);
    expect(bbox.max.z - bbox.min.z).toBeLessThanOrEqual(2);
    expect(bbox.max.y - bbox.min.y).toBeLessThanOrEqual(0.5);
  });
});

describe('createGoalBucketWallGeometry', () => {
  it('should create a wall with height taller than marble diameter (1.2)', () => {
    const geometry = createGoalBucketWallGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    // Wall should be 1.2 units tall (taller than marble diameter of 1.0)
    expect(bbox.max.y - bbox.min.y).toBeCloseTo(1.2);
    expect(bbox.max.x - bbox.min.x).toBeGreaterThan(0);
  });
});

describe('createGoalBucketLipGeometry', () => {
  it('should create X-wall geometry taller than marble diameter (1.2)', () => {
    const geometry = createGoalBucketLipGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    // X-wall should be 1.2 units tall (taller than marble diameter of 1.0)
    expect(bbox.max.y - bbox.min.y).toBeCloseTo(1.2);
    // Lip should be thin in X (0.1)
    expect(bbox.max.x - bbox.min.x).toBeCloseTo(0.1);
  });

  it('should match wall geometry height', () => {
    const wallGeometry = createGoalBucketWallGeometry();
    const lipGeometry = createGoalBucketLipGeometry();
    wallGeometry.computeBoundingBox();
    lipGeometry.computeBoundingBox();

    const wallHeight =
      (wallGeometry.boundingBox?.max.y ?? 0) -
      (wallGeometry.boundingBox?.min.y ?? 0);
    const lipHeight =
      (lipGeometry.boundingBox?.max.y ?? 0) -
      (lipGeometry.boundingBox?.min.y ?? 0);

    // All 4 walls should be the same height
    expect(lipHeight).toBeCloseTo(wallHeight);
  });
});
