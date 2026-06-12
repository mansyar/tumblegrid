/**
 * Marble Roll Sound Synthesizer
 * Procedural continuous audio for the rolling marble using Web Audio API.
 *
 * Architecture:
 * - White noise source (looped AudioBuffer) → bandpass filter → 3D panner → master gain
 * - Filter frequency is updated each frame based on marble velocity
 * - Panner position is updated each frame based on marble 3D position
 */

/** Duration of the fade-in when Play mode starts (seconds). */
export const FADE_IN_DURATION = 0.3;

/** Duration of the fade-out when Play mode ends (seconds). */
export const FADE_OUT_DURATION = 0.2;

/** Buffer length in seconds for the white noise loop. */
const NOISE_BUFFER_SECONDS = 2;

/**
 * Creates a looping white noise AudioBufferSourceNode.
 * The buffer contains random samples normalized to [-1, 1].
 *
 * @param context - The AudioContext to use
 * @returns A configured AudioBufferSourceNode ready to connect
 */
export function createMarbleRollSource(
  context: AudioContext,
): AudioBufferSourceNode {
  const bufferSize = context.sampleRate * NOISE_BUFFER_SECONDS;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  return source;
}

/**
 * Creates a bandpass filter node for velocity-to-frequency mapping.
 *
 * @param context - The AudioContext to use
 * @param frequency - Initial center frequency in Hz
 * @returns A configured BiquadFilterNode
 */
export function createBandpassFilter(
  context: AudioContext,
  frequency: number,
): BiquadFilterNode {
  const filter = context.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(frequency, context.currentTime);
  filter.Q.value = 1;

  return filter;
}

/**
 * Creates a PannerNode for 3D spatialization.
 * Position is updated externally via positionX/positionY/positionZ AudioParams.
 *
 * @param context - The AudioContext to use
 * @returns A configured PannerNode
 */
export function createPanner(context: AudioContext): PannerNode {
  const panner = context.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.refDistance = 1;
  panner.maxDistance = 100;
  panner.rolloffFactor = 1;
  return panner;
}

/**
 * Connects the marble roll audio chain: source → filter → panner → destination.
 *
 * @param source - The white noise AudioBufferSourceNode
 * @param filter - The bandpass BiquadFilterNode
 * @param panner - The PannerNode
 * @param destination - The destination node (e.g., master gain)
 */
export function connectMarbleRollChain(
  source: AudioBufferSourceNode,
  filter: BiquadFilterNode,
  panner: PannerNode,
  destination: AudioNode,
): void {
  source.connect(filter);
  filter.connect(panner);
  panner.connect(destination);
}

/**
 * Disconnects all nodes in the marble roll audio chain.
 *
 * @param source - The white noise AudioBufferSourceNode
 * @param filter - The bandpass BiquadFilterNode
 * @param panner - The PannerNode
 */
export function disconnectMarbleRollChain(
  source: AudioBufferSourceNode,
  filter: BiquadFilterNode,
  panner: PannerNode,
): void {
  source.disconnect();
  filter.disconnect();
  panner.disconnect();
}
