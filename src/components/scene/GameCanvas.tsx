import { PhysicsWorld } from '@/components/physics/PhysicsWorld';
import { Scene } from '@/components/scene/Scene';
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
        <PhysicsWorld>
          <Scene />
        </PhysicsWorld>
      </Canvas>
    </div>
  );
}
