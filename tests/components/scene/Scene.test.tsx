import { describe, expect, it, vi } from 'vitest';
import { Scene } from '@/components/scene/Scene';

vi.mock('@react-three/fiber', () => ({
  useThree: () => ({
    camera: {
      position: {
        lerp: vi.fn(),
        set: vi.fn(),
      },
    },
  }),
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: vi.fn().mockImplementation(() => null),
  Grid: vi.fn().mockImplementation(() => null),
}));

describe('Scene', () => {
  it('should be a function component', () => {
    expect(typeof Scene).toBe('function');
  });

  it('should have a name', () => {
    expect(Scene.name).toBe('Scene');
  });
});
