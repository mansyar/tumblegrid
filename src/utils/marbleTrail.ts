/** Duration in milliseconds before a trail point fully fades out. */
export const TRAIL_DURATION_MS = 1000;

/** A single recorded position along the marble's path. */
export interface TrailPoint {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

/**
 * Records a new trail point, removing any points that have fully expired.
 *
 * @param trail - The current trail array (not mutated).
 * @param position - The marble's current world position.
 * @param now - Current time in milliseconds (e.g. `performance.now()`).
 * @returns A new trail array with the point appended and expired points removed.
 */
export function recordTrailPoint(
  trail: TrailPoint[],
  position: { x: number; y: number; z: number },
  now: number,
): TrailPoint[] {
  const cutoff = now - TRAIL_DURATION_MS;
  const filtered = trail.filter((p) => p.timestamp > cutoff);

  return [
    ...filtered,
    { x: position.x, y: position.y, z: position.z, timestamp: now },
  ];
}

/**
 * Computes the opacity of a trail point based on its age.
 *
 * @returns A value between 0 (fully faded) and 1 (brand new).
 */
export function computeTrailOpacity(point: TrailPoint, now: number): number {
  const age = now - point.timestamp;
  if (age >= TRAIL_DURATION_MS) return 0;
  return 1 - age / TRAIL_DURATION_MS;
}
