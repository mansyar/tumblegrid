import { useFrame } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import { RigidBody } from '@react-three/rapier';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { useGameStore } from '@/store/useGameStore';
import {
  MARBLE_CONFIG,
  computeMarbleSpawnPosition,
} from '@/utils/physics';
import {
  computeTrailOpacity,
  recordTrailPoint,
} from '@/utils/marbleTrail';
import type { TrailPoint } from '@/utils/marbleTrail';

const MARBLE_COLOR = '#00E5FF';
const TRAIL_MAX_POINTS = 60;

/**
 * Renders the fading ribbon trail behind the marble.
 * Uses pre-allocated BufferAttribute buffers for performance.
 */
function MarbleTrail({
  rigidBodyRef,
}: {
  rigidBodyRef: { current: RapierRigidBody | null };
}) {
  const trailRef = useRef<TrailPoint[]>([]);

  // Build the Three.js Line once, outside the render cycle
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    // Pre-allocate fixed-size buffers
    const positions = new Float32Array(TRAIL_MAX_POINTS * 3);
    const colors = new Float32Array(TRAIL_MAX_POINTS * 3);
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
    });

    return new THREE.Line(geometry, material);
  }, []);

  // Update the trail geometry each frame
  useFrame(() => {
    const body = rigidBodyRef.current;
    if (!body) return;

    const translation = body.translation();
    const now = performance.now();

    trailRef.current = recordTrailPoint(
      trailRef.current,
      { x: translation.x, y: translation.y, z: translation.z },
      now,
    );

    const geometry = line.geometry;
    const pointCount = trailRef.current.length;
    const posAttr = geometry.getAttribute(
      'position',
    ) as THREE.BufferAttribute;
    const colAttr = geometry.getAttribute(
      'color',
    ) as THREE.BufferAttribute;

    for (let i = 0; i < pointCount; i++) {
      const pt = trailRef.current[i];
      const opacity = computeTrailOpacity(pt, now);

      posAttr.array[i * 3] = pt.x;
      posAttr.array[i * 3 + 1] = pt.y;
      posAttr.array[i * 3 + 2] = pt.z;

      // Cyan color that fades with opacity
      colAttr.array[i * 3] = 0;
      colAttr.array[i * 3 + 1] = 0.9 * opacity;
      colAttr.array[i * 3 + 2] = 1.0 * opacity;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    geometry.setDrawRange(0, pointCount);
  });

  return <primitive object={line} frustumCulled={false} />;
}

/**
 * Marble — dynamic sphere rigid body that represents the player's marble.
 *
 * Renders only during PLAYING / SANDBOX_PLAYING states.
 * Spawns at the launchpad position from the store's level data.
 * Drops vertically from a height offset above the launchpad.
 * Includes a fading cyan ribbon trail that follows the marble's path.
 */
export function Marble() {
  const machineState = useGameStore((s) => s.machineState);
  const launchpadPosition = useGameStore((s) => s.launchpadPosition);
  const rigidBodyRef = useRef<RapierRigidBody>(null);

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
    <group>
      <RigidBody
        ref={rigidBodyRef}
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

      {/* Fading ribbon trail that follows the marble's path */}
      <MarbleTrail rigidBodyRef={rigidBodyRef} />
    </group>
  );
}
