import { snapToGrid } from '@/hooks/useGridInteraction';
import { useGameStore } from '@/store/useGameStore';
import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Hook for piece selection via click interaction.
 *
 * On click, raycasts to the Y=0 plane, snaps to grid,
 * and determines if the click hit a placed piece:
 * - Hitting a non-selected piece → selectPiece(id)
 * - Hitting the already-selected piece → removePiece(id)
 * - Hitting empty space → clearSelection()
 *
 * This hook runs alongside useGridInteraction (which handles
 * ghost preview + placement). Both click handlers are called;
 * store-level checks (overlap, inventory) prevent double-actions.
 */
export function usePieceSelection(): void {
  const { camera, gl, pointer } = useThree();
  const raycasterRef = useRef(new THREE.Raycaster());
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  const placedPieces = useGameStore((s) => s.placedPieces);
  const selectedPieceId = useGameStore((s) => s.selectedPieceId);
  const selectPiece = useGameStore((s) => s.selectPiece);
  const clearSelection = useGameStore((s) => s.clearSelection);
  const removePiece = useGameStore((s) => s.removePiece);

  const handleClick = useCallback(() => {
    // Cast ray from camera through normalized pointer coordinates
    raycasterRef.current.setFromCamera(pointer, camera);

    // Intersect with Y=0 plane
    const intersectionPoint = new THREE.Vector3();
    const intersects = raycasterRef.current.ray.intersectPlane(
      planeRef.current,
      intersectionPoint,
    );

    if (!intersects) return;

    // Snap to grid to find which cell was clicked
    const clickedGrid = snapToGrid(intersectionPoint);

    // Check if the clicked grid cell contains a placed piece
    const clickedPiece = placedPieces.find(
      (p) =>
        p.position[0] === clickedGrid[0] &&
        p.position[1] === clickedGrid[1] &&
        p.position[2] === clickedGrid[2],
    );

    if (clickedPiece) {
      if (selectedPieceId === clickedPiece.id) {
        // Clicked on the already selected piece → remove it
        removePiece(clickedPiece.id);
      } else {
        // Clicked on a different piece → select it
        selectPiece(clickedPiece.id);
      }
    } else {
      // Clicked on empty space → clear selection
      clearSelection();
    }
  }, [
    camera,
    pointer,
    placedPieces,
    selectedPieceId,
    selectPiece,
    clearSelection,
    removePiece,
  ]);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('click', handleClick);
    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [gl.domElement, handleClick]);
}
