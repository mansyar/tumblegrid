import { PhysicsWorld } from '@/components/physics/PhysicsWorld';
import { Scene } from '@/components/scene/Scene';
import { useDebugToggle } from '@/hooks/useDebugToggle';
import { usePlayLoop } from '@/hooks/usePlayLoop';
import { Canvas } from '@react-three/fiber';

export function GameCanvas() {
  usePlayLoop();
  useDebugToggle();

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
