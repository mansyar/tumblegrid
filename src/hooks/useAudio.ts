import { useCallback } from 'react';
import { audioEngine } from '@/audio/AudioEngine';
import { playUIClick } from '@/audio/sounds/uiClick';

type ClickType = 'place' | 'remove' | 'rotate';

/**
 * Hook for playing UI interaction sounds.
 *
 * Provides a function to play click sounds for place/remove/rotate actions.
 * Sounds are only played when not muted and AudioContext is available.
 *
 * @returns Object with playUIClick function
 */
export function useAudio(): { playUIClick: (type: ClickType) => void } {
  const handleClick = useCallback((type: ClickType) => {
    // Don't play if muted
    if (audioEngine.isMuted()) {
      return;
    }

    // Get AudioContext - returns null if not initialized
    const context = audioEngine.getContext();
    if (!context) {
      return;
    }

    // Play the click sound
    playUIClick(context, type);
  }, []);

  return { playUIClick: handleClick };
}
