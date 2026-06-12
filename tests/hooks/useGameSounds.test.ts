import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { audioEngine } from '@/audio/AudioEngine';
import { playVictoryJingle } from '@/audio/sounds/victoryJingle';
import { useGameSounds } from '@/hooks/useGameSounds';
import { useGameStore } from '@/store/useGameStore';

vi.mock('@/audio/AudioEngine', () => ({
  audioEngine: {
    getContext: vi.fn(),
    isMuted: vi.fn().mockReturnValue(false),
    play: vi.fn(),
  },
}));

vi.mock('@/audio/sounds/victoryJingle', () => ({
  playVictoryJingle: vi.fn(),
}));

describe('useGameSounds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGameStore.setState({
      machineState: 'BUILDING',
      activeMode: 'CAMPAIGN',
      placedPieces: [],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not play victory jingle on initial render', () => {
    const mockContext = {} as AudioContext;
    vi.mocked(audioEngine.getContext).mockReturnValue(mockContext);

    renderHook(() => useGameSounds());

    expect(playVictoryJingle).not.toHaveBeenCalled();
  });

  it('plays victory jingle when state transitions to LEVEL_CLEARED', () => {
    const mockContext = {} as AudioContext;
    vi.mocked(audioEngine.getContext).mockReturnValue(mockContext);

    renderHook(() => useGameSounds());

    act(() => {
      useGameStore.setState({ machineState: 'LEVEL_CLEARED' });
    });

    expect(playVictoryJingle).toHaveBeenCalledWith(mockContext);
  });

  it('does not play victory jingle when already in LEVEL_CLEARED', () => {
    const mockContext = {} as AudioContext;
    vi.mocked(audioEngine.getContext).mockReturnValue(mockContext);

    // Start already in LEVEL_CLEARED
    useGameStore.setState({ machineState: 'LEVEL_CLEARED' });
    renderHook(() => useGameSounds());

    // State doesn't change
    expect(playVictoryJingle).not.toHaveBeenCalled();
  });

  it('does not play victory jingle when muted', () => {
    vi.mocked(audioEngine.isMuted).mockReturnValue(true);
    const mockContext = {} as AudioContext;
    vi.mocked(audioEngine.getContext).mockReturnValue(mockContext);

    renderHook(() => useGameSounds());

    act(() => {
      useGameStore.setState({ machineState: 'LEVEL_CLEARED' });
    });

    expect(playVictoryJingle).not.toHaveBeenCalled();
  });

  it('does not play victory jingle when AudioContext unavailable', () => {
    vi.mocked(audioEngine.getContext).mockReturnValue(null);
    vi.mocked(audioEngine.isMuted).mockReturnValue(false);

    renderHook(() => useGameSounds());

    act(() => {
      useGameStore.setState({ machineState: 'LEVEL_CLEARED' });
    });

    expect(playVictoryJingle).not.toHaveBeenCalled();
  });

  it('resumes AudioContext before playing victory jingle', () => {
    const mockContext = {} as AudioContext;
    vi.mocked(audioEngine.getContext).mockReturnValue(mockContext);

    renderHook(() => useGameSounds());

    act(() => {
      useGameStore.setState({ machineState: 'LEVEL_CLEARED' });
    });

    expect(audioEngine.play).toHaveBeenCalled();
  });
});
