import type { PieceType } from '@/store/types';
import { applyPieceEffects } from '@/utils/pieceEffects';
import { type FC, memo, useLayoutEffect, useRef } from 'react';
import type { Group } from 'three';
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
 * Supports ghost mode for preview (semi-transparent rendering)
 * and selection highlight via extracted pure logic.
 */
function PieceFactoryInner({
  pieceType,
  position,
  rotationIndex = 0,
  ghost = false,
  selected = false,
}: PieceFactoryProps) {
  const groupRef = useRef<Group>(null);
  const originalEmissiveRef = useRef(new Map());
  const PieceComponent = PIECE_MAP[pieceType];
  const rotationY = (Math.PI / 2) * rotationIndex;

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    applyPieceEffects(group, ghost, selected, originalEmissiveRef.current);
  }, [ghost, selected]);

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      <PieceComponent />
    </group>
  );
}

export const PieceFactory = memo(PieceFactoryInner);
PieceFactory.displayName = 'PieceFactory';
