import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as THREE from 'three';
import type { PlacedPiece } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';
import { usePieceSelection } from '@/hooks/usePieceSelection';

// ─── Mocks ────────────────────────────────────────────────────────────
const mockSelectPiece = vi.fn();
const mockClearSelection = vi.fn();
const mockRemovePiece = vi.fn();

vi.mock('@/store/useGameStore', () => ({
  useGameStore: vi.fn(),
}));

const mockCamera = {
  position: new THREE.Vector3(10, 10, 10),
};
const mockPointer = new THREE.Vector2(0, 0);

const mockCanvas = document.createElement('canvas');

vi.mock('@react-three/fiber', () => ({
  useThree: () => ({
    camera: mockCamera,
    gl: { domElement: mockCanvas },
    pointer: mockPointer,
  }),
}));

// ─── Helper to set up mock store state ─────────────────────────────────
function setupStoreState(overrides?: {
  placedPieces?: PlacedPiece[];
  selectedPieceId?: string | undefined;
}) {
  (useGameStore as unknown as Mock).mockImplementation(
    (selector: (state: unknown) => unknown) => {
      const state = {
        placedPieces: overrides?.placedPieces ?? [],
        selectedPieceId: overrides?.selectedPieceId ?? undefined,
        selectPiece: mockSelectPiece,
        clearSelection: mockClearSelection,
        removePiece: mockRemovePiece,
      };
      return selector(state);
    },
  );
}

// ─── Tests: usePieceSelection ──────────────────────────────────────────
describe('usePieceSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPointer.set(0, 0);
    (useGameStore as unknown as Mock).mockReset();
  });

  it('should return nothing (implicit void)', () => {
    setupStoreState();
    const { result } = renderHook(() => usePieceSelection());
    expect(result.current).toBeUndefined();
  });

  it('should attach click event listener to the canvas element', () => {
    setupStoreState();
    const addEventListenerSpy = vi.spyOn(mockCanvas, 'addEventListener');

    renderHook(() => usePieceSelection());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
  });

  it('should clean up click event listener on unmount', () => {
    setupStoreState();
    const removeEventListenerSpy = vi.spyOn(
      mockCanvas,
      'removeEventListener',
    );

    const { unmount } = renderHook(() => usePieceSelection());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });

  it('should not throw when clicking on empty grid', () => {
    setupStoreState({ placedPieces: [], selectedPieceId: undefined });

    renderHook(() => usePieceSelection());

    expect(() => {
      act(() => {
        mockCanvas.dispatchEvent(new PointerEvent('click'));
      });
    }).not.toThrow();
  });

  it('should not throw when clicking with placed pieces present', () => {
    const placedPieces: PlacedPiece[] = [
      { id: 'p1', type: 'straight_ramp', position: [2, 0, 3], rotationIndex: 0 },
      { id: 'p2', type: 'bumper_pad', position: [5, 0, 5], rotationIndex: 1 },
    ];
    setupStoreState({ placedPieces, selectedPieceId: undefined });

    renderHook(() => usePieceSelection());

    expect(() => {
      act(() => {
        mockCanvas.dispatchEvent(new PointerEvent('click'));
      });
    }).not.toThrow();
  });

  it('should not throw when clicking on already selected piece', () => {
    const placedPieces: PlacedPiece[] = [
      { id: 'p1', type: 'straight_ramp', position: [2, 0, 3], rotationIndex: 0 },
    ];
    setupStoreState({ placedPieces, selectedPieceId: 'p1' });

    renderHook(() => usePieceSelection());

    expect(() => {
      act(() => {
        mockCanvas.dispatchEvent(new PointerEvent('click'));
      });
    }).not.toThrow();
  });

  it('should use the same canvas element throughout lifecycle', () => {
    setupStoreState();
    const addEventListenerSpy = vi.spyOn(mockCanvas, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(
      mockCanvas,
      'removeEventListener',
    );

    const { unmount } = renderHook(() => usePieceSelection());
    unmount();

    // The same canvas should be used for both add and remove
    expect(addEventListenerSpy.mock.instances[0]).toBe(mockCanvas);
    expect(removeEventListenerSpy.mock.instances[0]).toBe(mockCanvas);

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
