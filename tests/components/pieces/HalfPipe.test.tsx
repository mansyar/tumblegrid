import { describe, expect, it, vi } from 'vitest';
import { HalfPipe, createHalfPipeBaseGeometry, createHalfPipeRailGeometry } from '@/components/pieces/HalfPipe';

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(),
  useFrame: vi.fn(),
}));

describe('HalfPipe', () => {
  it('should be a memo-wrapped component', () => {
    expect(HalfPipe).toBeDefined();
  });

  it('should have the correct display name', () => {
    expect(HalfPipe.displayName).toBe('HalfPipe');
  });
});

describe('createHalfPipeBaseGeometry', () => {
  it('should create a flat base fitting within 1 grid cell', () => {
    const geometry = createHalfPipeBaseGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    expect(bbox.max.x - bbox.min.x).toBeLessThanOrEqual(2);
    expect(bbox.max.z - bbox.min.z).toBeLessThanOrEqual(2);
    expect(bbox.max.y - bbox.min.y).toBeLessThanOrEqual(0.5);
  });
});

describe('createHalfPipeRailGeometry', () => {
  it('should create a rail geometry with non-zero height', () => {
    const geometry = createHalfPipeRailGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    const height = bbox.max.y - bbox.min.y;

    expect(height).toBeGreaterThan(0);
  });

  it('should be thin in one axis', () => {
    const geometry = createHalfPipeRailGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    const width = bbox.max.x - bbox.min.x;
    const depth = bbox.max.z - bbox.min.z;
    const thin = Math.min(width, depth);

    expect(thin).toBeLessThanOrEqual(0.2);
  });
});
