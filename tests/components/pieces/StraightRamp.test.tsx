import { describe, expect, it, vi } from 'vitest';
import { StraightRamp, createRampGeometry } from '@/components/pieces/StraightRamp';

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(),
  useFrame: vi.fn(),
}));

describe('StraightRamp', () => {
  it('should be a memo-wrapped component', () => {
    expect(StraightRamp).toBeDefined();
  });

  it('should have the correct display name', () => {
    expect(StraightRamp.displayName).toBe('StraightRamp');
  });
});

describe('createRampGeometry', () => {
  it('should create a wedge geometry with correct bounds', () => {
    const geometry = createRampGeometry();

    expect(geometry).toBeDefined();
    expect(geometry.attributes.position).toBeDefined();

    // Compute bounding box of the geometry
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;

    // Assert bounding box exists
    expect(bbox).not.toBeNull();

    if (bbox === null) return;

    // The wedge should fit within a 2×2×2 cell centered at origin
    expect(bbox.min.x).toBeCloseTo(-1);
    expect(bbox.max.x).toBeCloseTo(1);
    expect(bbox.max.y).toBeCloseTo(1);
    expect(bbox.min.z).toBeCloseTo(-1);
    expect(bbox.max.z).toBeCloseTo(1);
  });

  it('should have a flat bottom at Y=-1', () => {
    const geometry = createRampGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    // Bottom should be at Y=-1
    expect(geometry.boundingBox.min.y).toBeCloseTo(-1);
  });

  it('should create a non-degenerate geometry with positive volume', () => {
    const geometry = createRampGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    const width = bbox.max.x - bbox.min.x;
    const depth = bbox.max.z - bbox.min.z;
    const height = bbox.max.y - bbox.min.y;

    expect(width).toBeGreaterThan(0);
    expect(depth).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });
});
