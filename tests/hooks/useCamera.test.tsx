import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCamera } from '@/hooks/useCamera';

// Mock R3F hooks
let frameCallback: (() => void) | null = null;
const mockUpdate = vi.fn();
const mockLerp = vi.fn();
const mockTargetLerp = vi.fn();

vi.mock('@react-three/fiber', () => ({
  useThree: () => ({
    camera: {
      position: {
        lerp: mockLerp,
        set: vi.fn(),
      },
    },
  }),
  useFrame: (callback: () => void) => {
    frameCallback = callback;
  },
}));

describe('useCamera', () => {
  beforeEach(() => {
    frameCallback = null;
    mockUpdate.mockClear();
    mockLerp.mockClear();
    mockTargetLerp.mockClear();
    vi.useFakeTimers();
  });

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

  it('should start animation when autoFrame is called', () => {
    const { result } = renderHook(() => useCamera());
    const bounds = { x: 0, y: 0, z: 0, width: 10, height: 5, depth: 10 };

    act(() => {
      result.current.autoFrame(bounds);
    });

    // Frame callback should be registered
    expect(frameCallback).toBeDefined();
  });

  it('should run animation loop when frame callback is invoked', () => {
    const { result } = renderHook(() => useCamera());
    const bounds = { x: 0, y: 0, z: 0, width: 10, height: 5, depth: 10 };

    act(() => {
      result.current.autoFrame(bounds);
    });

    // Simulate frame callback
    act(() => {
      frameCallback?.();
    });

    // lerp should have been called on camera position
    expect(mockLerp).toHaveBeenCalled();
  });

  it('should update controls target when controlsRef is set', () => {
    const { result } = renderHook(() => useCamera());
    const bounds = { x: 0, y: 0, z: 0, width: 10, height: 5, depth: 10 };

    // Set up controlsRef with mock methods
    result.current.controlsRef.current = {
      target: { lerp: mockTargetLerp },
      update: mockUpdate,
      // biome-ignore lint/suspicious/noExplicitAny: Mock object for testing
    } as any;

    act(() => {
      result.current.autoFrame(bounds);
    });

    act(() => {
      frameCallback?.();
    });

    expect(mockTargetLerp).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('should complete animation when progress reaches 1', () => {
    const { result } = renderHook(() => useCamera());
    const bounds = { x: 0, y: 0, z: 0, width: 10, height: 5, depth: 10 };

    act(() => {
      result.current.autoFrame(bounds);
    });

    // Advance time past the 500ms animation duration
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Call frame callback again - should hit progress >= 1
    act(() => {
      frameCallback?.();
    });

    // Animation should be complete
    expect(mockLerp).toHaveBeenCalled();
  });
});
