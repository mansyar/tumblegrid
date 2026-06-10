import { GridFloor } from '@/components/scene/GridFloor';
import { useCamera } from '@/hooks/useCamera';
import { OrbitControls } from '@react-three/drei';

export function Scene() {
  const { controlsRef } = useCamera();

  return (
    <>
      {/* Key Light - Primary directional light for main illumination */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill Light - Softer light to reduce harsh shadows */}
      <ambientLight intensity={0.4} position={[-5, 5, -5]} />

      {/* Back Light - Rim/edge light for depth separation */}
      <pointLight position={[0, 10, -10]} intensity={0.8} color="#ffffff" />

      {/* Grid Floor */}
      <GridFloor />

      {/* OrbitControls with clamps and damping */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.1}
        minPolarAngle={Math.PI / 18} // 10 degrees
        maxPolarAngle={(Math.PI * 4) / 9} // 80 degrees
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}
