import { describe, expect, it, vi } from 'vitest';
import {
  Launchpad,
  createLaunchpadBaseGeometry,
  createLaunchpadCenterGeometry,
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

describe('createLaunchpadBaseGeometry', () => {
  it('should create a base fitting within 1 grid cell', () => {
    const geometry = createLaunchpadBaseGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    expect(bbox.max.x - bbox.min.x).toBeLessThanOrEqual(2);
    expect(bbox.max.z - bbox.min.z).toBeLessThanOrEqual(2);
    expect(bbox.max.y - bbox.min.y).toBeLessThanOrEqual(0.5);
  });
});

describe('createLaunchpadCenterGeometry', () => {
  it('should create a raised center platform within 1 grid cell', () => {
    const geometry = createLaunchpadCenterGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    expect(bbox.max.x - bbox.min.x).toBeLessThanOrEqual(2);
    expect(bbox.max.z - bbox.min.z).toBeLessThanOrEqual(2);
    expect(bbox.max.y - bbox.min.y).toBeGreaterThan(0);
  });
});

describe('createLaunchpadRingGeometry', () => {
  it('should create a ring with non-zero dimensions', () => {
    const geometry = createLaunchpadRingGeometry();
    geometry.computeBoundingBox();

    expect(geometry.boundingBox).not.toBeNull();
    if (geometry.boundingBox === null) return;

    const bbox = geometry.boundingBox;
    expect(bbox.max.x - bbox.min.x).toBeGreaterThan(0);
    expect(bbox.max.y - bbox.min.y).toBeGreaterThan(0);
  });
});
