import { useDebugToggle } from '@/hooks/useDebugToggle';
import { useGameStore } from '@/store/useGameStore';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useDebugToggle', () => {
  it('should start with debugPhysics = false', () => {
    const state = useGameStore.getState();
    expect(state.debugPhysics).toBe(false);
  });

  it('should toggle debugPhysics on D key press', () => {
    const initial = useGameStore.getState().debugPhysics;
    expect(initial).toBe(false);

    renderHook(() => useDebugToggle());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    });

    expect(useGameStore.getState().debugPhysics).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'D' }));
    });

    expect(useGameStore.getState().debugPhysics).toBe(false);
  });

  it('should toggle on uppercase D key press', () => {
    // Reset to known state
    useGameStore.setState({ debugPhysics: false });

    renderHook(() => useDebugToggle());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'D' }));
    });

    expect(useGameStore.getState().debugPhysics).toBe(true);
  });

  it('should not toggle on other keys', () => {
    useGameStore.setState({ debugPhysics: false });

    renderHook(() => useDebugToggle());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    });

    expect(useGameStore.getState().debugPhysics).toBe(false);
  });

  it('should clean up event listener on unmount', () => {
    useGameStore.setState({ debugPhysics: false });
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useDebugToggle());

    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
