import { memo, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Creates a wedge geometry for a straight ramp.
 * The wedge occupies a 2×2×2 cell centered at origin.
 * For the base rotation (0), the ramp descends from Y=1 at X=-1 to Y=-1 at X=1,
 * creating a descending slope with exit in the +X direction.
 */
export function createRampGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const positionAttribute = geometry.attributes.position;
  const positions = positionAttribute.array as Float32Array;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];

    // Modify top-half vertices (y > 0) to create a slope
    // At X=-1: full height (y=1), at X=1: bottom (y=-1)
    if (y > 0) {
      positions[i + 1] = -x;
    }
  }

  geometry.computeVertexNormals();
  return geometry;
}

const PASTEL_BLUE = '#7EC8E3';

function StraightRampInner() {
  const geometry = useMemo(() => createRampGeometry(), []);

  return (
    <mesh geometry={geometry} position={[0, 1, 0]}>
      <meshStandardMaterial color={PASTEL_BLUE} />
    </mesh>
  );
}

export const StraightRamp = memo(StraightRampInner);
StraightRamp.displayName = 'StraightRamp';
