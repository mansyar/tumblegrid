/**
 * FailDetector — monitors marble position during Play mode.
 *
 * If the marble falls below Y = -5, starts a 0.5s delay then auto-transitions
 * back to BUILDING/SANDBOX_BUILDING so the player can retry.
 *
 * Must be mounted inside a `<Physics>` component tree (uses `useBeforePhysicsStep`).
 */
import { useBeforePhysicsStep, useRapier } from '@react-three/rapier';
import { useEffect, useRef } from 'react';

import { audioEngine } from '@/audio/AudioEngine';
import { playFailTone } from '@/audio/sounds/failTone';
import { useGameStore } from '@/store/useGameStore';
import { FAIL_Y_THRESHOLD, FAIL_DELAY_MS } from '@/utils/physics';

/**
 * Reads the marble's Y position each physics tick by iterating Rapier world bodies.
 * Only dynamic rigid bodies are checked (the marble is the only dynamic body during Play).
 */
export function FailDetector() {
  const { world } = useRapier();
  const machineState = useGameStore((s) => s.machineState);
  const isPlaying =
    machineState === 'PLAYING' || machineState === 'SANDBOX_PLAYING';

  const failTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFailedRef = useRef(false);

  // Reset fail state when entering Play mode
  useEffect(() => {
    if (isPlaying) {
      hasFailedRef.current = false;
      if (failTimerRef.current) {
        clearTimeout(failTimerRef.current);
        failTimerRef.current = null;
      }
    }
  }, [isPlaying]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (failTimerRef.current) {
        clearTimeout(failTimerRef.current);
        failTimerRef.current = null;
      }
    };
  }, []);

  useBeforePhysicsStep(() => {
    if (!isPlaying || hasFailedRef.current) return;

    let marbleBelowThreshold = false;

    world.forEachRigidBody((body) => {
      if (body.isDynamic()) {
        const pos = body.translation();
        if (pos.y < FAIL_Y_THRESHOLD) {
          marbleBelowThreshold = true;
        }
      }
    });

    if (marbleBelowThreshold) {
      if (!failTimerRef.current) {
        // Play fail tone immediately on first detection
        if (!audioEngine.isMuted()) {
          audioEngine.play();
          const ctx = audioEngine.getContext();
          if (ctx) {
            const masterGain = audioEngine.getMasterGain();
            playFailTone(ctx, masterGain ?? ctx.destination);
          }
        }

        failTimerRef.current = setTimeout(() => {
          hasFailedRef.current = true;
          const currentState = useGameStore.getState();
          if (
            currentState.machineState === 'PLAYING' ||
            currentState.machineState === 'SANDBOX_PLAYING'
          ) {
            currentState.transitionState(
              currentState.machineState === 'PLAYING'
                ? 'BUILDING'
                : 'SANDBOX_BUILDING',
            );
          }
        }, FAIL_DELAY_MS);
      }
    } else if (failTimerRef.current) {
      // Marble moved back above threshold — cancel pending fail
      clearTimeout(failTimerRef.current);
      failTimerRef.current = null;
    }
  });

  return null;
}
