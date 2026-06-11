import { memo, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Creates a flat base geometry for the goal bucket.
 */
export function createGoalBucketBaseGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(1.8, 0.2, 1.8);
}

/**
 * Creates a wall geometry for the goal bucket sides.
 */
export function createGoalBucketWallGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(1.8, 0.5, 0.1);
}

const PASTEL_YELLOW = '#E9C46A';
const WALL_OFFSET = 0.95;

function GoalBucketInner() {
  const baseGeometry = useMemo(() => createGoalBucketBaseGeometry(), []);
  const wallGeometry = useMemo(() => createGoalBucketWallGeometry(), []);

  return (
    <group>
      {/* Base (bottom at Y=0) */}
      <mesh geometry={baseGeometry} position={[0, 0.1, 0]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Walls along Z (front/back) — sit on top of base */}
      <mesh geometry={wallGeometry} position={[0, 0.45, -WALL_OFFSET]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh geometry={wallGeometry} position={[0, 0.45, WALL_OFFSET]}>
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Walls along X (left/right) — sit on top of base */}
      <mesh
        geometry={new THREE.BoxGeometry(0.1, 0.5, 1.8)}
        position={[-WALL_OFFSET, 0.45, 0]}
      >
        <meshStandardMaterial
          color={PASTEL_YELLOW}
          emissive={PASTEL_YELLOW}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh
        geometry={new THREE.BoxGeometry(0.1, 0.5, 1.8)}
        position={[WALL_OFFSET, 0.45, 0]}
      >
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
