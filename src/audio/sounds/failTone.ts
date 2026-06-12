/**
 * Fail Tone Synthesizer
 * Procedural descending sine slide for fail events.
 */

const START_FREQ = 400; // Hz
const END_FREQ = 200; // Hz
const DURATION = 0.3; // seconds
const GAIN = 0.3;

/**
 * Play a descending fail tone.
 * Sine wave slides from 400Hz to 200Hz over 300ms.
 *
 * @param context - The AudioContext to use
 */
export function playFailTone(context: AudioContext): void {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine';

  // Frequency slide: 400Hz → 200Hz
  oscillator.frequency.setValueAtTime(START_FREQ, context.currentTime);
  oscillator.frequency.linearRampToValueAtTime(
    END_FREQ,
    context.currentTime + DURATION,
  );

  // Gain envelope: quick fade in, sustain, fade out
  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(GAIN, context.currentTime + 0.01);
  gainNode.gain.setValueAtTime(GAIN, context.currentTime + DURATION - 0.05);
  gainNode.gain.linearRampToValueAtTime(0, context.currentTime + DURATION);

  // Connect: oscillator → gain → destination
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  // Start and stop
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + DURATION);
}
