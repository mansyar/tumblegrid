import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ActiveBlueprintNode } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';
import { usePieceRotation } from '@/hooks/usePieceRotation';

// ─── Mocks ────────────────────────────────────────────────────────────
const mockRotatePiece = vi.fn();
const mockUpdateActiveBlueprint = vi.fn();

vi.mock('@/store/useGameStore', () => ({
  useGameStore: vi.fn(),
}));

// ─── Helper to set up mock store state ─────────────────────────────────
function setupStoreState(overrides?: {
  selectedPieceId?: string | undefined;
  activeBlueprintNode?: ActiveBlueprintNode | undefined;
}) {
  (useGameStore as unknown as Mock).mockImplementation(
    (selector: (state: unknown) => unknown) => {
      const state = {
        selectedPieceId: overrides?.selectedPieceId ?? undefined,
        activeBlueprintNode: overrides?.activeBlueprintNode ?? undefined,
        rotatePiece: mockRotatePiece,
        updateActiveBlueprint: mockUpdateActiveBlueprint,
      };
      return selector(state);
    },
  );
}

// ─── Tests: usePieceRotation ──────────────────────────────────────────
describe('usePieceRotation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useGameStore as unknown as Mock).mockReset();
  });

  // ── Task 3: Rotation via R key (selected piece) ────────────────────

  it('should return nothing (implicit void)', () => {
    setupStoreState();
    const { result } = renderHook(() => usePieceRotation());
    expect(result.current).toBeUndefined();
  });

  it('should attach keydown event listener to window', () => {
    setupStoreState();
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    renderHook(() => usePieceRotation());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
  });

  it('should clean up keydown event listener on unmount', () => {
    setupStoreState();
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => usePieceRotation());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });

  it('should call rotatePiece when R is pressed with a selected piece', () => {
    setupStoreState({ selectedPieceId: 'piece-1' });

    renderHook(() => usePieceRotation());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
    });

    expect(mockRotatePiece).toHaveBeenCalledWith('piece-1');
  });

  it('should call rotatePiece when uppercase R is pressed with a selected piece', () => {
    setupStoreState({ selectedPieceId: 'piece-1' });

    renderHook(() => usePieceRotation());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'R' }));
    });

    expect(mockRotatePiece).toHaveBeenCalledWith('piece-1');
  });

  it('should NOT call rotatePiece when R is pressed but no piece selected', () => {
    setupStoreState({ selectedPieceId: undefined });

    renderHook(() => usePieceRotation());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
    });

    expect(mockRotatePiece).not.toHaveBeenCalled();
  });

  it('should NOT call rotatePiece for other keys when piece is selected', () => {
    setupStoreState({ selectedPieceId: 'piece-1' });

    renderHook(() => usePieceRotation());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' }));
    });

    expect(mockRotatePiece).not.toHaveBeenCalled();
  });

  it('should NOT call rotatePiece for Enter key', () => {
    setupStoreState({ selectedPieceId: 'piece-1' });

    renderHook(() => usePieceRotation());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    expect(mockRotatePiece).not.toHaveBeenCalled();
  });

  // ── Task 4: Pre-placement rotation (ghost preview) ────────────────

  it('should rotate blueprint when R is pressed with active ghost and no selection', () => {
    setupStoreState({
      selectedPieceId: undefined,
      activeBlueprintNode: {
        pieceType: 'straight_ramp',
        position: [2, 0, 3],
        rotationIndex: 0,
        valid: true,
      },
    });

    renderHook(() => usePieceRotation());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
    });

    expect(mockUpdateActiveBlueprint).toHaveBeenCalledWith(
      expect.objectContaining({ rotationIndex: 1 }),
    );
  });

  it('should increment blueprint rotation by 1 modulo 4', () => {
    setupStoreState({
      selectedPieceId: undefined,
      activeBlueprintNode: {
        pieceType: 'straight_ramp',
        position: [2, 0, 3],
        rotationIndex: 2,
        valid: true,
      },
    });

    renderHook(() => usePieceRotation());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
    });

    // Verify rotation increments from 2 to 3
    expect(mockUpdateActiveBlueprint).toHaveBeenCalledWith(
      expect.objectContaining({ rotationIndex: 3 }),
    );
  });

  it('should NOT rotate blueprint when other keys are pressed with ghost active', () => {
    setupStoreState({
      selectedPieceId: undefined,
      activeBlueprintNode: {
        pieceType: 'straight_ramp',
        position: [2, 0, 3],
        rotationIndex: 0,
        valid: true,
      },
    });

    renderHook(() => usePieceRotation());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 't' }));
    });

    expect(mockUpdateActiveBlueprint).not.toHaveBeenCalled();
  });

  it('should prefer selectedPiece rotation over blueprint rotation when both active', () => {
    setupStoreState({
      selectedPieceId: 'piece-1',
      activeBlueprintNode: {
        pieceType: 'straight_ramp',
        position: [2, 0, 3],
        rotationIndex: 0,
        valid: true,
      },
    });

    renderHook(() => usePieceRotation());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
    });

    // Selected piece rotation takes priority
    expect(mockRotatePiece).toHaveBeenCalledWith('piece-1');
    expect(mockUpdateActiveBlueprint).not.toHaveBeenCalled();
  });
});
