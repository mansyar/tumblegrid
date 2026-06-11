import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as THREE from 'three';
import type { PlacedPiece } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';

// ─── Pure function imports ────────────────────────────────────────────
import {
  snapToGrid,
  isInBounds,
  isCellOccupied,
  type GridRaycastResult,
  raycastToGrid,
  useGridInteraction,
} from '@/hooks/useGridInteraction';

// ─── Mocks ────────────────────────────────────────────────────────────
const mockPlacePiece = vi.fn();
const mockUpdateActiveBlueprint = vi.fn();

vi.mock('@/store/useGameStore', () => ({
  useGameStore: vi.fn(),
}));

const mockCamera = {
  position: new THREE.Vector3(10, 10, 10),
};
const mockPointer = new THREE.Vector2(0, 0);

vi.mock('@react-three/fiber', () => ({
  useThree: () => ({
    camera: mockCamera,
    gl: { domElement: document.createElement('canvas') },
    pointer: mockPointer,
    raycaster: new THREE.Raycaster(),
  }),
}));

// ─── Tests: snapToGrid ────────────────────────────────────────────────
describe('snapToGrid', () => {
  it('should snap world coordinates to nearest integer grid', () => {
    expect(snapToGrid(new THREE.Vector3(0.3, 0.7, 1.8))).toEqual([0, 1, 2]);
  });

  it('should snap negative coordinates correctly', () => {
    expect(snapToGrid(new THREE.Vector3(-0.3, 0.2, -0.6))).toEqual([0, 0, -1]);
  });

  it('should round exact half values up', () => {
    expect(snapToGrid(new THREE.Vector3(0.5, 0.5, 1.5))).toEqual([1, 1, 2]);
  });

  it('should handle zero', () => {
    expect(snapToGrid(new THREE.Vector3(0, 0, 0))).toEqual([0, 0, 0]);
  });

  it('should handle large coordinates', () => {
    expect(snapToGrid(new THREE.Vector3(9.9, 4.2, 7.1))).toEqual([10, 4, 7]);
  });
});

// ─── Tests: isInBounds ────────────────────────────────────────────────
describe('isInBounds', () => {
  const grid: [number, number, number] = [10, 10, 5]; // [width, depth, height]

  it('should return true for position inside bounds', () => {
    expect(isInBounds([5, 2, 5], grid)).toBe(true);
  });

  it('should return true for position at origin', () => {
    expect(isInBounds([0, 0, 0], grid)).toBe(true);
  });

  it('should return true for position at max boundary - 1', () => {
    expect(isInBounds([9, 4, 9], grid)).toBe(true);
  });

  it('should return false for x exceeding width', () => {
    expect(isInBounds([10, 0, 0], grid)).toBe(false);
  });

  it('should return false for y exceeding height', () => {
    expect(isInBounds([0, 5, 0], grid)).toBe(false);
  });

  it('should return false for z exceeding depth', () => {
    expect(isInBounds([0, 0, 10], grid)).toBe(false);
  });

  it('should return false for negative x', () => {
    expect(isInBounds([-1, 0, 0], grid)).toBe(false);
  });

  it('should return false for negative y', () => {
    expect(isInBounds([0, -1, 0], grid)).toBe(false);
  });
});

// ─── Tests: isCellOccupied ────────────────────────────────────────────
describe('isCellOccupied', () => {
  const placedPieces: PlacedPiece[] = [
    { id: 'a', type: 'straight_ramp', position: [0, 0, 0], rotationIndex: 0 },
    { id: 'b', type: 'bumper_pad', position: [3, 0, 4], rotationIndex: 1 },
    { id: 'c', type: 'goal_bucket', position: [5, 0, 5], rotationIndex: 0 },
  ];

  it('should return true for occupied cell', () => {
    expect(isCellOccupied([3, 0, 4], placedPieces)).toBe(true);
  });

  it('should return false for empty cell', () => {
    expect(isCellOccupied([1, 0, 1], placedPieces)).toBe(false);
  });

  it('should return false for empty cell within bounds', () => {
    expect(isCellOccupied([9, 0, 9], placedPieces)).toBe(false);
  });

  it('should differentiate by y-coordinate (height)', () => {
    expect(isCellOccupied([0, 1, 0], placedPieces)).toBe(false);
  });

  it('should return false for empty array', () => {
    expect(isCellOccupied([0, 0, 0], [])).toBe(false);
  });
});

// ─── Tests: raycastToGrid ─────────────────────────────────────────────
describe('raycastToGrid', () => {
  it('should return null when ray does not intersect Y=0 plane', () => {
    const ray = new THREE.Ray(
      new THREE.Vector3(0, 10, 0),
      new THREE.Vector3(0, 1, 0),
    );
    expect(raycastToGrid(ray)).toBeNull();
  });

  it('should return grid position when ray hits Y=0 plane', () => {
    const direction = new THREE.Vector3(3, 0, 3)
      .sub(new THREE.Vector3(5, 10, 5))
      .normalize();
    const ray = new THREE.Ray(new THREE.Vector3(5, 10, 5), direction);

    const result: GridRaycastResult | null = raycastToGrid(ray);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.gridPosition).toEqual([3, 0, 3]);
      expect(typeof result.worldPoint.x).toBe('number');
    }
  });

  it('should snap to nearest integer grid from arbitrary world point', () => {
    const target = new THREE.Vector3(1.3, 0, 2.7);
    const origin = new THREE.Vector3(10, 10, 10);
    const direction = target.clone().sub(origin).normalize();
    const ray = new THREE.Ray(origin, direction);

    const result: GridRaycastResult | null = raycastToGrid(ray);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.gridPosition).toEqual([1, 0, 3]);
    }
  });
});

// ─── Tests: useGridInteraction hook ────────────────────────────────────
describe('useGridInteraction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          placedPieces: [] as PlacedPiece[],
          grid: [10, 10, 5] as [number, number, number],
          activeBlueprintNode: undefined,
          placePiece: mockPlacePiece,
          updateActiveBlueprint: mockUpdateActiveBlueprint,
        };
        return selector(state);
      },
    );
  });

  it('should return hoveredCell and isValid properties', () => {
    const { result } = renderHook(() => useGridInteraction('straight_ramp'));

    expect(result.current).toHaveProperty('hoveredCell');
    expect(result.current).toHaveProperty('isValid');
  });

  it('should return null hoveredCell when no piece type selected', () => {
    const { result } = renderHook(() => useGridInteraction(null));

    expect(result.current.hoveredCell).toBeNull();
    expect(result.current.isValid).toBe(false);
  });
});
