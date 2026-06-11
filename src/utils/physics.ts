import type { MachineState } from '@/store/types';

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
