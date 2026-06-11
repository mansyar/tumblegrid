import { describe, expect, it, vi } from 'vitest';
import { PieceFactory, PIECE_MAP } from '@/components/pieces/PieceFactory';

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(),
  useFrame: vi.fn(),
}));

describe('PieceFactory', () => {
  it('should be a function component', () => {
    expect(typeof PieceFactory).toBe('function');
  });

  it('should have the correct component name', () => {
    expect(PieceFactory.name).toBe('PieceFactory');
  });
});

describe('PIECE_MAP', () => {
  it('should contain an entry for straight_ramp', () => {
    expect(PIECE_MAP.straight_ramp).toBeDefined();
    expect(typeof PIECE_MAP.straight_ramp).toBe('function');
  });

  it('should contain an entry for speed_booster', () => {
    expect(PIECE_MAP.speed_booster).toBeDefined();
    expect(typeof PIECE_MAP.speed_booster).toBe('function');
  });

  it('should contain an entry for bumper_pad', () => {
    expect(PIECE_MAP.bumper_pad).toBeDefined();
    expect(typeof PIECE_MAP.bumper_pad).toBe('function');
  });

  it('should contain an entry for half_pipe', () => {
    expect(PIECE_MAP.half_pipe).toBeDefined();
    expect(typeof PIECE_MAP.half_pipe).toBe('function');
  });

  it('should contain an entry for goal_bucket', () => {
    expect(PIECE_MAP.goal_bucket).toBeDefined();
    expect(typeof PIECE_MAP.goal_bucket).toBe('function');
  });

  it('should have exactly 5 entries', () => {
    expect(Object.keys(PIECE_MAP)).toHaveLength(5);
  });
});
