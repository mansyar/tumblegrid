/**
 * Pure functions that compute Rapier collider configurations for each piece type.
 *
 * Each function returns an array of ColliderDescriptor objects describing the
 * colliders needed to represent the piece in the physics simulation. The R3F
 * wrapper component consumes these descriptors to render actual Rapier colliders.
 *
 * All coordinates are in the piece's local space (before Y-axis rotation).
 */
import {
  BUMPER_RESTITUTION_ELASTIC,
  BUMPER_RESTITUTION_STATIC,
} from './physics';

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
      restitution: isStaticTerrain
        ? BUMPER_RESTITUTION_STATIC
        : BUMPER_RESTITUTION_ELASTIC,
    },
  ];
}

/**
 * Colliders for a Speed Booster piece.
 *
 * Two colliders:
 * 1. A physical floor (non-sensor) so the marble lands on it instead of falling through.
 * 2. A sensor cuboid that detects marble overlap and applies a directional impulse.
 *    The impulse direction is derived from the piece's rotation index.
 *
 * @param _rotationIndex - Not used for geometry; impulse direction is handled separately.
 * @returns Array of collider descriptors (floor + sensor).
 */
export function getSpeedBoosterColliders(
  _rotationIndex: number,
): ColliderDescriptor[] {
  return [
    {
      type: 'cuboid',
      // Physical floor — marble lands on this
      halfExtents: [1.0, 0.15, 1.0],
      position: [0, 0.15, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0,
    },
    {
      type: 'cuboid',
      // Sensor — detects overlap and applies boost impulse
      halfExtents: [0.8, 0.3, 0.8],
      position: [0, 0.45, 0],
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
 * The bucket is sunken below the grid floor, acting like a "hole" that
 * the marble falls into. All 4 walls are 1.2 units tall (taller than
 * marble diameter) with their top edge at Y=0 (ground level).
 *
 * @returns 6 cuboid collider descriptors (floor + 2 Z-walls + 2 X-walls + 1 sensor).
 */
export function getGoalBucketColliders(): ColliderDescriptor[] {
  return [
    // Physical floor — sunken below grid
    {
      type: 'cuboid',
      halfExtents: [0.9, 0.1, 0.9],
      position: [0, -1.1, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
    // Physical front wall (Z+) — top at Y=0 (ground level)
    {
      type: 'cuboid',
      halfExtents: [0.9, 0.6, 0.05],
      position: [0, -0.6, 0.95],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.1,
    },
    // Physical back wall (Z-) — top at Y=0 (ground level)
    {
      type: 'cuboid',
      halfExtents: [0.9, 0.6, 0.05],
      position: [0, -0.6, -0.95],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.1,
    },
    // X-direction walls — top at Y=0 (ground level)
    {
      type: 'cuboid',
      halfExtents: [0.05, 0.6, 0.9],
      position: [0.95, -0.6, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0,
    },
    {
      type: 'cuboid',
      halfExtents: [0.05, 0.6, 0.9],
      position: [-0.95, -0.6, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0,
    },
    // Interior sensor trigger — centered in the bucket cavity
    {
      type: 'cuboid',
      halfExtents: [0.7, 0.3, 0.7],
      position: [0, -0.6, 0],
      rotation: [0, 0, 0],
      sensor: true,
      restitution: 0,
    },
  ];
}

/**
 * Collider for the Launchpad marker.
 *
 * A single thin flat cuboid just below the ring marker surface.
 * Catches the marble when it spawns above and drops, preventing it
 * from falling through the floor at the spawn position.
 *
 * @returns One thin cuboid collider descriptor.
 */
export function getLaunchpadColliders(): ColliderDescriptor[] {
  return [
    {
      type: 'cuboid',
      halfExtents: [0.8, 0.05, 0.8],
      position: [0, 0.05, 0],
      rotation: [0, 0, 0],
      sensor: false,
      restitution: 0.3,
    },
  ];
}
