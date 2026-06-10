import { Scene } from '@/components/scene/Scene';
import { Canvas } from '@react-three/fiber';
import type { Bounds } from '@/hooks/useCamera';

interface GameCanvasProps {
  onAutoFrame?: (autoFrame: (bounds: Bounds) => void) => void;
}

export function GameCanvas({ onAutoFrame }: GameCanvasProps) {
  return (
    <div data-testid="game-canvas" style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Scene onAutoFrame={onAutoFrame} />
      </Canvas>
    </div>
  );
}
