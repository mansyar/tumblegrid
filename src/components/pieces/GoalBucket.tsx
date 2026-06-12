import { memo, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Creates a flat base geometry for the goal bucket.
 * The base is sunken below the grid floor (centered at Y=-1.1).
 */
export function createGoalBucketBaseGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(1.8, 0.2, 1.8);
}

/**
 * Creates a wall geometry for the goal bucket sides.
 * Walls are 1.2 units tall with top at Y=0 (ground level).
 */
export function createGoalBucketWallGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(1.8, 1.2, 0.1);
}

/**
 * Creates a wall geometry for the goal bucket entry sides (X-direction).
 * Same height as Z-walls (1.2 units) with top at Y=0 (ground level).
 */
export function createGoalBucketLipGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(0.1, 1.2, 1.8);
}

const PASTEL_YELLOW = '#E9C46A';
const WALL_OFFSET = 0.95;

function GoalBucketInner() {
  const baseGeometry = useMemo(() => createGoalBucketBaseGeometry(), []);
  const wallGeometry = useMemo(() => createGoalBucketWallGeometry(), []);
  const lipGeometry = useMemo(() => createGoalBucketLipGeometry(), []);

  return (
    <group>
      {/* Base (sunken: bottom at Y=-1.2, top at Y=-1.0) */}
      <mesh geometry={baseGeometry} position={[0, -1.1, 0]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Walls along Z (front/back) — top at Y=0 (ground level) */}
      <mesh geometry={wallGeometry} position={[0, -0.6, -WALL_OFFSET]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh geometry={wallGeometry} position={[0, -0.6, WALL_OFFSET]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Walls along X (entry sides) — same height, top at Y=0 */}
      <mesh geometry={lipGeometry} position={[-WALL_OFFSET, -0.6, 0]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh geometry={lipGeometry} position={[WALL_OFFSET, -0.6, 0]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}

export const GoalBucket = memo(GoalBucketInner);
GoalBucket.displayName = 'GoalBucket';
