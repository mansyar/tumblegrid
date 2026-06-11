import { memo, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Creates a flat track geometry for a speed booster.
 * Occupies 1 grid cell (2×2×2 world units) centered at origin.
 * Thin platform with full horizontal coverage.
 */
export function createSpeedBoosterGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(2, 0.3, 2);
}

const PASTEL_GREEN = '#A8D5A2';

function SpeedBoosterInner() {
  const geometry = useMemo(() => createSpeedBoosterGeometry(), []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={PASTEL_GREEN} />
    </mesh>
  );
}

export const SpeedBooster = memo(SpeedBoosterInner);
SpeedBooster.displayName = 'SpeedBooster';
