import { useGameStore } from '@/store/useGameStore';
import { useEffect } from 'react';

/**
 * Keyboard listener for the D key that toggles debug physics wireframes.
 *
 * Disabled entirely in production builds (import.meta.env.PROD).
 * Mount this hook inside the React tree (e.g., in GameCanvas).
 */
export function useDebugToggle() {
  const toggleDebugPhysics = useGameStore((s) => s.toggleDebugPhysics);

  useEffect(() => {
    if (import.meta.env.PROD) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        toggleDebugPhysics();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDebugPhysics]);
}
