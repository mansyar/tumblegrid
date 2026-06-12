import { describe, expect, it, vi } from 'vitest';
import {
  Launchpad,
  createLaunchpadRingGeometry,
} from '@/components/pieces/Launchpad';

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(),
  useFrame: vi.fn(),
}));

describe('Launchpad', () => {
  it('should be a memo-wrapped component', () => {
    expect(Launchpad).toBeDefined();
  });

  it('should have the correct display name', () => {
    expect(Launchpad.displayName).toBe('Launchpad');
  });
});

describe('createLaunchpadRingGeometry', () => {
  it('should create a torus ring with non-zero dimensions', () => {
    const geometry = createLaunchpadRingGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    expect(bbox.max.x - bbox.min.x).toBeGreaterThan(0);
    expect(bbox.max.z - bbox.min.z).toBeGreaterThan(0);
    expect(bbox.max.y - bbox.min.y).toBeGreaterThan(0);
  });

  it('should fit within a 2×2 grid cell', () => {
    const geometry = createLaunchpadRingGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    expect(bbox.max.x - bbox.min.x).toBeLessThanOrEqual(2);
    expect(bbox.max.z - bbox.min.z).toBeLessThanOrEqual(2);
  });
});
