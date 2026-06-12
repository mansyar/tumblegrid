/**
 * Pure function for goal dwell detection.
 *
 * Accumulates frame delta time while the marble is inside a goal bucket.
 * Returns the new accumulator value and whether the dwell threshold has been reached.
 *
 * @param delta - Time since last frame in seconds (physics- or frame-sourced).
 * @param accumulator - Current accumulated dwell time in seconds.
 * @param isMarbleInBucket - Whether the marble is currently inside any goal bucket.
 * @param threshold - Dwell time required for victory in seconds (default GOAL_DWELL_TIME).
 * @returns A tuple of [newAccumulator, thresholdReached].
 */
import { GOAL_DWELL_TIME } from './physics';

export function updateGoalDwell(
  delta: number,
  accumulator: number,
  isMarbleInBucket: boolean,
  threshold = GOAL_DWELL_TIME,
): [number, boolean] {
  if (!isMarbleInBucket) {
    return [0, false];
  }

  const newAccumulator = accumulator + delta;
  return [newAccumulator, newAccumulator >= threshold];
}
