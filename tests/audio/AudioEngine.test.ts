import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock AudioContext before importing AudioEngine
class MockAudioContext {
  state = 'suspended' as AudioContextState;
  sampleRate = 44100;
  currentTime = 0;
  destination = { numberOfInputs: 1, numberOfOutputs: 0 };

  createGain = vi.fn(() => ({
    gain: { value: 1, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));

  resume = vi.fn(async () => {
    this.state = 'running';
  });

  close = vi.fn(async () => {
    this.state = 'closed';
  });
}

// Store the mock constructor for tests
let MockAudioContextCtor: typeof MockAudioContext;

beforeEach(() => {
  MockAudioContextCtor = MockAudioContext;
  // @ts-expect-error - Setting up mock for test
  globalThis.AudioContext = MockAudioContextCtor;
  // @ts-expect-error - Setting up mock for test
  globalThis.webkitAudioContext = MockAudioContextCtor;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AudioEngine', () => {
  describe('singleton pattern', () => {
    it('should return the same instance on multiple calls', async () => {
      const { AudioEngine } = await import('@/audio/AudioEngine');
      const instance1 = AudioEngine.getInstance();
      const instance2 = AudioEngine.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('lazy initialization', () => {
    it('should not create AudioContext until getContext is called', async () => {
      const { AudioEngine } = await import('@/audio/AudioEngine');
      const engine = AudioEngine.getInstance();
      // Reset the engine state
      engine.reset();

      const context = engine.getContext();
      expect(context).toBeDefined();
      expect(context).toBeInstanceOf(MockAudioContextCtor);
    });

    it('should create AudioContext with correct state', async () => {
      const { AudioEngine } = await import('@/audio/AudioEngine');
      const engine = AudioEngine.getInstance();
      engine.reset();

      const context = engine.getContext();
      expect(context?.state).toBe('suspended');
    });

    it('should create a master gain node connected to destination', async () => {
      const { AudioEngine } = await import('@/audio/AudioEngine');
      const engine = AudioEngine.getInstance();
      engine.reset();

      const masterGain = engine.getMasterGain();
      expect(masterGain).toBeDefined();
      expect(masterGain?.gain.value).toBe(1);
    });
  });

  describe('context state management', () => {
    it('should resume context when play is called', async () => {
      const { AudioEngine } = await import('@/audio/AudioEngine');
      const engine = AudioEngine.getInstance();
      engine.reset();
      engine.getContext();

      await engine.play();
      expect(engine.getContext()?.state).toBe('running');
    });

    it('should handle already running context gracefully', async () => {
      const { AudioEngine } = await import('@/audio/AudioEngine');
      const engine = AudioEngine.getInstance();
      engine.reset();
      engine.getContext();

      await engine.play();
      // Calling play again should not throw
      await engine.play();
      expect(engine.getContext()?.state).toBe('running');
    });

    it('should close context when cleanup is called', async () => {
      const { AudioEngine } = await import('@/audio/AudioEngine');
      const engine = AudioEngine.getInstance();
      engine.reset();
      const ctx = engine.getContext();

      await engine.cleanup();
      // After cleanup, the internal context is nullified.
      // A new call to getContext() should create a fresh context.
      expect(engine.getContext()).not.toBe(ctx);
      expect(engine.getContext()?.state).toBe('suspended');
    });
  });

  describe('mute functionality', () => {
    it('should set master gain to 0 when muted', async () => {
      const { AudioEngine } = await import('@/audio/AudioEngine');
      const engine = AudioEngine.getInstance();
      engine.reset();
      engine.getContext();

      engine.setMuted(true);
      expect(engine.getMasterGain()?.gain.value).toBe(0);
    });

    it('should set master gain to 1 when unmuted', async () => {
      const { AudioEngine } = await import('@/audio/AudioEngine');
      const engine = AudioEngine.getInstance();
      engine.reset();
      engine.getContext();

      engine.setMuted(true);
      engine.setMuted(false);
      expect(engine.getMasterGain()?.gain.value).toBe(1);
    });

    it('should track muted state', async () => {
      const { AudioEngine } = await import('@/audio/AudioEngine');
      const engine = AudioEngine.getInstance();
      engine.reset();

      expect(engine.isMuted()).toBe(false);
      engine.setMuted(true);
      expect(engine.isMuted()).toBe(true);
      engine.setMuted(false);
      expect(engine.isMuted()).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle missing AudioContext gracefully', async () => {
      // @ts-expect-error - Removing AudioContext for test
      globalThis.AudioContext = undefined;
      // @ts-expect-error - Removing webkitAudioContext for test
      globalThis.webkitAudioContext = undefined;

      const { AudioEngine } = await import('@/audio/AudioEngine');
      const engine = AudioEngine.getInstance();
      engine.reset();

      // Should not throw
      const context = engine.getContext();
      expect(context).toBeNull();
    });

    it('should return null master gain when context is unavailable', async () => {
      // @ts-expect-error - Removing AudioContext for test
      globalThis.AudioContext = undefined;
      // @ts-expect-error - Removing webkitAudioContext for test
      globalThis.webkitAudioContext = undefined;

      const { AudioEngine } = await import('@/audio/AudioEngine');
      const engine = AudioEngine.getInstance();
      engine.reset();

      const masterGain = engine.getMasterGain();
      expect(masterGain).toBeNull();
    });
  });
});
