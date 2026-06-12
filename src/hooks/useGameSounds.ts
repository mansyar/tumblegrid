import { audioEngine } from '@/audio/AudioEngine';
import { playVictoryJingle } from '@/audio/sounds/victoryJingle';
import { useGameStore } from '@/store/useGameStore';
import { useEffect, useRef } from 'react';

/**
 * Hook that watches game state transitions and plays victory sound.
 *
 * - Victory jingle when machineState → LEVEL_CLEARED
 * - Fail tone is played directly by FailDetector (not via this hook)
 *
 * Must be mounted in a component that is always alive during gameplay.
 */
export function useGameSounds(): void {
  const machineState = useGameStore((s) => s.machineState);
  const prevStateRef = useRef(machineState);

  // Victory sound: play jingle when state transitions to LEVEL_CLEARED
  useEffect(() => {
    const prevState = prevStateRef.current;
    prevStateRef.current = machineState;

    if (machineState === 'LEVEL_CLEARED' && prevState !== 'LEVEL_CLEARED') {
      if (audioEngine.isMuted()) return;
      audioEngine.play();
      const context = audioEngine.getContext();
      if (!context) return;
      const masterGain = audioEngine.getMasterGain();
      playVictoryJingle(context, masterGain ?? context.destination);
    }
  }, [machineState]);
}
