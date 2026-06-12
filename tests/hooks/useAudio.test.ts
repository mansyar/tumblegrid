import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudio } from '@/hooks/useAudio';
import { useGameStore } from '@/store/useGameStore';
import { audioEngine } from '@/audio/AudioEngine';
import { playUIClick } from '@/audio/sounds/uiClick';

// Mock the audio modules
vi.mock('@/audio/AudioEngine', () => ({
  audioEngine: {
    getContext: vi.fn(),
    isMuted: vi.fn().mockReturnValue(false),
    play: vi.fn(),
  },
}));

vi.mock('@/audio/sounds/uiClick', () => ({
  playUIClick: vi.fn(),
}));

describe('useAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to default state
    useGameStore.setState({
      machineState: 'BUILDING',
      activeMode: 'CAMPAIGN',
      placedPieces: [],
      inventory: {
        straight_ramp: 3,
        speed_booster: 2,
        bumper_pad: 3,
        half_pipe: 1,
        goal_bucket: 1,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return an object with playUIClick function', () => {
    const { result } = renderHook(() => useAudio());

    expect(result.current).toHaveProperty('playUIClick');
    expect(typeof result.current.playUIClick).toBe('function');
  });

  it('should play UI click sound when placePiece is called', () => {
    const mockContext = {} as AudioContext;
    vi.mocked(audioEngine.getContext).mockReturnValue(mockContext);
    vi.mocked(audioEngine.isMuted).mockReturnValue(false);

    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.playUIClick('place');
    });

    expect(playUIClick).toHaveBeenCalledWith(mockContext, 'place');
  });

  it('should play UI click sound when removePiece is called', () => {
    const mockContext = {} as AudioContext;
    vi.mocked(audioEngine.getContext).mockReturnValue(mockContext);
    vi.mocked(audioEngine.isMuted).mockReturnValue(false);

    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.playUIClick('remove');
    });

    expect(playUIClick).toHaveBeenCalledWith(mockContext, 'remove');
  });

  it('should play UI click sound when rotatePiece is called', () => {
    const mockContext = {} as AudioContext;
    vi.mocked(audioEngine.getContext).mockReturnValue(mockContext);
    vi.mocked(audioEngine.isMuted).mockReturnValue(false);

    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.playUIClick('rotate');
    });

    expect(playUIClick).toHaveBeenCalledWith(mockContext, 'rotate');
  });

  it('should not play sound when muted', () => {
    vi.mocked(audioEngine.isMuted).mockReturnValue(true);

    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.playUIClick('place');
    });

    expect(playUIClick).not.toHaveBeenCalled();
  });

  it('should not play sound when AudioContext is unavailable', () => {
    vi.mocked(audioEngine.getContext).mockReturnValue(null);
    vi.mocked(audioEngine.isMuted).mockReturnValue(false);

    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.playUIClick('place');
    });

    expect(playUIClick).not.toHaveBeenCalled();
  });
});
