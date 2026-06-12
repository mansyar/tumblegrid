import { audioEngine } from '@/audio/AudioEngine';
import { playUIClick } from '@/audio/sounds/uiClick';
import { useCallback } from 'react';

type ClickType = 'place' | 'remove' | 'rotate';

/**
 * Hook for playing UI interaction sounds.
 *
 * Provides a function to play click sounds for place/remove/rotate actions.
 * Sounds are only played when not muted and AudioContext is available.
 * Also resumes the AudioContext on first interaction (browser autoplay policy).
 *
 * @returns Object with playUIClick function
 */
export function useAudio(): { playUIClick: (type: ClickType) => void } {
  const handleClick = useCallback((type: ClickType) => {
    // Don't play if muted
    if (audioEngine.isMuted()) {
      return;
    }

    // Resume AudioContext if needed (browser autoplay policy)
    audioEngine.play();

    // Get AudioContext - returns null if not initialized
    const context = audioEngine.getContext();
    if (!context) {
      return;
    }

    // Play the click sound through master gain
    const masterGain = audioEngine.getMasterGain();
    playUIClick(context, type, masterGain ?? context.destination);
  }, []);

  return { playUIClick: handleClick };
}
