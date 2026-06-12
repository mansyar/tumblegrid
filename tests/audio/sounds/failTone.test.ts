import { describe, expect, it, vi } from 'vitest';

import { playFailTone } from '@/audio/sounds/failTone';

function createMockContext(): AudioContext {
  const mockOscillator = {
    type: '' as OscillatorType,
    frequency: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };

  const mockGainNode = {
    gain: {
      value: 1,
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  };

  return {
    currentTime: 0,
    destination: {} as AudioDestinationNode,
    createOscillator: vi.fn(() => mockOscillator),
    createGain: vi.fn(() => mockGainNode),
  } as unknown as AudioContext;
}

describe('playFailTone', () => {
  it('creates one oscillator', () => {
    const context = createMockContext();
    playFailTone(context);
    expect(context.createOscillator).toHaveBeenCalledTimes(1);
  });

  it('creates one gain node', () => {
    const context = createMockContext();
    playFailTone(context);
    expect(context.createGain).toHaveBeenCalledTimes(1);
  });

  it('sets sine wave type', () => {
    const context = createMockContext();
    playFailTone(context);
    const oscillator = vi.mocked(context.createOscillator).mock.results[0]
      .value;
    expect(oscillator.type).toBe('sine');
  });

  it('sets start frequency to 400Hz', () => {
    const context = createMockContext();
    playFailTone(context);
    const oscillator = vi.mocked(context.createOscillator).mock.results[0]
      .value;
    expect(oscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
      400,
      expect.any(Number),
    );
  });

  it('slides frequency from 400Hz to 200Hz', () => {
    const context = createMockContext();
    playFailTone(context);
    const oscillator = vi.mocked(context.createOscillator).mock.results[0]
      .value;
    expect(oscillator.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(
      200,
      expect.any(Number),
    );
  });

  it('stops oscillator after 0.3s duration', () => {
    const context = createMockContext();
    playFailTone(context);
    const oscillator = vi.mocked(context.createOscillator).mock.results[0]
      .value;
    const startTime = oscillator.start.mock.calls[0][0];
    const stopTime = oscillator.stop.mock.calls[0][0];
    expect(stopTime - startTime).toBeCloseTo(0.3, 5);
  });

  it('connects oscillator through gain to destination', () => {
    const context = createMockContext();
    playFailTone(context);
    const oscillator = vi.mocked(context.createOscillator).mock.results[0]
      .value;
    const gainNode = vi.mocked(context.createGain).mock.results[0].value;
    expect(oscillator.connect).toHaveBeenCalledWith(gainNode);
    expect(gainNode.connect).toHaveBeenCalledWith(context.destination);
  });

  it('does not throw when called', () => {
    const context = createMockContext();
    expect(() => playFailTone(context)).not.toThrow();
  });
});
