import type { PieceType } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';
import { computeTrajectoryWaypoints } from '@/utils/trajectory';
import { useEffect } from 'react';

/**
 * Determines the first piece type with available inventory.
 * Matches the fallback logic in Scene.tsx's getSelectedPieceType.
 */
function getFirstAvailableType(
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

/**
 * Reactive hook that computes trajectory preview waypoints whenever the
 * hover state, placed pieces, or mode changes.
 *
 * Writes waypoints to `trajectoryPreviewCache` (key: 'preview') or clears
 * the cache when the preview should be hidden (Play Mode, no hover, etc.).
 */
export function useTrajectoryPreview() {
  const activeBlueprintNode = useGameStore((s) => s.activeBlueprintNode);
  const placedPieces = useGameStore((s) => s.placedPieces);
  const selectedPieceId = useGameStore((s) => s.selectedPieceId);
  const machineState = useGameStore((s) => s.machineState);
  const selectedBlueprintType = useGameStore((s) => s.selectedBlueprintType);
  const inventory = useGameStore((s) => s.inventory);
  const updateTrajectoryCache = useGameStore((s) => s.updateTrajectoryCache);

  useEffect(() => {
    const isBuilding =
      machineState === 'BUILDING' || machineState === 'SANDBOX_BUILDING';

    if (!isBuilding || !activeBlueprintNode || !activeBlueprintNode.valid) {
      updateTrajectoryCache('preview', []);
      return;
    }

    // Fall back to first available inventory type if nothing is selected
    // in the inventory panel (matching Scene.tsx's getSelectedPieceType).
    const pieceType =
      selectedBlueprintType ?? getFirstAvailableType(inventory, machineState);

    if (!pieceType) {
      updateTrajectoryCache('preview', []);
      return;
    }

    const waypoints = computeTrajectoryWaypoints(
      placedPieces,
      activeBlueprintNode.position,
      pieceType,
      selectedPieceId ?? undefined,
    );

    updateTrajectoryCache('preview', waypoints);
  }, [
    activeBlueprintNode,
    placedPieces,
    selectedPieceId,
    machineState,
    selectedBlueprintType,
    inventory,
    updateTrajectoryCache,
  ]);
}
