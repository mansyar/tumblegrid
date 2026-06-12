import { useAudio } from '@/hooks/useAudio';
import type { PieceType, PlacedPiece } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';
import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Types ────────────────────────────────────────────────────────────

export interface GridInteractionResult {
  hoveredCell: [number, number, number] | null;
  isValid: boolean;
}

// ─── Pure Utility Functions (exported for testability) ────────────────

/**
 * Snaps a world-space Vector3 to the nearest integer grid coordinate.
 * Grid coordinates correspond to cell indices in the game grid.
 */
export function snapToGrid(point: THREE.Vector3): [number, number, number] {
  return [
    Math.round(point.x) || 0,
    Math.round(point.y) || 0,
    Math.round(point.z) || 0,
  ];
}

/**
 * Checks if a grid position is within the grid bounds.
 * grid = [width, depth, height], position = [x, y, z].
 * - x maps to grid[0] (width)
 * - y maps to grid[2] (height)
 * - z maps to grid[1] (depth)
 */
export function isInBounds(
  position: [number, number, number],
  grid: [number, number, number],
): boolean {
  return (
    position[0] >= 0 &&
    position[0] < grid[0] &&
    position[1] >= 0 &&
    position[1] < grid[2] &&
    position[2] >= 0 &&
    position[2] < grid[1]
  );
}

/**
 * Checks if a grid cell is already occupied by a placed piece.
 * Pieces are uniquely identified by their (x, y, z) position.
 */
export function isCellOccupied(
  position: [number, number, number],
  placedPieces: PlacedPiece[],
): boolean {
  return placedPieces.some(
    (p) =>
      p.position[0] === position[0] &&
      p.position[1] === position[1] &&
      p.position[2] === position[2],
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────

/**
 * Hook for grid interaction via raycasting.
 *
 * Casts a ray from the camera through the normalized pointer position,
 * intersects with the Y=0 plane, snaps to grid coordinates, checks
 * bounds and occupancy, and updates the store's activeBlueprintNode.
 *
 * Listens to pointermove and click events on the canvas element.
 *
 * @param selectedPieceType - The currently selected piece type, or null
 *   if no piece is selected.
 * @returns The hovered grid cell and whether placement is valid.
 */
export function useGridInteraction(
  selectedPieceType: PieceType | null,
): GridInteractionResult {
  const { camera, gl, pointer } = useThree();
  const raycasterRef = useRef(new THREE.Raycaster());
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  const placedPieces = useGameStore((s) => s.placedPieces);
  const grid = useGameStore((s) => s.grid);
  const updateActiveBlueprint = useGameStore((s) => s.updateActiveBlueprint);
  const placePiece = useGameStore((s) => s.placePiece);
  const { playUIClick } = useAudio();

  const hoveredCellRef = useRef<[number, number, number] | null>(null);
  const isValidRef = useRef(false);

  const handlePointerMove = useCallback(() => {
    if (!selectedPieceType) {
      if (hoveredCellRef.current !== null) {
        hoveredCellRef.current = null;
        isValidRef.current = false;
        updateActiveBlueprint(undefined);
      }
      return;
    }

    // Cast ray from camera through normalized pointer coordinates
    raycasterRef.current.setFromCamera(pointer, camera);

    // Intersect with Y=0 plane
    const intersectionPoint = new THREE.Vector3();
    const intersects = raycasterRef.current.ray.intersectPlane(
      planeRef.current,
      intersectionPoint,
    );

    if (!intersects) {
      if (hoveredCellRef.current !== null) {
        hoveredCellRef.current = null;
        isValidRef.current = false;
        updateActiveBlueprint(undefined);
      }
      return;
    }

    // Snap to grid
    const gridPosition = snapToGrid(intersectionPoint);
    const inBounds = isInBounds(gridPosition, grid);
    const occupied = isCellOccupied(gridPosition, placedPieces);
    const valid = inBounds && !occupied;

    hoveredCellRef.current = gridPosition;
    isValidRef.current = valid;

    updateActiveBlueprint(
      inBounds
        ? {
            pieceType: selectedPieceType,
            position: gridPosition,
            rotationIndex: 0,
            valid,
          }
        : undefined,
    );
  }, [
    selectedPieceType,
    camera,
    pointer,
    grid,
    placedPieces,
    updateActiveBlueprint,
  ]);

  const handleClick = useCallback(() => {
    if (!selectedPieceType || !hoveredCellRef.current || !isValidRef.current) {
      return;
    }

    playUIClick('place');
    placePiece(selectedPieceType, hoveredCellRef.current, 0);
  }, [selectedPieceType, placePiece, playUIClick]);

  useEffect(() => {
    const canvas = gl.domElement;

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [gl.domElement, handlePointerMove, handleClick]);

  return {
    hoveredCell: hoveredCellRef.current,
    isValid: isValidRef.current,
  };
}
