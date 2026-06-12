/**
 * UI Click Sound Synthesizer
 * Procedural audio for UI interactions using Web Audio API.
 */

type ClickType = 'place' | 'remove' | 'rotate';

// Frequency map for different click types
const FREQUENCIES: Record<ClickType, number> = {
  place: 880, // A5 - bright, positive
  remove: 440, // A4 - neutral
  rotate: 660, // E5 - medium, distinctive
};

/**
 * Play a UI click sound.
 * Uses a short sine oscillator with different pitches per type.
 *
 * @param context - The AudioContext to use
 * @param type - The type of click: 'place', 'remove', or 'rotate'
 * @param destination - Audio destination node (defaults to context.destination)
 */
export function playUIClick(
  context: AudioContext,
  type: ClickType,
  destination: AudioNode = context.destination,
): void {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  // Configure oscillator
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(FREQUENCIES[type], context.currentTime);

  // Configure gain envelope (fade out)
  gainNode.gain.setValueAtTime(0.3, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.05);

  // Connect: oscillator → gain → destination
  oscillator.connect(gainNode);
  gainNode.connect(destination);

  // Start and stop
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + 0.05);
}
