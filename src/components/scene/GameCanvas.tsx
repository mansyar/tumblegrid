import { Scene } from '@/components/scene/Scene';
import { Canvas } from '@react-three/fiber';
import type { Bounds } from '@/hooks/useCamera';
import { useCallback } from 'react';

// Expose autoFrame globally for testing
declare global {
  interface Window {
    testAutoFrame?: (bounds: Bounds) => void;
  }
}

export function GameCanvas() {
  const handleAutoFrame = useCallback(
    (autoFrame: (bounds: Bounds) => void) => {
      window.testAutoFrame = autoFrame;
    },
    [],
  );

  return (
    <div data-testid="game-canvas" style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Scene onAutoFrame={handleAutoFrame} />
      </Canvas>
    </div>
  );
}
