import { describe, expect, it, vi } from 'vitest';
import { BumperPad, createBumperPadGeometry } from '@/components/pieces/BumperPad';

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(),
  useFrame: vi.fn(),
}));

describe('BumperPad', () => {
  it('should be a function component', () => {
    expect(typeof BumperPad).toBe('function');
  });

  it('should have the correct component name', () => {
    expect(BumperPad.name).toBe('BumperPad');
  });
});

describe('createBumperPadGeometry', () => {
  it('should create a wall geometry fitting within 1 grid cell', () => {
    const geometry = createBumperPadGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    // Should fit within 2×2×2 cell
    expect(bbox.max.x - bbox.min.x).toBeLessThanOrEqual(2);
    expect(bbox.max.z - bbox.min.z).toBeLessThanOrEqual(2);
    expect(bbox.max.y - bbox.min.y).toBeLessThanOrEqual(2);
  });

  it('should be a thin wall (smaller in one horizontal axis)', () => {
    const geometry = createBumperPadGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    const width = bbox.max.x - bbox.min.x;
    const depth = bbox.max.z - bbox.min.z;

    // One dimension should be thin (the wall thickness)
    // and the other should be full cell width
    const thin = Math.min(width, depth);
    const wide = Math.max(width, depth);

    expect(thin).toBeLessThanOrEqual(0.5);
    expect(wide).toBeGreaterThanOrEqual(1.5);
  });

  it('should have non-zero volume', () => {
    const geometry = createBumperPadGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    expect(bbox.max.y - bbox.min.y).toBeGreaterThan(0);
  });
});
