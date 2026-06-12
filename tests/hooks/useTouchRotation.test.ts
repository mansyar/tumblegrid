import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTouchRotation } from '@/hooks/useTouchRotation';

// Mock store and audio
vi.mock('@/store/useGameStore', () => ({
  useGameStore: vi.fn((selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      selectedPieceId: undefined,
      activeBlueprintNode: undefined,
      rotatePiece: vi.fn(),
      updateActiveBlueprint: vi.fn(),
    }),
  ),
}));

vi.mock('@/hooks/useAudio', () => ({
  useAudio: () => ({
    playUIClick: vi.fn(),
  }),
}));

// Helper to create a mock Touch object
function createTouch(
  id: number,
  clientX: number,
  clientY: number,
): Touch {
  return {
    identifier: id,
    clientX,
    clientY,
    pageX: clientX,
    pageY: clientY,
    screenX: clientX,
    screenY: clientY,
    radiusX: 0,
    radiusY: 0,
    rotationAngle: 0,
    force: 0,
    target: document.createElement('canvas'),
  } as Touch;
}

describe('useTouchRotation', () => {
  it('should export a function', () => {
    expect(typeof useTouchRotation).toBe('function');
  });

  it('should mount without errors when canvas exists', () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    renderHook(() => useTouchRotation());

    document.body.removeChild(canvas);
  });

  it('should handle touch events without crashing', () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    renderHook(() => useTouchRotation());

    // Simulate a two-finger touch
    const touch1 = createTouch(0, 100, 100);
    const touch2 = createTouch(1, 200, 100);

    const touchStartEvent = new Event('touchstart') as TouchEvent;
    Object.defineProperty(touchStartEvent, 'touches', {
      value: [touch1, touch2],
    });
    canvas.dispatchEvent(touchStartEvent);

    // Simulate move
    const touch1Moved = createTouch(0, 100, 100);
    const touch2Moved = createTouch(1, 200, 50);
    const touchMoveEvent = new Event('touchmove') as TouchEvent;
    Object.defineProperty(touchMoveEvent, 'touches', {
      value: [touch1Moved, touch2Moved],
    });
    canvas.dispatchEvent(touchMoveEvent);

    // Simulate end
    const touchEndEvent = new Event('touchend') as TouchEvent;
    Object.defineProperty(touchEndEvent, 'touches', {
      value: [touch1],
    });
    canvas.dispatchEvent(touchEndEvent);

    document.body.removeChild(canvas);
  });

  it('should handle touchcancel event', () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    renderHook(() => useTouchRotation());

    const touch1 = createTouch(0, 100, 100);
    const touch2 = createTouch(1, 200, 100);

    const touchStartEvent = new Event('touchstart') as TouchEvent;
    Object.defineProperty(touchStartEvent, 'touches', {
      value: [touch1, touch2],
    });
    canvas.dispatchEvent(touchStartEvent);

    const touchCancelEvent = new Event('touchcancel') as TouchEvent;
    Object.defineProperty(touchCancelEvent, 'touches', {
      value: [],
    });
    canvas.dispatchEvent(touchCancelEvent);

    document.body.removeChild(canvas);
  });
});
