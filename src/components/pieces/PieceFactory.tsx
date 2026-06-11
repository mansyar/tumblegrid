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
  selected?: boolean;
}

const GHOST_OPACITY = 0.35;
const SELECTION_COLOR = '#FFD700';
const SELECTION_INTENSITY = 0.5;

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
  selected = false,
}: PieceFactoryProps) {
  const groupRef = useRef<Group>(null);
  const originalEmissiveRef = useRef<
    Map<THREE.Mesh, { color: THREE.Color; intensity: number }>
  >(new Map());
  const PieceComponent = PIECE_MAP[pieceType];
  const rotationY = (Math.PI / 2) * rotationIndex;

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const originalMap = originalEmissiveRef.current;

    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;

        // Save original emissive values on first encounter
        if (!originalMap.has(child)) {
          originalMap.set(child, {
            color: material.emissive.clone(),
            intensity: material.emissiveIntensity,
          });
        }

        const savedEmissive = originalMap.get(child);
        if (!savedEmissive) return;

        // Ghost mode overrides opacity/transparency
        material.transparent = ghost;
        material.opacity = ghost ? GHOST_OPACITY : 1;

        // Selection glow: additive emissive highlight
        if (selected) {
          material.emissive = new THREE.Color(SELECTION_COLOR);
          material.emissiveIntensity = SELECTION_INTENSITY;
        } else {
          material.emissive.copy(savedEmissive.color);
          material.emissiveIntensity = savedEmissive.intensity;
        }

        material.needsUpdate = true;
      }
    });
  }, [ghost, selected]);

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      <PieceComponent />
    </group>
  );
}
