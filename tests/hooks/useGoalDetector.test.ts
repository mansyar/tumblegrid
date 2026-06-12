import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useGameStore } from '@/store/useGameStore';

// Mock R3F hooks
let frameCallback: ((_: unknown, delta: number) => void) | null = null;
vi.mock('@react-three/fiber', () => ({
  useFrame: (callback: (_: unknown, delta: number) => void) => {
    frameCallback = callback;
  },
}));

const mockCompleteLevel = vi.fn();
vi.mock('@/hooks/useCampaignProgress', () => ({
  useCampaignProgress: () => ({
    completeLevel: mockCompleteLevel,
  }),
}));

// Must import after mocks are set up
// eslint-disable-next-line import/order
import { useGoalDetector } from '@/hooks/useGoalDetector';

function simulateFrame(delta: number): void {
  if (frameCallback) {
    frameCallback(null, delta);
  }
}

describe('useGoalDetector', () => {
  beforeEach(() => {
    frameCallback = null;
    mockCompleteLevel.mockClear();

    useGameStore.setState({
      machineState: 'PLAYING',
      activeMode: 'CAMPAIGN',
      activeLevelIndex: 0,
      marbleInBucketIds: new Set(),
    });
  });

  it('should register a useFrame callback on mount', () => {
    renderHook(() => useGoalDetector());

    expect(frameCallback).not.toBeNull();
  });

  it('should not trigger victory when marble is not in any bucket', () => {
    renderHook(() => useGoalDetector());

    for (let i = 0; i < 200; i++) {
      simulateFrame(0.016);
    }

    expect(useGameStore.getState().machineState).toBe('PLAYING');
    expect(mockCompleteLevel).not.toHaveBeenCalled();
  });

  it('should NOT trigger victory in SANDBOX mode even with marble in bucket', () => {
    useGameStore.setState({
      activeMode: 'SANDBOX',
      machineState: 'SANDBOX_PLAYING',
      marbleInBucketIds: new Set(['bucket-1']),
    });

    renderHook(() => useGoalDetector());

    for (let i = 0; i < 200; i++) {
      simulateFrame(0.016);
    }

    expect(useGameStore.getState().machineState).toBe('SANDBOX_PLAYING');
    expect(mockCompleteLevel).not.toHaveBeenCalled();
  });

  it('should trigger victory after ~1.5s of marble in bucket', () => {
    useGameStore.setState({
      marbleInBucketIds: new Set(['bucket-1']),
    });

    renderHook(() => useGoalDetector());

    // ~1.4 seconds — should NOT trigger yet
    for (let i = 0; i < 87; i++) {
      simulateFrame(0.016);
    }

    expect(useGameStore.getState().machineState).toBe('PLAYING');
    expect(mockCompleteLevel).not.toHaveBeenCalled();

    // Push past 1.5s threshold
    act(() => {
      simulateFrame(0.1); // total: 1.492
      simulateFrame(0.016); // total: 1.508 — trigger
    });

    expect(useGameStore.getState().machineState).toBe('LEVEL_CLEARED');
  });

  it('should call completeLevel with the active level index', () => {
    useGameStore.setState({
      activeLevelIndex: 2,
      marbleInBucketIds: new Set(['bucket-1']),
    });

    renderHook(() => useGoalDetector());

    act(() => {
      for (let i = 0; i < 100; i++) {
        simulateFrame(0.016);
      }
    });

    expect(mockCompleteLevel).toHaveBeenCalledWith(2);
  });

  it('should reset dwell timer when marble leaves the bucket', () => {
    useGameStore.setState({
      marbleInBucketIds: new Set(['bucket-1']),
    });

    const { rerender } = renderHook(() => useGoalDetector());

    // Accumulate ~1.0 second in bucket
    for (let i = 0; i < 62; i++) {
      simulateFrame(0.016);
    }

    // Marble leaves bucket — use act + rerender so the hook picks up the change
    act(() => {
      useGameStore.setState({ marbleInBucketIds: new Set() });
    });
    rerender();

    // Accumulate another ~1.0 second — timer was reset to 0 on exit
    for (let i = 0; i < 62; i++) {
      simulateFrame(0.016);
    }

    // Should NOT have triggered (62 * 0.016 = 0.992 < 1.5)
    expect(useGameStore.getState().machineState).toBe('PLAYING');

    // Marble re-enters
    act(() => {
      useGameStore.setState({ marbleInBucketIds: new Set(['bucket-1']) });
    });
    rerender();

    // Stay for 1.5s
    act(() => {
      for (let i = 0; i < 100; i++) {
        simulateFrame(0.016);
      }
    });

    // Should trigger now
    expect(useGameStore.getState().machineState).toBe('LEVEL_CLEARED');
  });

  it('should NOT trigger during BUILDING state even with marble in bucket', () => {
    useGameStore.setState({
      machineState: 'BUILDING',
      marbleInBucketIds: new Set(['bucket-1']),
    });

    renderHook(() => useGoalDetector());

    for (let i = 0; i < 200; i++) {
      simulateFrame(0.016);
    }

    expect(useGameStore.getState().machineState).toBe('BUILDING');
    expect(mockCompleteLevel).not.toHaveBeenCalled();
  });

  it('should NOT trigger during LEVEL_CLEARED state even with marble in bucket', () => {
    useGameStore.setState({
      machineState: 'LEVEL_CLEARED',
      marbleInBucketIds: new Set(['bucket-1']),
    });

    renderHook(() => useGoalDetector());

    for (let i = 0; i < 200; i++) {
      simulateFrame(0.016);
    }

    expect(useGameStore.getState().machineState).toBe('LEVEL_CLEARED');
    expect(mockCompleteLevel).not.toHaveBeenCalled();
  });
});
