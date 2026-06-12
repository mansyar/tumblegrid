import { describe, it, expect, vi, beforeEach } from 'vitest';
import { playUIClick } from '@/audio/sounds/uiClick';

describe('playUIClick', () => {
  let mockContext: AudioContext;
  let mockOscillator: OscillatorNode;
  let mockGainNode: GainNode;

  beforeEach(() => {
    vi.clearAllMocks();

    mockOscillator = {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { setValueAtTime: vi.fn() },
      type: 'sine',
    } as unknown as OscillatorNode;

    mockGainNode = {
      connect: vi.fn(),
      gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
    } as unknown as GainNode;

    mockContext = {
      createOscillator: vi.fn().mockReturnValue(mockOscillator),
      createGain: vi.fn().mockReturnValue(mockGainNode),
      destination: {} as AudioDestinationNode,
      currentTime: 0,
    } as unknown as AudioContext;
  });

  it('should create oscillator and gain nodes', () => {
    playUIClick(mockContext, 'place');

    expect(mockContext.createOscillator).toHaveBeenCalled();
    expect(mockContext.createGain).toHaveBeenCalled();
  });

  it('should connect oscillator through gain to destination', () => {
    playUIClick(mockContext, 'place');

    expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
    expect(mockGainNode.connect).toHaveBeenCalledWith(mockContext.destination);
  });

  it('should start oscillator immediately', () => {
    playUIClick(mockContext, 'place');

    expect(mockOscillator.start).toHaveBeenCalledWith(mockContext.currentTime);
  });

  it('should stop oscillator after 50ms', () => {
    playUIClick(mockContext, 'place');

    expect(mockOscillator.stop).toHaveBeenCalledWith(mockContext.currentTime + 0.05);
  });

  it('should set frequency for place type', () => {
    playUIClick(mockContext, 'place');

    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
      expect.any(Number),
      mockContext.currentTime
    );
  });

  it('should set frequency for remove type', () => {
    playUIClick(mockContext, 'remove');

    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
      expect.any(Number),
      mockContext.currentTime
    );
  });

  it('should set frequency for rotate type', () => {
    playUIClick(mockContext, 'rotate');

    expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
      expect.any(Number),
      mockContext.currentTime
    );
  });

  it('should set gain envelope for fade out', () => {
    playUIClick(mockContext, 'place');

    expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(
      expect.any(Number),
      mockContext.currentTime
    );
    expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
      0,
      mockContext.currentTime + 0.05
    );
  });

  it('should use sine oscillator type', () => {
    playUIClick(mockContext, 'place');

    expect(mockOscillator.type).toBe('sine');
  });

  it('should handle all click types without error', () => {
    const types: Array<'place' | 'remove' | 'rotate'> = ['place', 'remove', 'rotate'];

    for (const type of types) {
      expect(() => playUIClick(mockContext, type)).not.toThrow();
    }
  });
});
