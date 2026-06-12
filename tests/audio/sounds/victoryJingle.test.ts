import { describe, expect, it, vi } from 'vitest';

import { playVictoryJingle } from '@/audio/sounds/victoryJingle';

function createMockContext(): AudioContext {
  let callIndex = 0;

  const createOscillator = vi.fn(() => {
    const idx = callIndex++;
    return {
      type: '' as OscillatorType,
      frequency: {
        setValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      _idx: idx,
    };
  });

  const createGain = vi.fn(() => ({
    gain: {
      value: 1,
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  }));

  return {
    currentTime: 0,
    destination: {} as AudioDestinationNode,
    createOscillator,
    createGain,
  } as unknown as AudioContext;
}

describe('playVictoryJingle', () => {
  it('creates 3 oscillators for 3 notes', () => {
    const context = createMockContext();
    playVictoryJingle(context);
    expect(context.createOscillator).toHaveBeenCalledTimes(3);
  });

  it('creates 3 gain nodes', () => {
    const context = createMockContext();
    playVictoryJingle(context);
    expect(context.createGain).toHaveBeenCalledTimes(3);
  });

  it('sets sine wave type on all oscillators', () => {
    const context = createMockContext();
    playVictoryJingle(context);
    const oscillators = vi.mocked(context.createOscillator).mock.results;
    for (const result of oscillators) {
      expect(result.value.type).toBe('sine');
    }
  });

  it('sets correct frequencies (C5, E5, G5)', () => {
    const context = createMockContext();
    playVictoryJingle(context);
    const oscillators = vi.mocked(context.createOscillator).mock.results;
    const expectedFreqs = [523.25, 659.25, 783.99];
    for (let i = 0; i < 3; i++) {
      expect(
        oscillators[i].value.frequency.setValueAtTime,
      ).toHaveBeenCalledWith(expectedFreqs[i], expect.any(Number));
    }
  });

  it('starts each oscillator at staggered times', () => {
    const context = createMockContext();
    playVictoryJingle(context);
    const oscillators = vi.mocked(context.createOscillator).mock.results;
    const startTimes = oscillators.map(
      (o) => o.value.start.mock.calls[0]?.[0] ?? 0,
    );
    // Each note starts 0.15s after the previous
    const delta1 = startTimes[1] - startTimes[0];
    const delta2 = startTimes[2] - startTimes[1];
    expect(delta1).toBeCloseTo(0.15, 2);
    expect(delta2).toBeCloseTo(0.15, 2);
  });

  it('stops each oscillator after its duration', () => {
    const context = createMockContext();
    playVictoryJingle(context);
    const oscillators = vi.mocked(context.createOscillator).mock.results;
    for (let i = 0; i < 3; i++) {
      const startTime = oscillators[i].value.start.mock.calls[0][0];
      const stopTime = oscillators[i].value.stop.mock.calls[0][0];
      expect(stopTime - startTime).toBeCloseTo(0.2, 5);
    }
  });

  it('connects oscillators through gain nodes to destination', () => {
    const context = createMockContext();
    playVictoryJingle(context);
    const oscillators = vi.mocked(context.createOscillator).mock.results;
    const gainNodes = vi.mocked(context.createGain).mock.results;
    for (let i = 0; i < 3; i++) {
      expect(oscillators[i].value.connect).toHaveBeenCalledWith(
        gainNodes[i].value,
      );
      expect(gainNodes[i].value.connect).toHaveBeenCalledWith(
        context.destination,
      );
    }
  });

  it('handles empty notes array gracefully', () => {
    const context = createMockContext();
    expect(() => playVictoryJingle(context)).not.toThrow();
  });
});
