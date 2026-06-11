import { useGameStore } from '@/store/useGameStore';
import { useCallback, useEffect } from 'react';

/**
 * Hook for piece rotation via keyboard (R key).
 *
 * Handles two scenarios:
 * 1. A placed piece is selected → rotates the placed piece via
 *    store.rotatePiece() (cycling 0→1→2→3→0).
 * 2. No piece selected but ghost preview active → rotates the
 *    Active Blueprint Node via store.updateActiveBlueprint().
 *
 * Selected piece rotation takes priority over blueprint rotation
 * when both are active.
 */
export function usePieceRotation(): void {
  const selectedPieceId = useGameStore((s) => s.selectedPieceId);
  const activeBlueprintNode = useGameStore((s) => s.activeBlueprintNode);
  const rotatePiece = useGameStore((s) => s.rotatePiece);
  const updateActiveBlueprint = useGameStore((s) => s.updateActiveBlueprint);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'r' && e.key !== 'R') return;

      // Priority 1: Rotate selected placed piece
      if (selectedPieceId) {
        rotatePiece(selectedPieceId);
        return;
      }

      // Priority 2: Rotate ghost preview (pre-placement)
      if (activeBlueprintNode) {
        const newRotation = ((activeBlueprintNode.rotationIndex + 1) % 4) as
          | 0
          | 1
          | 2
          | 3;
        updateActiveBlueprint({
          ...activeBlueprintNode,
          rotationIndex: newRotation,
        });
      }
    },
    [selectedPieceId, activeBlueprintNode, rotatePiece, updateActiveBlueprint],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
