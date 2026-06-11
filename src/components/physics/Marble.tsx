import { RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';

import { useGameStore } from '@/store/useGameStore';
import {
  MARBLE_CONFIG,
  computeMarbleSpawnPosition,
} from '@/utils/physics';

const MARBLE_COLOR = '#00E5FF';

/**
 * Marble — dynamic sphere rigid body that represents the player's marble.
 *
 * Renders only during PLAYING / SANDBOX_PLAYING states.
 * Spawns at the launchpad position from the store's level data.
 * Drops vertically from a height offset above the launchpad.
 */
export function Marble() {
  const machineState = useGameStore((s) => s.machineState);
  const launchpadPosition = useGameStore((s) => s.launchpadPosition);

  const isPlaying =
    machineState === 'PLAYING' || machineState === 'SANDBOX_PLAYING';

  // Spawn position: directly above launchpad at a height offset
  const spawnPosition: [number, number, number] = useMemo(
    () => computeMarbleSpawnPosition(launchpadPosition),
    [launchpadPosition],
  );

  if (!isPlaying) {
    return null;
  }

  return (
    <RigidBody
      type="dynamic"
      mass={MARBLE_CONFIG.mass}
      restitution={MARBLE_CONFIG.restitution}
      friction={MARBLE_CONFIG.friction}
      linearDamping={MARBLE_CONFIG.linearDamping}
      position={spawnPosition}
      colliders="ball"
      canSleep={false}
    >
      <mesh>
        <sphereGeometry args={[MARBLE_CONFIG.radius, 24, 24]} />
        <meshStandardMaterial
          color={MARBLE_COLOR}
          emissive={MARBLE_COLOR}
          emissiveIntensity={0.8}
        />
      </mesh>
    </RigidBody>
  );
}
