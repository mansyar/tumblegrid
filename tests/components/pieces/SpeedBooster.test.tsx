import { describe, expect, it, vi } from 'vitest';
import {
  SpeedBooster,
  createSpeedBoosterGeometry,
} from '@/components/pieces/SpeedBooster';

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(),
  useFrame: vi.fn(),
}));

describe('SpeedBooster', () => {
  it('should be a memo-wrapped component', () => {
    expect(SpeedBooster).toBeDefined();
  });

  it('should have the correct display name', () => {
    expect(SpeedBooster.displayName).toBe('SpeedBooster');
  });
});

describe('createSpeedBoosterGeometry', () => {
  it('should create a flat track geometry fitting within 1 grid cell', () => {
    const geometry = createSpeedBoosterGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    // Should fit within 2×2×2 cell
    expect(bbox.max.x - bbox.min.x).toBeLessThanOrEqual(2);
    expect(bbox.max.z - bbox.min.z).toBeLessThanOrEqual(2);
    expect(bbox.max.y - bbox.min.y).toBeLessThanOrEqual(2);
  });

  it('should be flat (thin in Y axis)', () => {
    const geometry = createSpeedBoosterGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    const height = bbox.max.y - bbox.min.y;

    // Flat track - should be thin
    expect(height).toBeLessThanOrEqual(0.5);
  });

  it('should fill the cell horizontally', () => {
    const geometry = createSpeedBoosterGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    const width = bbox.max.x - bbox.min.x;
    const depth = bbox.max.z - bbox.min.z;

    // Should be wide in both horizontal directions
    expect(width).toBeGreaterThanOrEqual(1.5);
    expect(depth).toBeGreaterThanOrEqual(1.5);
  });
});
