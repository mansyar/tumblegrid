import { PhysicsWorld } from '@/components/physics/PhysicsWorld';
import { Scene } from '@/components/scene/Scene';
import { useDebugToggle } from '@/hooks/useDebugToggle';
import { usePlayLoop } from '@/hooks/usePlayLoop';
import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';

export function GameCanvas() {
  usePlayLoop();
  useDebugToggle();
  const containerRef = useRef<HTMLDivElement>(null);

  const preventTouchDefault = useCallback((event: TouchEvent) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Prevent browser default touch behaviors (scroll, zoom, bounce)
    // on the game canvas area using passive:false to allow preventDefault()
    el.addEventListener('touchstart', preventTouchDefault, {
      passive: false,
    });
    el.addEventListener('touchmove', preventTouchDefault, {
      passive: false,
    });

    return () => {
      el.removeEventListener('touchstart', preventTouchDefault);
      el.removeEventListener('touchmove', preventTouchDefault);
    };
  }, [preventTouchDefault]);

  return (
    <div
      ref={containerRef}
      data-testid="game-canvas"
      style={{
        width: '100%',
        height: '100%',
        // Disable browser touch gestures — R3F handles pointer input
        touchAction: 'none',
      }}
    >
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
