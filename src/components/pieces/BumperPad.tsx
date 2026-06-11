import { memo, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Creates a thin wall geometry for a bumper pad.
 * The wall occupies 1 grid cell (2×2×2 world units) centered at origin.
 * The wall is thin in the Z axis, wide in X, full height in Y.
 */
export function createBumperPadGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(1.8, 2, 0.3);
}

const PASTEL_ORANGE = '#F4A261';

function BumperPadInner() {
  const geometry = useMemo(() => createBumperPadGeometry(), []);

  return (
    <mesh geometry={geometry} position={[0, 1, 0]}>
      <meshStandardMaterial color={PASTEL_ORANGE} />
    </mesh>
  );
}

export const BumperPad = memo(BumperPadInner);
BumperPad.displayName = 'BumperPad';
