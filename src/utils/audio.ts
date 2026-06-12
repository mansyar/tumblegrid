/**
 * Audio Utility Functions
 * Pure functions for audio parameter mapping.
 */

/** Minimum filter frequency (Hz) when marble is stationary. */
const MIN_FREQUENCY = 200;

/** Maximum filter frequency (Hz) at max velocity. */
const MAX_FREQUENCY = 800;

/** Maximum velocity for mapping (units/s). Velocities above this are clamped. */
const MAX_VELOCITY = 20;

/**
 * Linear interpolation between two values, clamped to [0, 1].
 *
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (clamped to [0, 1])
 * @returns Interpolated value
 */
export function lerp(a: number, b: number, t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return a + (b - a) * clamped;
}

/**
 * Maps marble velocity to bandpass filter frequency.
 * Linear mapping: 0 units/s → 200 Hz, 20 units/s → 800 Hz.
 * Values outside the range are clamped.
 *
 * @param velocity - Marble linear velocity magnitude (units/s)
 * @returns Filter frequency in Hz (200–800)
 */
export function velocityToFrequency(velocity: number): number {
  const clampedVelocity = Math.max(0, Math.min(MAX_VELOCITY, velocity));
  const t = clampedVelocity / MAX_VELOCITY;
  return lerp(MIN_FREQUENCY, MAX_FREQUENCY, t);
}
