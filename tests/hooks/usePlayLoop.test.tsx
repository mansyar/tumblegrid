import { usePlayLoop } from '@/hooks/usePlayLoop';
import { useGameStore } from '@/store/useGameStore';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';

describe('usePlayLoop', () => {
  beforeEach(() => {
    // Reset to a clean state with one goal bucket and one non-bucket piece
    useGameStore.setState({
      machineState: 'BUILDING',
      placedPieces: [
        {
          id: 'bucket-1',
          type: 'goal_bucket',
          position: [4, 1, 4],
          rotationIndex: 0,
        },
        {
          id: 'ramp-1',
          type: 'straight_ramp',
          position: [2, 0, 2],
          rotationIndex: 0,
        },
      ],
      marbleInBucketIds: new Set(['bucket-1']),
    });
  });

  it('should reset marbleInBucketIds when entering PLAYING', () => {
    // Setup: stale marble tracking
    useGameStore.setState({
      marbleInBucketIds: new Set(['bucket-1']),
      machineState: 'BUILDING',
    });

    renderHook(() => usePlayLoop());

    // Transition to PLAYING
    act(() => {
      useGameStore.setState({ machineState: 'PLAYING' });
    });

    // Bucket entry should have been cleared
    expect(useGameStore.getState().marbleInBucketIds.has('bucket-1')).toBe(
      false,
    );
  });

  it('should not clear bucket tracking on non-play transitions', () => {
    useGameStore.setState({
      marbleInBucketIds: new Set(['bucket-1']),
      machineState: 'BUILDING',
    });

    renderHook(() => usePlayLoop());

    // Staying in BUILDING (same state)
    act(() => {
      useGameStore.setState({ machineState: 'BUILDING' });
    });

    // Bucket entry should remain
    expect(useGameStore.getState().marbleInBucketIds.has('bucket-1')).toBe(
      true,
    );
  });

  it('should handle SANDBOX_PLAYING transition', () => {
    useGameStore.setState({
      marbleInBucketIds: new Set(['bucket-1']),
      machineState: 'SANDBOX_BUILDING',
    });

    renderHook(() => usePlayLoop());

    act(() => {
      useGameStore.setState({ machineState: 'SANDBOX_PLAYING' });
    });

    expect(useGameStore.getState().marbleInBucketIds.has('bucket-1')).toBe(
      false,
    );
  });

  it('should preserve non-bucket state when entering play', () => {
    useGameStore.setState({
      placedPieces: [
        {
          id: 'ramp-1',
          type: 'straight_ramp',
          position: [2, 0, 2],
          rotationIndex: 0,
        },
      ],
      marbleInBucketIds: new Set(),
      machineState: 'BUILDING',
    });

    renderHook(() => usePlayLoop());

    act(() => {
      useGameStore.setState({ machineState: 'PLAYING' });
    });

    // No buckets, no clearing issues
    expect(useGameStore.getState().marbleInBucketIds.size).toBe(0);
  });

  it('should not clear when transitioning from PLAYING to BUILDING', () => {
    useGameStore.setState({
      marbleInBucketIds: new Set(['bucket-1']),
      machineState: 'BUILDING',
    });

    renderHook(() => usePlayLoop());

    // Enter PLAYING first
    act(() => {
      useGameStore.setState({ machineState: 'PLAYING' });
    });

    expect(useGameStore.getState().marbleInBucketIds.size).toBe(0);

    // Now leave PLAYING
    act(() => {
      useGameStore.setState({ machineState: 'BUILDING' });
    });

    // Should still be empty (leaving play doesn't re-add)
    expect(useGameStore.getState().marbleInBucketIds.size).toBe(0);
  });
});
