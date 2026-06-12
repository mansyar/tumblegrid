import type { MachineState } from '@/store/types';

/** Height above launchpad at which the marble spawns. */
export const SPAWN_HEIGHT_OFFSET = 3;

/** Gravity vector pointing downward (Y-axis). */
export const GRAVITY: [number, number, number] = [0, -9.81, 0];

/** Fixed timestep for deterministic physics simulation (60 FPS). */
export const FIXED_TIMESTEP = 1 / 60;

/** Physical properties for the marble sphere rigid body. */
export const MARBLE_CONFIG = {
  mass: 1,
  restitution: 0.3,
  friction: 0.5,
  linearDamping: 0.1,
  radius: 0.5,
} as const;

/**
 * Creates a physics configuration object for the Rapier Physics wrapper.
 */
export function createPhysicsConfig() {
  return {
    gravity: GRAVITY,
    timeStep: FIXED_TIMESTEP,
  };
}

/**
 * Determines whether the physics simulation should be paused
 * based on the current machine state.
 */
export function getPhysicsPaused(machineState: MachineState): boolean {
  return machineState !== 'PLAYING' && machineState !== 'SANDBOX_PLAYING';
}

/**
 * Computes the marble spawn position based on the launchpad position.
 * The marble spawns at a height offset above the launchpad so it drops
 * onto the launchpad surface under gravity.
 */
export function computeMarbleSpawnPosition(
  launchpadPosition: [number, number, number],
): [number, number, number] {
  return [
    launchpadPosition[0],
    launchpadPosition[1] + SPAWN_HEIGHT_OFFSET,
    launchpadPosition[2],
  ];
}

/**
 * Initial impulse applied to the marble when it spawns on the launchpad.
 * Set to zero — the marble drops straight down onto the launchpad collider
 * and sits idle. The player must place ramps or interact to move it.
 */
export const INITIAL_MARBLE_IMPULSE: [number, number, number] = [0, 0, 0];

/**
 * Returns the initial impulse applied to the marble on spawn.
 * Can be customized per-level if needed in the future.
 */
export function getInitialMarbleImpulse(): [number, number, number] {
  return [...INITIAL_MARBLE_IMPULSE];
}

/** Impulse magnitude applied to the marble by a Speed Booster. */
export const BOOST_FORCE = 8;

/**
 * Direction vectors for speed booster impulse, indexed by rotation.
 *
 * - rot 0: +X (forward along ramp descent)
 * - rot 1: +Z
 * - rot 2: -X
 * - rot 3: -Z
 */
const BOOST_DIRECTIONS: Array<[number, number, number]> = [
  [1, 0, 0],
  [0, 0, 1],
  [-1, 0, 0],
  [0, 0, -1],
];

/**
 * Returns the impulse direction vector for a speed booster
 * based on its rotation index.
 */
export function getBoostDirection(
  rotationIndex: number,
): [number, number, number] {
  return BOOST_DIRECTIONS[rotationIndex] ?? [1, 0, 0];
}

/**
 * Returns the full impulse vector (direction × force) for a speed booster.
 * The Y component is kept at 0 to produce a purely horizontal boost.
 */
export function getBoostImpulse(
  rotationIndex: number,
): [number, number, number] {
  const dir = getBoostDirection(rotationIndex);
  return [dir[0] * BOOST_FORCE, 0, dir[2] * BOOST_FORCE];
}
