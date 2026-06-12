/**
 * Victory Jingle Synthesizer
 * Procedural 3-note rising sine sequence for level cleared events.
 */

// C5, E5, G5 — a bright major triad
const NOTES = [523.25, 659.25, 783.99];
const NOTE_DURATION = 0.15; // seconds between note starts
const TONE_DURATION = 0.2; // seconds each note rings
const GAIN = 0.3;

/**
 * Play a 3-note rising victory jingle.
 * Notes are C5 → E5 → G5, spaced 150ms apart.
 * Total duration ~500ms.
 *
 * @param context - The AudioContext to use
 * @param destination - Audio destination node (defaults to context.destination)
 */
export function playVictoryJingle(
  context: AudioContext,
  destination: AudioNode = context.destination,
): void {
  const startTime = context.currentTime;

  for (let i = 0; i < NOTES.length; i++) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(
      NOTES[i],
      startTime + i * NOTE_DURATION,
    );

    // Fade in quickly, hold, then fade out
    gainNode.gain.setValueAtTime(0, startTime + i * NOTE_DURATION);
    gainNode.gain.linearRampToValueAtTime(
      GAIN,
      startTime + i * NOTE_DURATION + 0.01,
    );
    gainNode.gain.setValueAtTime(
      GAIN,
      startTime + i * NOTE_DURATION + TONE_DURATION - 0.05,
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      startTime + i * NOTE_DURATION + TONE_DURATION,
    );

    oscillator.connect(gainNode);
    gainNode.connect(destination);

    oscillator.start(startTime + i * NOTE_DURATION);
    oscillator.stop(startTime + i * NOTE_DURATION + TONE_DURATION);
  }
}
