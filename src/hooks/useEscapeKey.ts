import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';

export function useEscapeKey() {
  const machineState = useGameStore((s) => s.machineState);
  const transitionState = useGameStore((s) => s.transitionState);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (machineState === 'PLAYING') {
          transitionState('BUILDING');
        } else if (machineState === 'SANDBOX_PLAYING') {
          transitionState('SANDBOX_BUILDING');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [machineState, transitionState]);
}
