import { PIECE_DIRECTIONS } from '@/constants/pieceMeta';
import type { PieceType, PlacedPiece } from '@/store/types';

const HALF_CELL = 1;

/**
 * Find the placed piece whose position is closest to `target` by Euclidean
 * distance (ignoring the Y-axis for horizontal proximity).
 */
export function findNearestPiece(
  pieces: PlacedPiece[],
  target: [number, number, number],
): PlacedPiece | undefined {
  if (pieces.length === 0) return undefined;

  let nearest: PlacedPiece | undefined;
  let minDist = Number.POSITIVE_INFINITY;

  for (const piece of pieces) {
    const dx = piece.position[0] - target[0];
    const dz = piece.position[2] - target[2];
    const dist = dx * dx + dz * dz;
    if (dist < minDist) {
      minDist = dist;
      nearest = piece;
    }
  }

  return nearest;
}

/**
 * Compute a short chain of estimated waypoints for the trajectory preview.
 *
 * Follows the TDD specification:
 *   1. Find nearest placed piece to hovered cell (or use selectedPieceId).
 *   2. Compute waypoints: source exit face → (empty cells) → target entry face → target exit face.
 *   3. Returns [] when no placed pieces exist or hovered cell is null.
 */
export function computeTrajectoryWaypoints(
  placedPieces: PlacedPiece[],
  hoveredPosition: [number, number, number] | null,
  selectedPieceType: PieceType,
  selectedPieceId?: string,
): [number, number, number][] {
  if (!hoveredPosition || placedPieces.length === 0) return [];

  let sourcePiece: PlacedPiece | undefined;
  if (selectedPieceId) {
    sourcePiece = placedPieces.find((p) => p.id === selectedPieceId);
  }
  if (!sourcePiece) {
    sourcePiece = findNearestPiece(placedPieces, hoveredPosition);
  }
  if (!sourcePiece) return [];

  const sourceDirs = PIECE_DIRECTIONS[sourcePiece.type][sourcePiece.rotationIndex];
  const targetDirs = PIECE_DIRECTIONS[selectedPieceType][0];

  const sourceExit: [number, number, number] = [
    sourcePiece.position[0] + sourceDirs.exit[0] * HALF_CELL,
    sourcePiece.position[1] + sourceDirs.exit[1] * HALF_CELL,
    sourcePiece.position[2] + sourceDirs.exit[2] * HALF_CELL,
  ];

  const targetEntry: [number, number, number] = [
    hoveredPosition[0] + targetDirs.entry[0] * HALF_CELL,
    hoveredPosition[1] + targetDirs.entry[1] * HALF_CELL,
    hoveredPosition[2] + targetDirs.entry[2] * HALF_CELL,
  ];

  const targetExit: [number, number, number] = [
    hoveredPosition[0] + targetDirs.exit[0] * HALF_CELL,
    hoveredPosition[1] + targetDirs.exit[1] * HALF_CELL,
    hoveredPosition[2] + targetDirs.exit[2] * HALF_CELL,
  ];

  const waypoints: [number, number, number][] = [sourceExit];

  // Add intermediate cell centers along the dominant axis between source and target
  const dx = Math.sign(hoveredPosition[0] - sourcePiece.position[0]);
  const dz = Math.sign(hoveredPosition[2] - sourcePiece.position[2]);
  const cellGapX = Math.abs(hoveredPosition[0] - sourcePiece.position[0]) / 2;
  const cellGapZ = Math.abs(hoveredPosition[2] - sourcePiece.position[2]) / 2;
  const cellGap = Math.max(cellGapX, cellGapZ);

  for (let i = 1; i < cellGap; i++) {
    waypoints.push([
      sourcePiece.position[0] + dx * 2 * i,
      sourcePiece.position[1],
      sourcePiece.position[2] + dz * 2 * i,
    ]);
  }

  // Add target entry if different from last point
  const last = waypoints[waypoints.length - 1];
  if (!vecEq(last, targetEntry)) {
    waypoints.push(targetEntry);
  }

  // Add target exit if different from entry
  if (!vecEq(targetEntry, targetExit)) {
    waypoints.push(targetExit);
  }

  return waypoints;
}

function vecEq(
  a: [number, number, number],
  b: [number, number, number],
): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
