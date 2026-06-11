import { describe, expect, it } from 'vitest';
import type { Screen } from '@/store/types';

describe('Screen type', () => {
  it('should accept menu screen value', () => {
    const screen: Screen = 'menu';
    expect(screen).toBe('menu');
  });

  it('should accept levelSelect screen value', () => {
    const screen: Screen = 'levelSelect';
    expect(screen).toBe('levelSelect');
  });

  it('should accept game screen value', () => {
    const screen: Screen = 'game';
    expect(screen).toBe('game');
  });
});
