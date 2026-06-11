/**
 * Pure functions that compute Rapier collider configurations for each piece type.
 *
 * Each function returns an array of ColliderDescriptor objects describing the
 * colliders needed to represent the piece in the physics simulation. The R3F
 * wrapper component consumes these descriptors to render actual Rapier colliders.
 *
 * All coordinates are in the piece's local space (before Y-axis rotation).
 */

export interface ColliderDescriptor {
  /** Collider shape type (only primitive cuboid for MVP). */
  type: 'cuboid';
  /** Half-extents of the cuboid: [x, y, z]. */
  halfExtents: [number, number, number];
  /** Local position offset relative to the piece's grid origin. */
  position: [number, number, number];
  /** Local rotation in Euler angles [x, y, z]. */
  rotation: [number, number, number];
  /** Whether this collider is a sensor (detects overlap without physical response). */
  sensor: boolean;
  /** Coefficient of restitution (bounciness). 0 = no bounce, 1 = perfect bounce. */
  restitution: number;
}

const PITCH_45_DOWN: [number, number, number] = [0, 0, -Math.PI / 4];

/**
 * Collider for a Straight Ramp piece.
 *
 * A tilted cuboid that matches the ramp's sloped surface.
 * The ramp at rotation 0 descends in the +X direction at a 45° angle.
 * Y-axis rotation for different descent directions is handled by the parent group.
 *
 * @returns A single tilted cuboid collider descriptor.
 */
export function getStraightRampColliders(
  _rotationIndex: number,
): ColliderDescriptor[] {
  return [
    {
      type: 'cuboid',
      // Long along the slope diagonal (~2.83), thin (0.3), wide in Z
      halfExtents: [1.41, 0.15, 1.0],
      // Center of the ramp slope surface
      position: [0, 1, 0],
      // Pitch down in the +X direction
      rotation: PITCH_45_DOWN,
      sensor: false,
      restitution: 0.3,
    },
  ];
}

/**
 * Collider for a Bumper Pad piece.
 *
 * A vertical cuboid wall. When used as static terrain, restitution is 0
 * (acts as an immovable wall). Otherwise restitution is 1.0 for elastic bounce.
 *
 * @param isStaticTerrain - Whether this bumper functions as static wall.
 * @returns A single vertical cuboid collider descriptor.
 */
export function getBumperPadColliders(
  isStaticTerrain: boolean,
): ColliderDescriptor[] {
  return [
    {
      type: 'cuboid',
      // Wide (1.8), full height (2.0), thin (0.3)
      halfExtents: [0.9, 1.0, 0.15],
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: isStaticTerrain ? 0 : 1.0,
    },
  ];
}

/**
 * Collider for a Speed Booster piece.
 *
 * A sensor cuboid that detects marble overlap and applies a directional impulse.
 * The impulse direction is derived from the piece's rotation index.
 *
 * @param _rotationIndex - Not used for geometry; impulse direction is handled separately.
 * @returns A single sensor cuboid collider descriptor.
 */
export function getSpeedBoosterColliders(
  _rotationIndex: number,
): ColliderDescriptor[] {
  return [
    {
      type: 'cuboid',
      // Full cell coverage, thin
      halfExtents: [1.0, 0.15, 1.0],
      position: [0, 0.15, 0],
      rotation: [0, 0, 0],
      sensor: true,
      restitution: 0,
    },
  ];
}

/**
 * Colliders for a Half-Pipe Tunnel piece.
 *
 * Compound collider with three cuboids:
 * - Flat base platform
 * - Two thin vertical rails along the Z edges (prevents lateral roll-off)
 *
 * @returns Three cuboid collider descriptors (base + 2 rails).
 */
export function getHalfPipeColliders(): ColliderDescriptor[] {
  return [
    // Base platform
    {
      type: 'cuboid',
      halfExtents: [1.0, 0.15, 1.0],
      position: [0, 0.15, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
    // Rail at Z = -1
    {
      type: 'cuboid',
      halfExtents: [1.0, 0.3, 0.05],
      position: [0, 0.6, -1],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
    // Rail at Z = +1
    {
      type: 'cuboid',
      halfExtents: [1.0, 0.3, 0.05],
      position: [0, 0.6, 1],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
  ];
}

/**
 * Collider for a Goal Bucket piece.
 *
 * Compound collider with physical floor + walls that contain the marble,
 * plus an interior sensor trigger that detects marble entry.
 * The dwell-timer victory logic is deferred to TRACK-007.
 *
 * Visually: base at Y=0.1 (1.8×0.2×1.8), walls from Y=0.2 to Y=0.7,
 * inset ~0.05 from edges.
 *
 * @returns 6 cuboid collider descriptors (floor + 2 Z-walls + 2 short X-walls + 1 sensor).
 * X-walls are shorter than Z-walls so the marble can roll over them to enter
 * the bucket, but is contained once inside (cannot climb back over from rest).
 */
export function getGoalBucketColliders(): ColliderDescriptor[] {
  return [
    // Physical floor
    {
      type: 'cuboid',
      halfExtents: [0.9, 0.1, 0.9],
      position: [0, 0.1, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
    // Physical front wall (Z+)
    {
      type: 'cuboid',
      halfExtents: [0.9, 0.25, 0.05],
      position: [0, 0.45, 0.95],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
    // Physical back wall (Z-)
    {
      type: 'cuboid',
      halfExtents: [0.9, 0.25, 0.05],
      position: [0, 0.45, -0.95],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
    // Short X-direction walls (lips) — low enough for the marble to roll
    // over on entry from a ramp (center Y≈0.9-1.0), but tall enough to
    // contain it once at rest on the floor (center Y≈0.7, needs Y≥1.0 to
    // clear the wall top at Y=0.5).
    {
      type: 'cuboid',
      halfExtents: [0.05, 0.15, 0.9],
      position: [0.95, 0.35, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
    {
      type: 'cuboid',
      halfExtents: [0.05, 0.15, 0.9],
      position: [-0.95, 0.35, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
    // Interior sensor trigger (inside the bucket cavity)
    // Raised to Y=0.55 so it overlaps with the marble's center position
    // (radius 0.5) when the marble rolls into the bucket interior.
    {
      type: 'cuboid',
      halfExtents: [0.7, 0.2, 0.7],
      position: [0, 0.55, 0],
      rotation: [0, 0, 0],
      sensor: true,
      restitution: 0,
    },
  ];
}

/**
 * Colliders for the Launchpad piece.
 *
 * Two-tier compound collider matching the visual mesh:
 * 1. Base platform — flat 2×2 slab at Y=[0, 0.3]
 * 2. Raised center platform — narrower 1×1 block on top at Y=[0.3, 0.8]
 *
 * During Play mode, handling is managed by the lifecycle system.
 *
 * @returns Two cuboid collider descriptors (base + raised center).
 */
export function getLaunchpadColliders(): ColliderDescriptor[] {
  return [
    // Base platform — full 2×2 area at the floor
    {
      type: 'cuboid',
      halfExtents: [1.0, 0.15, 1.0],
      position: [0, 0.15, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
    // Raised center platform — narrower 1×1 block on top of base
    {
      type: 'cuboid',
      halfExtents: [0.5, 0.25, 0.5],
      position: [0, 0.55, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
  ];
}
