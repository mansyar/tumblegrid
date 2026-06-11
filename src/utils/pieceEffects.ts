import * as THREE from 'three';

export const GHOST_OPACITY = 0.35;
export const SELECTION_COLOR = '#FFD700';
export const SELECTION_INTENSITY = 0.5;

export interface SavedEmissive {
  color: THREE.Color;
  intensity: number;
}

/**
 * Applies visual effects (ghost transparency, selection glow) to
 * all meshes within a Three.js Group.
 *
 * Pure function — operates only on Three.js objects, no React/R3F dependency.
 *
 * @param group    The group whose meshes to modify
 * @param ghost    If true, applies ghost mode (semi-transparent)
 * @param selected If true, applies selection glow (gold emissive)
 * @param originalMap  Map of persisted original emissive values per mesh
 */
export function applyPieceEffects(
  group: THREE.Group,
  ghost: boolean,
  selected: boolean,
  originalMap: Map<THREE.Mesh, SavedEmissive>,
): void {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = child.material as THREE.MeshStandardMaterial;

      // Save original emissive values on first encounter
      if (!originalMap.has(child)) {
        originalMap.set(child, {
          color: material.emissive.clone(),
          intensity: material.emissiveIntensity,
        });
      }

      const savedEmissive = originalMap.get(child);
      if (!savedEmissive) return;

      // Ghost mode overrides opacity/transparency
      material.transparent = ghost;
      material.opacity = ghost ? GHOST_OPACITY : 1;

      // Selection glow: additive emissive highlight
      if (selected) {
        material.emissive = new THREE.Color(SELECTION_COLOR);
        material.emissiveIntensity = SELECTION_INTENSITY;
      } else {
        material.emissive.copy(savedEmissive.color);
        material.emissiveIntensity = savedEmissive.intensity;
      }

      material.needsUpdate = true;
    }
  });
}
