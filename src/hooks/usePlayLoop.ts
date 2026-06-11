/**
 * usePlayLoop — coordinates lifecycle side effects for Play mode.
 *
 * Responsibilities:
 * - Reset marble-dependent state (marbleInBucketIds) when entering Play
 * - Reset marble-dependent state when returning to BUILDING from Play
 *
 * The mounting/unmounting of Marble and PieceCollider is handled
 * by those components independently.
 */
import { useEffect, useRef } from 'react';

import { useGameStore } from '@/store/useGameStore';

export function usePlayLoop() {
  const machineState = useGameStore((s) => s.machineState);
  const setMarbleInBucket = useGameStore((s) => s.setMarbleInBucket);
  const placedPieces = useGameStore((s) => s.placedPieces);

  // Track previous state to detect transitions into Play
  const prevStateRef = useRef(machineState);

  useEffect(() => {
    const prev = prevStateRef.current;
    prevStateRef.current = machineState;

    const isPlaying =
      machineState === 'PLAYING' || machineState === 'SANDBOX_PLAYING';
    const wasPlaying = prev === 'PLAYING' || prev === 'SANDBOX_PLAYING';

    if (isPlaying && !wasPlaying) {
      // Entering Play: clear any stale bucket tracking
      for (const piece of placedPieces) {
        if (piece.type === 'goal_bucket') {
          setMarbleInBucket(piece.id, false);
        }
      }
    }

    // When leaving Play (via fail detector or Stop button), no additional
    // cleanup is needed — the store keeps its state for the next Play attempt.
  }, [machineState, placedPieces, setMarbleInBucket]);
}
