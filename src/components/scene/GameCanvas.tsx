import { Canvas } from '@react-three/fiber';

export function GameCanvas() {
  return (
    <div data-testid="game-canvas" style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        {/* Key Light - Primary directional light for main illumination and shadows */}
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
      </Canvas>
    </div>
  );
}
