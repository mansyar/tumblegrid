import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useRef } from 'react';
import * as THREE from 'three';

export interface Bounds {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
}

export function useCamera() {
  const { camera } = useThree();
  // biome-ignore lint/suspicious/noExplicitAny: OrbitControls ref type from drei is complex
  const controlsRef = useRef<any>(null);
  const animationRef = useRef<{
    targetPosition: THREE.Vector3;
    targetLookAt: THREE.Vector3;
    startTime: number;
    duration: number;
    isAnimating: boolean;
  } | null>(null);

  const autoFrame = useCallback((bounds: Bounds) => {
    // Calculate center of bounds
    const center = new THREE.Vector3(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
      bounds.z + bounds.depth / 2,
    );

    // Calculate camera position to frame the bounds
    // Use isometric angle (45° pitch, 45° yaw)
    const maxDim = Math.max(bounds.width, bounds.height, bounds.depth);
    const distance = maxDim * 1.5; // Adjust multiplier for good framing

    // cos(45°) = sin(45°) ≈ 0.7071
    const isoFactor = Math.cos(Math.PI / 4);
    const targetPosition = new THREE.Vector3(
      center.x + distance * isoFactor,
      center.y + distance * isoFactor,
      center.z + distance * isoFactor,
    );

    // Set up animation
    animationRef.current = {
      targetPosition,
      targetLookAt: center,
      startTime: performance.now(),
      duration: 500, // 0.5 seconds
      isAnimating: true,
    };
  }, []);

  // Animation loop
  useFrame(() => {
    if (!animationRef.current?.isAnimating) return;

    const elapsed = performance.now() - animationRef.current.startTime;
    const progress = Math.min(elapsed / animationRef.current.duration, 1);

    // Smooth easing (ease-out cubic)
    const eased = 1 - (1 - progress) ** 3;

    // Lerp camera position
    camera.position.lerp(animationRef.current.targetPosition, eased);

    // Update controls target
    if (controlsRef.current) {
      controlsRef.current.target.lerp(animationRef.current.targetLookAt, eased);
      controlsRef.current.update();
    }

    // Check if animation is complete
    if (progress >= 1) {
      animationRef.current.isAnimating = false;
    }
  });

  return {
    controlsRef,
    autoFrame,
  };
}
