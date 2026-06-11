import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  applyPieceEffects,
  GHOST_OPACITY,
  SELECTION_COLOR,
  SELECTION_INTENSITY,
  type SavedEmissive,
} from '@/utils/pieceEffects';

function createTestScene(): {
  group: THREE.Group;
  mesh1: THREE.Mesh;
  mesh2: THREE.Mesh;
} {
  const geom = new THREE.BoxGeometry(1, 1, 1);
  const mesh1 = new THREE.Mesh(
    geom,
    new THREE.MeshStandardMaterial({
      color: '#ff0000',
      emissive: '#000000',
      emissiveIntensity: 0,
    }),
  );
  const mesh2 = new THREE.Mesh(
    geom.clone(),
    new THREE.MeshStandardMaterial({
      color: '#00ff00',
      emissive: '#111111',
      emissiveIntensity: 0.3,
    }),
  );
  const group = new THREE.Group();
  group.add(mesh1);
  group.add(mesh2);
  return { group, mesh1, mesh2 };
}

describe('applyPieceEffects', () => {
  let originalMap: Map<THREE.Mesh, SavedEmissive>;

  beforeEach(() => {
    originalMap = new Map();
  });

  it('should set ghost opacity on all meshes', () => {
    const { group, mesh1, mesh2 } = createTestScene();

    applyPieceEffects(group, true, false, originalMap);

    const mat1 = mesh1.material as THREE.MeshStandardMaterial;
    const mat2 = mesh2.material as THREE.MeshStandardMaterial;

    expect(mat1.transparent).toBe(true);
    expect(mat1.opacity).toBe(GHOST_OPACITY);
    expect(mat2.transparent).toBe(true);
    expect(mat2.opacity).toBe(GHOST_OPACITY);
  });

  it('should restore full opacity when ghost is false', () => {
    const { group, mesh1, mesh2 } = createTestScene();

    // First set ghost, then clear
    applyPieceEffects(group, true, false, originalMap);
    applyPieceEffects(group, false, false, originalMap);

    const mat1 = mesh1.material as THREE.MeshStandardMaterial;
    const mat2 = mesh2.material as THREE.MeshStandardMaterial;

    expect(mat1.opacity).toBe(1);
    expect(mat2.opacity).toBe(1);
  });

  it('should set selection glow on all meshes', () => {
    const { group, mesh1, mesh2 } = createTestScene();

    applyPieceEffects(group, false, true, originalMap);

    const mat1 = mesh1.material as THREE.MeshStandardMaterial;
    const mat2 = mesh2.material as THREE.MeshStandardMaterial;

    expect(mat1.emissive.getHex()).toBe(new THREE.Color(SELECTION_COLOR).getHex());
    expect(mat1.emissiveIntensity).toBe(SELECTION_INTENSITY);
    expect(mat2.emissive.getHex()).toBe(new THREE.Color(SELECTION_COLOR).getHex());
    expect(mat2.emissiveIntensity).toBe(SELECTION_INTENSITY);
  });

  it('should restore original emissive when deselected', () => {
    const { group, mesh2 } = createTestScene();
    const originalColor = new THREE.Color('#111111');
    const originalIntensity = 0.3;

    // Select then deselect
    applyPieceEffects(group, false, true, originalMap);
    applyPieceEffects(group, false, false, originalMap);

    const mat2 = mesh2.material as THREE.MeshStandardMaterial;
    expect(mat2.emissive.getHex()).toBe(originalColor.getHex());
    expect(mat2.emissiveIntensity).toBe(originalIntensity);
  });

  it('should save original emissive values on first encounter', () => {
    const { group, mesh1, mesh2 } = createTestScene();

    applyPieceEffects(group, false, false, originalMap);

    expect(originalMap.size).toBe(2);
    expect(originalMap.get(mesh1)?.intensity).toBe(0);
    expect(originalMap.get(mesh2)?.intensity).toBe(0.3);
  });

  it('should not add duplicate entries to the map on subsequent calls', () => {
    const { group } = createTestScene();

    applyPieceEffects(group, false, false, originalMap);
    applyPieceEffects(group, true, false, originalMap);

    expect(originalMap.size).toBe(2);
  });

  it('should handle empty group', () => {
    const emptyGroup = new THREE.Group();

    expect(() => {
      applyPieceEffects(emptyGroup, true, true, originalMap);
    }).not.toThrow();

    expect(originalMap.size).toBe(0);
  });

  it('should handle groups with non-mesh children', () => {
    const group = new THREE.Group();
    const light = new THREE.DirectionalLight();
    group.add(light);

    expect(() => {
      applyPieceEffects(group, true, true, originalMap);
    }).not.toThrow();
  });

  it('should apply both ghost and selection simultaneously', () => {
    const { group, mesh1 } = createTestScene();

    applyPieceEffects(group, true, true, originalMap);

    const mat1 = mesh1.material as THREE.MeshStandardMaterial;
    expect(mat1.transparent).toBe(true);
    expect(mat1.opacity).toBe(GHOST_OPACITY);
    expect(mat1.emissive.getHex()).toBe(new THREE.Color(SELECTION_COLOR).getHex());
    expect(mat1.emissiveIntensity).toBe(SELECTION_INTENSITY);
  });
});
