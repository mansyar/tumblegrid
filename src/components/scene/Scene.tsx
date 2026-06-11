import { Marble } from '@/components/physics/Marble';
import { PieceCollider } from '@/components/physics/PieceCollider';
import { PieceFactory } from '@/components/pieces/PieceFactory';
import { GridFloor } from '@/components/scene/GridFloor';
import { GridGhost } from '@/components/scene/GridGhost';
import { TrajectoryLine } from '@/components/scene/TrajectoryLine';
import { useCamera } from '@/hooks/useCamera';
import { useGoalDetector } from '@/hooks/useGoalDetector';
import { useGridInteraction } from '@/hooks/useGridInteraction';
import { usePieceRotation } from '@/hooks/usePieceRotation';
import { usePieceSelection } from '@/hooks/usePieceSelection';
import { useTrajectoryPreview } from '@/hooks/useTrajectoryPreview';
import { getLevelByIndex } from '@/levels';
import { useGameStore } from '@/store/useGameStore';
import { getFirstAvailablePieceType } from '@/utils/inventory';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';

export function Scene() {
  const { controlsRef } = useCamera();

  const placedPieces = useGameStore((s) => s.placedPieces);
  const inventory = useGameStore((s) => s.inventory);
  const machineState = useGameStore((s) => s.machineState);
  const selectedPieceId = useGameStore((s) => s.selectedPieceId);
  const selectedBlueprintType = useGameStore((s) => s.selectedBlueprintType);
  const loadLevel = useGameStore((s) => s.loadLevel);

  // Auto-load first campaign level on initial mount
  const loadedRef = useRef(false);
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const level = getLevelByIndex(0);
    if (level) {
      loadLevel(level);
    }
  }, [loadLevel]);

  // When a piece is selected, hide the ghost preview (selection mode)
  // Otherwise, use the selectedBlueprintType from the inventory panel,
  // falling back to the first available inventory type.
  const selectedPieceType =
    selectedPieceId !== undefined
      ? null
      : (selectedBlueprintType ??
        getFirstAvailablePieceType(inventory, machineState));

  useGridInteraction(selectedPieceType);
  usePieceSelection();
  usePieceRotation();
  useTrajectoryPreview();
  useGoalDetector();

  return (
    <>
      {/* Key Light - Primary directional light for main illumination */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill Light - Softer light to reduce harsh shadows */}
      <ambientLight intensity={0.4} />

      {/* Back Light - Rim/edge light for depth separation */}
      <pointLight position={[0, 10, -10]} intensity={0.8} color="#ffffff" />

      {/* Grid Floor */}
      <GridFloor />

      {/* Placed Pieces */}
      {placedPieces.map((piece) => (
        <PieceFactory
          key={piece.id}
          pieceType={piece.type}
          position={piece.position}
          rotationIndex={piece.rotationIndex}
          selected={piece.id === selectedPieceId}
        />
      ))}

      {/* Ghost Preview — only shown when no piece is selected */}
      {selectedPieceId === undefined && <GridGhost />}

      {/* Trajectory Preview — dotted line from nearest piece to hovered cell */}
      <TrajectoryLine />

      {/* Marble — dynamic sphere rigid body, only renders during Play */}
      <Marble />

      {/* Piece Colliders — Rapier colliders for all placed pieces during Play */}
      <PieceCollider />

      {/* OrbitControls with clamps and damping */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.1}
        minPolarAngle={Math.PI / 18}
        maxPolarAngle={(Math.PI * 4) / 9}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}
