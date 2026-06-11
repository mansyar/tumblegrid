import { Physics } from '@react-three/rapier';
import type { ReactNode } from 'react';

import { FailDetector } from '@/components/physics/FailDetector';
import { useGameStore } from '@/store/useGameStore';
import { FIXED_TIMESTEP, GRAVITY, getPhysicsPaused } from '@/utils/physics';

interface PhysicsWorldProps {
  children: ReactNode;
}

/**
 * Rapier Physics wrapper that controls simulation based on game state.
 *
 * - During PLAYING / SANDBOX_PLAYING: physics simulation runs.
 * - During BUILD / SANDBOX_BUILD / LEVEL_CLEARED: physics is paused (world exists but inert).
 * - Uses fixed timestep (1/60s) for deterministic behavior.
 * - Includes FailDetector to auto-stop when marble falls off the grid.
 */
export function PhysicsWorld({ children }: PhysicsWorldProps) {
  const machineState = useGameStore((s) => s.machineState);
  const paused = getPhysicsPaused(machineState);

  return (
    <Physics
      gravity={GRAVITY}
      timeStep={FIXED_TIMESTEP}
      paused={paused}
      debug={false}
    >
      {children}
      <FailDetector />
    </Physics>
  );
}
