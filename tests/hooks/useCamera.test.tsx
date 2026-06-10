import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCamera } from '@/hooks/useCamera';

// Mock R3F hooks
vi.mock('@react-three/fiber', () => ({
  useThree: () => ({
    camera: {
      position: {
        lerp: vi.fn(),
      },
    },
  }),
  useFrame: vi.fn(),
}));

describe('useCamera', () => {
  it('should return an autoFrame function', () => {
    const { result } = renderHook(() => useCamera());
    expect(result.current.autoFrame).toBeDefined();
    expect(typeof result.current.autoFrame).toBe('function');
  });

  it('should accept bounds object with x, y, z, width, height, depth', () => {
    const { result } = renderHook(() => useCamera());
    const bounds = { x: 0, y: 0, z: 0, width: 10, height: 5, depth: 10 };
    // Should not throw when called with valid bounds
    expect(() => result.current.autoFrame(bounds)).not.toThrow();
  });

  it('should have controlsRef', () => {
    const { result } = renderHook(() => useCamera());
    expect(result.current.controlsRef).toBeDefined();
  });
});
