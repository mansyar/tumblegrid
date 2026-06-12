import { describe, it, expect } from 'vitest';

import { velocityToFrequency, lerp } from '@/utils/audio';

describe('audio utilities', () => {
  describe('lerp', () => {
    it('should return start value when t is 0', () => {
      expect(lerp(0, 100, 0)).toBe(0);
    });

    it('should return end value when t is 1', () => {
      expect(lerp(0, 100, 1)).toBe(100);
    });

    it('should return midpoint when t is 0.5', () => {
      expect(lerp(0, 100, 0.5)).toBe(50);
    });

    it('should clamp t to [0, 1] range', () => {
      expect(lerp(0, 100, -0.5)).toBe(0);
      expect(lerp(0, 100, 1.5)).toBe(100);
    });
  });

  describe('velocityToFrequency', () => {
    it('should return minimum frequency (200) when velocity is 0', () => {
      expect(velocityToFrequency(0)).toBe(200);
    });

    it('should return maximum frequency (800) when velocity is 20', () => {
      expect(velocityToFrequency(20)).toBe(800);
    });

    it('should return midpoint frequency (500) when velocity is 10', () => {
      expect(velocityToFrequency(10)).toBe(500);
    });

    it('should clamp negative velocity to minimum frequency', () => {
      expect(velocityToFrequency(-5)).toBe(200);
    });

    it('should clamp velocity above 20 to maximum frequency', () => {
      expect(velocityToFrequency(30)).toBe(800);
    });

    it('should return monotonically increasing values', () => {
      const freq1 = velocityToFrequency(5);
      const freq2 = velocityToFrequency(10);
      const freq3 = velocityToFrequency(15);
      expect(freq1).toBeLessThan(freq2);
      expect(freq2).toBeLessThan(freq3);
    });
  });
});
