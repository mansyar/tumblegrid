import { memo, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Creates a flat base geometry for the half-pipe tunnel.
 * Occupies the full cell width and depth with thin height.
 */
export function createHalfPipeBaseGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(2, 0.3, 2);
}

/**
 * Creates a side rail geometry for the half-pipe tunnel.
 * Thin vertical wall along the Z axis.
 */
export function createHalfPipeRailGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(2, 0.6, 0.1);
}

const PASTEL_PURPLE = '#B39DDB';

function HalfPipeInner() {
  const baseGeometry = useMemo(() => createHalfPipeBaseGeometry(), []);
  const railGeometry = useMemo(() => createHalfPipeRailGeometry(), []);

  return (
    <group>
      <mesh geometry={baseGeometry} position={[0, 0, 0]}>
        <meshStandardMaterial color={PASTEL_PURPLE} />
      </mesh>
      <mesh geometry={railGeometry} position={[0, 0.45, -1]}>
        <meshStandardMaterial color={PASTEL_PURPLE} />
      </mesh>
      <mesh geometry={railGeometry} position={[0, 0.45, 1]}>
        <meshStandardMaterial color={PASTEL_PURPLE} />
      </mesh>
    </group>
  );
}

export const HalfPipe = memo(HalfPipeInner);
HalfPipe.displayName = 'HalfPipe';
