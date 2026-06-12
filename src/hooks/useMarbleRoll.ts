/**
 * useMarbleRoll — manages marble roll audio lifecycle during Play mode.
 *
 * - Creates white noise → bandpass filter → 3D panner chain on Play start
 * - Updates filter frequency from marble velocity each physics tick
 * - Updates panner position from marble 3D position each physics tick
 * - Fades in/out on Play/Stop transitions
 * - Pauses/resumes on tab visibility changes
 */
import { useBeforePhysicsStep, useRapier } from '@react-three/rapier';
import { useEffect, useRef } from 'react';

import { audioEngine } from '@/audio/AudioEngine';
import {
  createMarbleRollSource,
  createBandpassFilter,
  createPanner,
  connectMarbleRollChain,
  disconnectMarbleRollChain,
  FADE_IN_DURATION,
  FADE_OUT_DURATION,
} from '@/audio/sounds/marbleRoll';
import { velocityToFrequency } from '@/utils/audio';
import { useGameStore } from '@/store/useGameStore';

export function useMarbleRoll() {
  const machineState = useGameStore((s) => s.machineState);
  const { world } = useRapier();

  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const pannerRef = useRef<PannerNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);

  const isPlaying =
    machineState === 'PLAYING' || machineState === 'SANDBOX_PLAYING';

  // Start/stop audio on play mode transitions
  useEffect(() => {
    if (isPlaying && !isPlayingRef.current) {
      const ctx = audioEngine.getContext();
      if (!ctx || audioEngine.isMuted()) return;

      audioEngine.play();

      const source = createMarbleRollSource(ctx);
      const filter = createBandpassFilter(ctx, 200);
      const panner = createPanner(ctx);
      const gain = ctx.createGain();

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + FADE_IN_DURATION);

      connectMarbleRollChain(source, filter, panner, gain);
      const masterGain = audioEngine.getMasterGain();
      if (masterGain) gain.connect(masterGain);
      source.start(ctx.currentTime);

      sourceRef.current = source;
      filterRef.current = filter;
      pannerRef.current = panner;
      gainRef.current = gain;
      isPlayingRef.current = true;

      audioEngine.registerContinuous(gain);
    }

    if (!isPlaying && isPlayingRef.current) {
      const ctx = audioEngine.getContext();
      if (ctx && gainRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(
          0,
          ctx.currentTime + FADE_OUT_DURATION,
        );
      }

      const src = sourceRef.current;
      const flt = filterRef.current;
      const pan = pannerRef.current;
      const gain = gainRef.current;

      if (gain) audioEngine.unregisterContinuous(gain);

      setTimeout(() => {
        if (src && flt && pan) {
          disconnectMarbleRollChain(src, flt, pan);
        }
        try {
          src?.stop();
        } catch {
          // Already stopped — ignore
        }
      }, FADE_OUT_DURATION * 1000 + 50);

      sourceRef.current = null;
      filterRef.current = null;
      pannerRef.current = null;
      gainRef.current = null;
      isPlayingRef.current = false;
    }
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isPlayingRef.current) {
        const src = sourceRef.current;
        const flt = filterRef.current;
        const pan = pannerRef.current;
        const gain = gainRef.current;

        if (gain) audioEngine.unregisterContinuous(gain);

        if (src && flt && pan) {
          disconnectMarbleRollChain(src, flt, pan);
        }
        try {
          src?.stop();
        } catch {
          // Already stopped
        }

        sourceRef.current = null;
        filterRef.current = null;
        pannerRef.current = null;
        gainRef.current = null;
        isPlayingRef.current = false;
      }
    };
  }, []);

  // Update filter frequency and panner position each physics tick
  useBeforePhysicsStep(() => {
    if (!isPlayingRef.current || !filterRef.current || !pannerRef.current)
      return;

    world.forEachRigidBody((body) => {
      if (body.isDynamic()) {
        const pos = body.translation();
        const vel = body.linvel();
        const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);

        // Update bandpass filter frequency from velocity
        const freq = velocityToFrequency(speed);
        filterRef.current?.frequency.setValueAtTime(
          freq,
          audioEngine.getContext()?.currentTime ?? 0,
        );

        // Update 3D panner position
        const ctx = audioEngine.getContext();
        const t = ctx?.currentTime ?? 0;
        pannerRef.current?.positionX.setValueAtTime(pos.x, t);
        pannerRef.current?.positionY.setValueAtTime(pos.y, t);
        pannerRef.current?.positionZ.setValueAtTime(pos.z, t);
      }
    });
  });
}
