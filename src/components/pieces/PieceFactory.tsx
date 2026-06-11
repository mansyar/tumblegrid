import type { PieceType } from '@/store/types';
import { type FC, useLayoutEffect, useRef } from 'react';
import type { Group } from 'three';
import * as THREE from 'three';
import { BumperPad } from './BumperPad';
import { GoalBucket } from './GoalBucket';
import { HalfPipe } from './HalfPipe';
import { SpeedBooster } from './SpeedBooster';
import { StraightRamp } from './StraightRamp';

export interface PieceFactoryProps {
  pieceType: PieceType;
  position?: [number, number, number];
  rotationIndex?: 0 | 1 | 2 | 3;
  ghost?: boolean;
}

const GHOST_OPACITY = 0.35;

/**
 * Maps each PieceType to its corresponding mesh component.
 * Exported for testability.
 */
export const PIECE_MAP: Record<PieceType, FC> = {
  straight_ramp: StraightRamp,
  speed_booster: SpeedBooster,
  bumper_pad: BumperPad,
  half_pipe: HalfPipe,
  goal_bucket: GoalBucket,
} as const;

/**
 * Type-dispatching wrapper component.
 * Renders the correct piece mesh based on pieceType prop.
 * Supports ghost mode for preview (semi-transparent rendering).
 */
export function PieceFactory({
  pieceType,
  position,
  rotationIndex = 0,
  ghost = false,
}: PieceFactoryProps) {
  const groupRef = useRef<Group>(null);
  const PieceComponent = PIECE_MAP[pieceType];
  const rotationY = (Math.PI / 2) * rotationIndex;

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        material.transparent = ghost;
        material.opacity = ghost ? GHOST_OPACITY : 1;
        material.needsUpdate = true;
      }
    });
  }, [ghost]);

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      <PieceComponent />
    </group>
  );
}
