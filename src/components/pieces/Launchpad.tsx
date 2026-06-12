import { memo, useMemo } from 'react';
import * as THREE from 'three';

const NEON_CYAN = '#00E5FF';

/**
 * Creates a glowing ring geometry for the launchpad marker.
 * A flat horizontal ring lying flush with the grid floor.
 * Marble spawns from the center of this ring.
 */
export function createLaunchpadRingGeometry(): THREE.TorusGeometry {
  return new THREE.TorusGeometry(0.75, 0.06, 8, 32);
}

interface LaunchpadProps {
  position?: [number, number, number];
}

function LaunchpadInner({ position }: LaunchpadProps) {
  const ringGeometry = useMemo(() => createLaunchpadRingGeometry(), []);

  return (
    <group position={position}>
      {/* Glowing ring marker — sits flat on the grid floor */}
      <mesh
        geometry={ringGeometry}
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color={NEON_CYAN}
          emissive={NEON_CYAN}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export const Launchpad = memo(LaunchpadInner);
Launchpad.displayName = 'Launchpad';
