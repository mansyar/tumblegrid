import { useGameStore } from '@/store/useGameStore';
import { computeTrajectoryWaypoints } from '@/utils/trajectory';
import { useEffect } from 'react';

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
  const updateTrajectoryCache = useGameStore((s) => s.updateTrajectoryCache);

  useEffect(() => {
    const isBuilding =
      machineState === 'BUILDING' || machineState === 'SANDBOX_BUILDING';

    if (
      !isBuilding ||
      !activeBlueprintNode ||
      !activeBlueprintNode.valid ||
      !selectedBlueprintType
    ) {
      updateTrajectoryCache('preview', []);
      return;
    }

    const waypoints = computeTrajectoryWaypoints(
      placedPieces,
      activeBlueprintNode.position,
      selectedBlueprintType,
      selectedPieceId ?? undefined,
    );

    updateTrajectoryCache('preview', waypoints);
  }, [
    activeBlueprintNode,
    placedPieces,
    selectedPieceId,
    machineState,
    selectedBlueprintType,
    updateTrajectoryCache,
  ]);
}
