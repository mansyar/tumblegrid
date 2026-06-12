/**
 * useGoalDetector — monitors goal bucket dwell time to trigger level victory.
 *
 * Reads marbleInBucketIds from the store each frame. While the marble is
 * inside a goal bucket (size > 0), accumulates frame delta. On reaching
 * the 1.5s dwell threshold, calls setLevelCleared() and persist campaign
 * progress via completeLevel().
 *
 * The hook is a no-op in SANDBOX mode and during non-PLAYING states.
 */
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { useGameStore } from '@/store/useGameStore';
import { updateGoalDwell } from '@/utils/goalDetector';
import { GOAL_DWELL_TIME } from '@/utils/physics';

import { useCampaignProgress } from './useCampaignProgress';

export function useGoalDetector(): void {
  const marbleInBucketIds = useGameStore((s) => s.marbleInBucketIds);
  const activeMode = useGameStore((s) => s.activeMode);
  const machineState = useGameStore((s) => s.machineState);
  const activeLevelIndex = useGameStore((s) => s.activeLevelIndex);
  const setLevelCleared = useGameStore((s) => s.setLevelCleared);
  const { completeLevel } = useCampaignProgress();

  const accumulatorRef = useRef(0);

  useFrame((_, delta) => {
    const isPlaying = machineState === 'PLAYING';
    if (!isPlaying || activeMode !== 'CAMPAIGN') {
      accumulatorRef.current = 0;
      return;
    }

    const isMarbleInBucket = marbleInBucketIds.size > 0;
    const [newAccumulator, thresholdReached] = updateGoalDwell(
      delta,
      accumulatorRef.current,
      isMarbleInBucket,
      GOAL_DWELL_TIME,
    );
    accumulatorRef.current = newAccumulator;

    if (thresholdReached) {
      accumulatorRef.current = 0;
      setLevelCleared();
      completeLevel(activeLevelIndex ?? 0);
    }
  });
}
