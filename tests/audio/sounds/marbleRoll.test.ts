import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  createMarbleRollSource,
  createBandpassFilter,
  createPanner,
  connectMarbleRollChain,
  disconnectMarbleRollChain,
  FADE_IN_DURATION,
  FADE_OUT_DURATION,
} from '@/audio/sounds/marbleRoll';

// ─── Mock Web Audio API ────────────────────────────────────────────

const mockStart = vi.fn();
const mockStop = vi.fn();
const mockConnect = vi.fn();
const mockDisconnect = vi.fn();
const mockGainSetValue = vi.fn();
const mockGainLinearRamp = vi.fn();
const mockFilterSetValue = vi.fn();
const mockPannerSetValue = vi.fn();
const mockAudioBuffer = { getChannelData: vi.fn(() => new Float32Array(44100)) };

function createMockAudioContext(): AudioContext {
  return {
    currentTime: 0,
    sampleRate: 44100,
    createBufferSource: vi.fn(() => ({
      buffer: null as AudioBuffer | null,
      loop: false,
      connect: mockConnect,
      disconnect: mockDisconnect,
      start: mockStart,
      stop: mockStop,
    })),
    createBuffer: vi.fn(() => mockAudioBuffer),
    createBiquadFilter: vi.fn(() => ({
      type: 'bandpass' as BiquadFilterType,
      frequency: {
        value: 1000,
        setValueAtTime: mockFilterSetValue,
        linearRampToValueAtTime: vi.fn(),
      },
      Q: { value: 1 },
      connect: mockConnect,
      disconnect: mockDisconnect,
    })),
    createGain: vi.fn(() => ({
      gain: {
        value: 1,
        setValueAtTime: mockGainSetValue,
        linearRampToValueAtTime: mockGainLinearRamp,
      },
      connect: mockConnect,
      disconnect: mockDisconnect,
    })),
    createPanner: vi.fn(() => ({
      panningModel: 'equalpower',
      distanceModel: 'inverse',
      refDistance: 1,
      maxDistance: 100,
      rolloffFactor: 1,
      positionX: {
        value: 0,
        setValueAtTime: mockPannerSetValue,
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
      connect: mockConnect,
      disconnect: mockDisconnect,
    })),
    destination: {} as AudioDestinationNode,
  } as unknown as AudioContext;
}

// ─── Tests ─────────────────────────────────────────────────────────

describe('marbleRoll', () => {
  let ctx: AudioContext;

  beforeEach(() => {
    vi.clearAllMocks();
    ctx = createMockAudioContext();
  });

  describe('createMarbleRollSource', () => {
    it('should create an AudioBufferSourceNode', () => {
      const source = createMarbleRollSource(ctx);
      expect(source).toBeDefined();
      expect(ctx.createBufferSource).toHaveBeenCalled();
    });

    it('should fill buffer with white noise samples', () => {
      createMarbleRollSource(ctx);
      expect(ctx.createBuffer).toHaveBeenCalledWith(
        1, // mono
        expect.any(Number),
        44100,
      );
    });

    it('should set buffer loop to true', () => {
      const source = createMarbleRollSource(ctx) as unknown as {
        loop: boolean;
      };
      expect(source.loop).toBe(true);
    });
  });

  describe('createBandpassFilter', () => {
    it('should create a BiquadFilterNode with type bandpass', () => {
      const filter = createBandpassFilter(ctx, 400);
      expect(filter).toBeDefined();
      expect(ctx.createBiquadFilter).toHaveBeenCalled();
    });

    it('should set initial frequency via setValueAtTime', () => {
      createBandpassFilter(ctx, 500);
      expect(mockFilterSetValue).toHaveBeenCalledWith(
        500,
        expect.any(Number),
      );
    });
  });

  describe('createPanner', () => {
    it('should create a PannerNode', () => {
      const panner = createPanner(ctx);
      expect(panner).toBeDefined();
      expect(ctx.createPanner).toHaveBeenCalled();
    });

    it('should set HRTF panning model', () => {
      const panner = createPanner(ctx) as unknown as { panningModel: string };
      expect(panner.panningModel).toBe('HRTF');
    });
  });

  describe('connectMarbleRollChain', () => {
    it('should connect source → filter → panner → destination', () => {
      const source = createMarbleRollSource(ctx);
      const filter = createBandpassFilter(ctx, 400);
      const panner = createPanner(ctx);
      const masterGain = ctx.createGain();

      connectMarbleRollChain(source, filter, panner, masterGain);

      // source → filter
      expect(mockConnect).toHaveBeenCalledWith(filter);
      // filter → panner
      expect(mockConnect).toHaveBeenCalledWith(panner);
      // panner → destination
      expect(mockConnect).toHaveBeenCalledWith(masterGain);
    });
  });

  describe('disconnectMarbleRollChain', () => {
    it('should disconnect all nodes', () => {
      const source = createMarbleRollSource(ctx);
      const filter = createBandpassFilter(ctx, 400);
      const panner = createPanner(ctx);

      disconnectMarbleRollChain(source, filter, panner);

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('constants', () => {
    it('should export FADE_IN_DURATION', () => {
      expect(FADE_IN_DURATION).toBeGreaterThan(0);
    });

    it('should export FADE_OUT_DURATION', () => {
      expect(FADE_OUT_DURATION).toBeGreaterThan(0);
    });
  });
});
