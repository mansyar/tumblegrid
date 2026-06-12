import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { audioEngine } from '@/audio/AudioEngine';
import { useMarbleRoll } from '@/hooks/useMarbleRoll';
import { useGameStore } from '@/store/useGameStore';

// ─── Mock Rapier ─────────────────────────────────────────────────────

const mockForEachRigidBody = vi.fn();
let registeredBeforePhysicsCallback: (() => void) | null = null;

vi.mock('@react-three/rapier', () => ({
  useRapier: () => ({
    world: {
      forEachRigidBody: mockForEachRigidBody,
    },
  }),
  useBeforePhysicsStep: (cb: () => void) => {
    registeredBeforePhysicsCallback = cb;
  },
}));

// ─── Mock AudioEngine ────────────────────────────────────────────────

vi.mock('@/audio/AudioEngine', () => ({
  audioEngine: {
    getContext: vi.fn(),
    getMasterGain: vi.fn(),
    isMuted: vi.fn().mockReturnValue(false),
    play: vi.fn(),
    registerContinuous: vi.fn(),
    unregisterContinuous: vi.fn(),
  },
}));

// ─── Mock marbleRoll ─────────────────────────────────────────────────

const mockSource = {
  start: vi.fn(),
  stop: vi.fn(),
  disconnect: vi.fn(),
  connect: vi.fn(),
  loop: false,
};

const mockFilter = {
  type: 'bandpass',
  frequency: {
    value: 400,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  },
  Q: { value: 1 },
  disconnect: vi.fn(),
  connect: vi.fn(),
};

const mockPanner = {
  panningModel: 'equalpower',
  distanceModel: 'inverse',
  disconnect: vi.fn(),
  connect: vi.fn(),
  positionX: {
    value: 0,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  },
  positionY: {
    value: 0,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  },
  positionZ: {
    value: 0,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  },
};

const mockGain = {
  gain: {
    value: 1,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  },
  connect: vi.fn(),
  disconnect: vi.fn(),
};

const mockMasterGain = {
  gain: {
    value: 1,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  },
  disconnect: vi.fn(),
};

vi.mock('@/audio/sounds/marbleRoll', () => ({
  createMarbleRollSource: vi.fn(() => mockSource),
  createBandpassFilter: vi.fn(() => mockFilter),
  createPanner: vi.fn(() => mockPanner),
  connectMarbleRollChain: vi.fn(),
  disconnectMarbleRollChain: vi.fn(),
  FADE_IN_DURATION: 0.3,
  FADE_OUT_DURATION: 0.2,
}));

vi.mock('@/utils/audio', () => ({
  velocityToFrequency: vi.fn((v: number) => 200 + (v / 20) * 600),
}));

// ─── Tests ───────────────────────────────────────────────────────────

describe('useMarbleRoll', () => {
  let mockContext: AudioContext;

  beforeEach(() => {
    vi.clearAllMocks();
    registeredBeforePhysicsCallback = null;

    mockContext = {
      currentTime: 0,
      createGain: vi.fn(() => mockGain),
    } as unknown as AudioContext;

    // Default mock: dynamic body at origin with zero velocity
    mockForEachRigidBody.mockImplementation(
      (
        cb: (body: {
          isDynamic: () => boolean;
          translation: () => { x: number; y: number; z: number };
          linvel: () => { x: number; y: number; z: number };
        }) => void,
      ) => {
        cb({
          isDynamic: () => true,
          translation: () => ({ x: 0, y: 1, z: 0 }),
          linvel: () => ({ x: 0, y: 0, z: 0 }),
        });
      },
    );

    // Default: context available, not muted
    vi.mocked(audioEngine.getContext).mockReturnValue(mockContext);
    vi.mocked(audioEngine.getMasterGain).mockReturnValue(
      mockMasterGain as unknown as GainNode,
    );
    vi.mocked(audioEngine.isMuted).mockReturnValue(false);

    useGameStore.setState({
      machineState: 'BUILDING',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not start audio when not in play mode', () => {
    renderHook(() => useMarbleRoll());

    // useBeforePhysicsStep always registers, but no audio should be created
    expect(mockSource.start).not.toHaveBeenCalled();
  });

  it('creates audio chain when entering PLAYING state', () => {
    renderHook(() => useMarbleRoll());

    act(() => {
      useGameStore.setState({ machineState: 'PLAYING' });
    });

    expect(mockSource.start).toHaveBeenCalled();
    expect(audioEngine.play).toHaveBeenCalled();
  });

  it('does not create audio chain when muted', () => {
    vi.mocked(audioEngine.isMuted).mockReturnValue(true);

    renderHook(() => useMarbleRoll());

    act(() => {
      useGameStore.setState({ machineState: 'PLAYING' });
    });

    expect(mockSource.start).not.toHaveBeenCalled();
  });

  it('updates filter frequency based on marble velocity', () => {
    // Mock marble moving at velocity 10
    mockForEachRigidBody.mockImplementation(
      (
        cb: (body: {
          isDynamic: () => boolean;
          translation: () => { x: number; y: number; z: number };
          linvel: () => { x: number; y: number; z: number };
        }) => void,
      ) => {
        cb({
          isDynamic: () => true,
          translation: () => ({ x: 0, y: 1, z: 0 }),
          linvel: () => ({ x: 10, y: 0, z: 0 }),
        });
      },
    );

    renderHook(() => useMarbleRoll());

    act(() => {
      useGameStore.setState({ machineState: 'PLAYING' });
    });

    // Trigger physics step
    const cb = registeredBeforePhysicsCallback as () => void;
    act(() => {
      cb();
    });

    // velocityToFrequency(10) = 200 + (10/20)*600 = 500
    expect(mockFilter.frequency.setValueAtTime).toHaveBeenCalledWith(
      500,
      expect.any(Number),
    );
  });

  it('updates panner position from marble translation', () => {
    mockForEachRigidBody.mockImplementation(
      (
        cb: (body: {
          isDynamic: () => boolean;
          translation: () => { x: number; y: number; z: number };
          linvel: () => { x: number; y: number; z: number };
        }) => void,
      ) => {
        cb({
          isDynamic: () => true,
          translation: () => ({ x: 5, y: 2, z: 3 }),
          linvel: () => ({ x: 0, y: 0, z: 0 }),
        });
      },
    );

    renderHook(() => useMarbleRoll());

    act(() => {
      useGameStore.setState({ machineState: 'PLAYING' });
    });

    const cb = registeredBeforePhysicsCallback as () => void;
    act(() => {
      cb();
    });

    expect(mockPanner.positionX.setValueAtTime).toHaveBeenCalledWith(
      5,
      expect.any(Number),
    );
    expect(mockPanner.positionY.setValueAtTime).toHaveBeenCalledWith(
      2,
      expect.any(Number),
    );
    expect(mockPanner.positionZ.setValueAtTime).toHaveBeenCalledWith(
      3,
      expect.any(Number),
    );
  });

  it('fades out and cleans up when leaving play mode', () => {
    vi.useFakeTimers();

    renderHook(() => useMarbleRoll());

    act(() => {
      useGameStore.setState({ machineState: 'PLAYING' });
    });

    // Leave play mode
    act(() => {
      useGameStore.setState({ machineState: 'BUILDING' });
    });

    // Source should be stopped after fade-out timeout
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(mockSource.stop).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
