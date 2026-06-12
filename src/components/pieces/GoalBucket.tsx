import { memo, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Creates a flat base geometry for the goal bucket.
 * The base is sunken below the grid floor (centered at Y=-0.4).
 */
export function createGoalBucketBaseGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(1.8, 0.2, 1.8);
}

/**
 * Creates a wall geometry for the goal bucket sides.
 * Walls extend from Y=-0.5 to Y=0.5 (full height, ground level).
 */
export function createGoalBucketWallGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(1.8, 1.0, 0.1);
}

/**
 * Creates a short lip geometry for the goal bucket entry sides.
 * Lips are 0.5 units tall (minimum: half marble diameter).
 */
export function createGoalBucketLipGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(0.1, 0.5, 1.8);
}

const PASTEL_YELLOW = '#E9C46A';
const WALL_OFFSET = 0.95;

function GoalBucketInner() {
  const baseGeometry = useMemo(() => createGoalBucketBaseGeometry(), []);
  const wallGeometry = useMemo(() => createGoalBucketWallGeometry(), []);
  const lipGeometry = useMemo(() => createGoalBucketLipGeometry(), []);

  return (
    <group>
      {/* Base (sunken: bottom at Y=-0.5, top at Y=-0.3) */}
      <mesh geometry={baseGeometry} position={[0, -0.4, 0]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Walls along Z (front/back) — full height from Y=-0.5 to Y=0.5 */}
      <mesh geometry={wallGeometry} position={[0, 0, -WALL_OFFSET]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh geometry={wallGeometry} position={[0, 0, WALL_OFFSET]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Lips along X (entry sides) — short, top at Y=-0.1 */}
      <mesh geometry={lipGeometry} position={[-WALL_OFFSET, -0.3, 0]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh geometry={lipGeometry} position={[WALL_OFFSET, -0.3, 0]}>
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
