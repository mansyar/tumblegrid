import { useAudio } from '@/hooks/useAudio';
import { useGameStore } from '@/store/useGameStore';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Threshold in radians before a rotation step is triggered.
 * 45° ≈ 0.785 radians. Each step cycles rotationIndex by 1.
 */
const ROTATION_STEP_THRESHOLD = Math.PI / 4;

/**
 * Hook for two-finger twist gesture → piece rotation.
 *
 * Tracks two touch points on the canvas, computes the angle delta
 * between them, and triggers a rotation step when the cumulative
 * delta exceeds ROTATION_STEP_THRESHOLD (45°).
 *
 * Rotation priority matches usePieceRotation:
 * 1. Selected placed piece → rotatePiece()
 * 2. Ghost blueprint → updateActiveBlueprint()
 */
export function useTouchRotation(): void {
  const selectedPieceId = useGameStore((s) => s.selectedPieceId);
  const activeBlueprintNode = useGameStore((s) => s.activeBlueprintNode);
  const rotatePiece = useGameStore((s) => s.rotatePiece);
  const updateActiveBlueprint = useGameStore((s) => s.updateActiveBlueprint);
  const { playUIClick } = useAudio();

  // Track active touch identifiers for the two fingers
  const touchIdsRef = useRef<[number, number] | null>(null);
  // Last computed angle between the two fingers
  const lastAngleRef = useRef<number | null>(null);
  // Cumulative angle delta since last rotation step
  const cumulativeDeltaRef = useRef(0);

  const triggerRotation = useCallback(() => {
    // Priority 1: Rotate selected placed piece
    if (selectedPieceId) {
      playUIClick('rotate');
      rotatePiece(selectedPieceId);
      return;
    }

    // Priority 2: Rotate ghost preview (pre-placement)
    if (activeBlueprintNode) {
      playUIClick('rotate');
      const newRotation = ((activeBlueprintNode.rotationIndex + 1) % 4) as
        | 0
        | 1
        | 2
        | 3;
      updateActiveBlueprint({
        ...activeBlueprintNode,
        rotationIndex: newRotation,
      });
    }
  }, [
    selectedPieceId,
    activeBlueprintNode,
    rotatePiece,
    updateActiveBlueprint,
    playUIClick,
  ]);

  /**
   * Compute angle (in radians) between two touch points.
   * Returns value in range [-π, π].
   */
  const computeAngle = useCallback(
    (t1: Touch, t2: Touch): number => {
      return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX);
    },
    [],
  );

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      // We only care about exactly 2 fingers for twist gesture
      if (e.touches.length === 2) {
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        touchIdsRef.current = [t0.identifier, t1.identifier];
        lastAngleRef.current = computeAngle(t0, t1);
        cumulativeDeltaRef.current = 0;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const ids = touchIdsRef.current;
      if (!ids || e.touches.length !== 2) return;

      // Find the two touches by their identifiers
      let t0: Touch | null = null;
      let t1: Touch | null = null;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === ids[0]) t0 = touch;
        if (touch.identifier === ids[1]) t1 = touch;
      }

      if (!t0 || !t1 || lastAngleRef.current === null) return;

      const currentAngle = computeAngle(t0, t1);
      let delta = currentAngle - lastAngleRef.current;

      // Normalize delta to [-π, π] to handle angle wraparound
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;

      cumulativeDeltaRef.current += delta;
      lastAngleRef.current = currentAngle;

      // Check if cumulative delta exceeds threshold
      if (Math.abs(cumulativeDeltaRef.current) >= ROTATION_STEP_THRESHOLD) {
        triggerRotation();
        // Reset but preserve overshoot for snappy feel
        cumulativeDeltaRef.current =
          cumulativeDeltaRef.current % ROTATION_STEP_THRESHOLD;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Reset when fewer than 2 fingers remain
      if (e.touches.length < 2) {
        touchIdsRef.current = null;
        lastAngleRef.current = null;
        cumulativeDeltaRef.current = 0;
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [computeAngle, triggerRotation]);
}
