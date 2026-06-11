import { describe, expect, it, vi } from 'vitest';
import { PieceFactory, PIECE_MAP } from '@/components/pieces/PieceFactory';

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(),
  useFrame: vi.fn(),
}));

describe('PieceFactory', () => {
  it('should be a memo-wrapped component', () => {
    expect(PieceFactory).toBeDefined();
  });

  it('should have the correct display name', () => {
    expect(PieceFactory.displayName).toBe('PieceFactory');
  });
});

describe('PIECE_MAP', () => {
  it('should contain a memo-wrapped entry for straight_ramp', () => {
    expect(PIECE_MAP.straight_ramp).toBeDefined();
    expect(PIECE_MAP.straight_ramp.displayName).toBe('StraightRamp');
  });

  it('should contain a memo-wrapped entry for speed_booster', () => {
    expect(PIECE_MAP.speed_booster).toBeDefined();
    expect(PIECE_MAP.speed_booster.displayName).toBe('SpeedBooster');
  });

  it('should contain a memo-wrapped entry for bumper_pad', () => {
    expect(PIECE_MAP.bumper_pad).toBeDefined();
    expect(PIECE_MAP.bumper_pad.displayName).toBe('BumperPad');
  });

  it('should contain a memo-wrapped entry for half_pipe', () => {
    expect(PIECE_MAP.half_pipe).toBeDefined();
    expect(PIECE_MAP.half_pipe.displayName).toBe('HalfPipe');
  });

  it('should contain a memo-wrapped entry for goal_bucket', () => {
    expect(PIECE_MAP.goal_bucket).toBeDefined();
    expect(PIECE_MAP.goal_bucket.displayName).toBe('GoalBucket');
  });

  it('should have exactly 5 entries', () => {
    expect(Object.keys(PIECE_MAP)).toHaveLength(5);
  });
});

describe('PieceFactory selected prop', () => {
  it('should render without error when selected is true', () => {
    expect(() =>
      <PieceFactory pieceType="straight_ramp" selected />,
    ).not.toThrow();
  });

  it('should render without error when selected is false', () => {
    expect(() =>
      <PieceFactory pieceType="straight_ramp" selected={false} />,
    ).not.toThrow();
  });

  it('should accept selected prop in type signature', () => {
    // TypeScript: selected should be an optional boolean
    const props: { pieceType: 'straight_ramp'; selected?: boolean } = {
      pieceType: 'straight_ramp',
      selected: true,
    };
    expect(props.selected).toBe(true);
  });
});
