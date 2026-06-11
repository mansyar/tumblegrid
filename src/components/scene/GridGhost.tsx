import { PieceFactory } from '@/components/pieces/PieceFactory';
import { useGameStore } from '@/store/useGameStore';

/**
 * GridGhost renders a semi-transparent preview of the currently
 * hovered piece at the prospective grid position.
 *
 * Reads the activeBlueprintNode from the store and renders nothing
 * when the blueprint is undefined or invalid.
 */
export function GridGhost() {
  const activeBlueprintNode = useGameStore((s) => s.activeBlueprintNode);

  if (!activeBlueprintNode || !activeBlueprintNode.valid) {
    return null;
  }

  return (
    <PieceFactory
      pieceType={activeBlueprintNode.pieceType}
      position={activeBlueprintNode.position}
      rotationIndex={activeBlueprintNode.rotationIndex}
      ghost
    />
  );
}
