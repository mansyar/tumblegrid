import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null);

  const gridGeometry = useMemo(() => {
    const size = 100;
    const divisions = 50;
    const grid = new THREE.GridHelper(size, divisions, '#b0b0b0', '#e0e0e0');
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
    return grid;
  }, []);

  return <primitive ref={gridRef} object={gridGeometry} position={[0, 0, 0]} />;
}
