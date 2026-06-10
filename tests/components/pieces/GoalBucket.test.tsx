import { describe, expect, it, vi } from 'vitest';
import {
  GoalBucket,
  createGoalBucketBaseGeometry,
  createGoalBucketWallGeometry,
} from '@/components/pieces/GoalBucket';

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(),
  useFrame: vi.fn(),
}));

describe('GoalBucket', () => {
  it('should be a function component', () => {
    expect(typeof GoalBucket).toBe('function');
  });

  it('should have the correct component name', () => {
    expect(GoalBucket.name).toBe('GoalBucket');
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
  it('should create a wall with non-zero dimensions', () => {
    const geometry = createGoalBucketWallGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    expect(bbox.max.x - bbox.min.x).toBeGreaterThan(0);
    expect(bbox.max.z - bbox.min.z).toBeGreaterThan(0);
    expect(bbox.max.y - bbox.min.y).toBeGreaterThan(0);
  });
});
