import { memo, useMemo } from 'react';
import * as THREE from 'three';

const DARK_GRAY = '#555555';
const NEON_CYAN = '#00E5FF';

/**
 * Creates a flat base geometry for the launchpad.
 * Fits within a 2×2×2 grid cell.
 */
export function createLaunchpadBaseGeometry(): THREE.BoxGeometry {
  return new THREE.BoxGeometry(2, 0.3, 2);
}

/**
 * Creates a raised center platform geometry for the launchpad.
 * Sits on top of the base to form a launching pad.
 */
export function createLaunchpadCenterGeometry(): THREE.BoxGeometry {
  return new THREE.BoxGeometry(1.0, 0.5, 1.0);
}

/**
 * Creates an accented ring geometry for the launchpad's neon highlight.
 */
export function createLaunchpadRingGeometry(): THREE.TorusGeometry {
  return new THREE.TorusGeometry(0.55, 0.05, 8, 16);
}

function LaunchpadInner() {
  const baseGeometry = useMemo(() => createLaunchpadBaseGeometry(), []);
  const centerGeometry = useMemo(() => createLaunchpadCenterGeometry(), []);
  const ringGeometry = useMemo(() => createLaunchpadRingGeometry(), []);

  return (
    <group>
      {/* Base platform */}
      <mesh geometry={baseGeometry} position={[0, 0, 0]}>
        <meshStandardMaterial color={DARK_GRAY} />
      </mesh>

      {/* Raised center platform */}
      <mesh geometry={centerGeometry} position={[0, 0.4, 0]}>
        <meshStandardMaterial color={DARK_GRAY} />
      </mesh>

      {/* Neon accent ring on top */}
      <mesh
        geometry={ringGeometry}
        position={[0, 0.7, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color={NEON_CYAN}
          emissive={NEON_CYAN}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

export const Launchpad = memo(LaunchpadInner);
Launchpad.displayName = 'Launchpad';
