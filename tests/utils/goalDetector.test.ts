import { describe, expect, it } from 'vitest';

import { updateGoalDwell } from '@/utils/goalDetector';

describe('updateGoalDwell', () => {
  it('should reset accumulator to 0 when marble is not in bucket', () => {
    const [acc, reached] = updateGoalDwell(0.016, 0.5, false);

    expect(acc).toBe(0);
    expect(reached).toBe(false);
  });

  it('should accumulate delta while marble is in bucket', () => {
    const [acc, reached] = updateGoalDwell(0.016, 0.5, true);

    expect(acc).toBeCloseTo(0.516);
    expect(reached).toBe(false);
  });

  it('should start accumulating from 0', () => {
    const [acc, reached] = updateGoalDwell(0.016, 0, true);

    expect(acc).toBeCloseTo(0.016);
    expect(reached).toBe(false);
  });

  it('should return thresholdReached=true when accumulator >= 1.5s', () => {
    const [acc, reached] = updateGoalDwell(0.1, 1.45, true);

    expect(acc).toBeCloseTo(1.55);
    expect(reached).toBe(true);
  });

  it('should return thresholdReached=true on exact threshold', () => {
    const [acc, reached] = updateGoalDwell(0.3, 1.2, true);

    expect(acc).toBeCloseTo(1.5);
    expect(reached).toBe(true);
  });

  it('should return thresholdReached=true at exactly 1.5s threshold', () => {
    const [acc, reached] = updateGoalDwell(0.01, 1.49, true);

    expect(acc).toBeCloseTo(1.5);
    expect(reached).toBe(true);
  });

  it('should use custom threshold when provided', () => {
    const [acc, reached] = updateGoalDwell(0.5, 0, true, 2.0);

    expect(acc).toBeCloseTo(0.5);
    expect(reached).toBe(false);
  });

  it('should work with large delta values', () => {
    const [acc, reached] = updateGoalDwell(2.0, 0, true);

    expect(acc).toBeCloseTo(2.0);
    expect(reached).toBe(true);
  });

  it('should handle zero delta', () => {
    const [acc, reached] = updateGoalDwell(0, 0, true);

    expect(acc).toBe(0);
    expect(reached).toBe(false);
  });
});
