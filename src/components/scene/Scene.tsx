import { PieceFactory } from '@/components/pieces/PieceFactory';
import { GridFloor } from '@/components/scene/GridFloor';
import { GridGhost } from '@/components/scene/GridGhost';
import { useCamera } from '@/hooks/useCamera';
import { useGridInteraction } from '@/hooks/useGridInteraction';
import type { PieceType } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';
import { OrbitControls } from '@react-three/drei';

/**
 * Determines the first piece type with available inventory.
 * Returns null if no inventory is available (e.g., in PLAYING state).
 */
function getSelectedPieceType(
  inventory: Record<PieceType, number>,
  machineState: string,
): PieceType | null {
  if (machineState !== 'BUILDING' && machineState !== 'SANDBOX_BUILDING') {
    return null;
  }

  const available = (Object.entries(inventory) as [PieceType, number][]).find(
    ([_, count]) => count > 0,
  );

  return available?.[0] ?? null;
}

export function Scene() {
  const { controlsRef } = useCamera();

  const placedPieces = useGameStore((s) => s.placedPieces);
  const inventory = useGameStore((s) => s.inventory);
  const machineState = useGameStore((s) => s.machineState);

  const selectedPieceType = getSelectedPieceType(inventory, machineState);

  useGridInteraction(selectedPieceType);

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
        />
      ))}

      {/* Ghost Preview */}
      <GridGhost />

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
