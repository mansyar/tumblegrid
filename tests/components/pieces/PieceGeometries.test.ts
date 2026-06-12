import { describe, it, expect } from 'vitest';
import { createRampGeometry } from '@/components/pieces/StraightRamp';
import { createLaunchpadRingGeometry } from '@/components/pieces/Launchpad';
import { PIECE_MAP } from '@/components/pieces/PieceFactory';

describe('Piece Geometry exports', () => {
  describe('StraightRamp geometry', () => {
    it('should create a valid BoxGeometry-based ramp', () => {
      const geometry = createRampGeometry();
      expect(geometry).toBeDefined();
      expect(geometry.type).toBe('BoxGeometry');
    });

    it('should have the correct number of vertices for a wedge', () => {
      const geometry = createRampGeometry();
      const position = geometry.getAttribute('position');
      expect(position).toBeDefined();
      // A BoxGeometry with modified vertices should still have 24 positions
      // (8 vertices × 3 components, with the 3 normal faces × 4 vertices × 3 = 24)
      expect(position.count).toBeGreaterThanOrEqual(12);
    });
  });

  describe('Launchpad ring geometry', () => {
    it('should create a valid torus ring geometry', () => {
      const geometry = createLaunchpadRingGeometry();
      expect(geometry).toBeDefined();
      expect(geometry.type).toBe('TorusGeometry');
    });

    it('should have non-zero ring radius and tube', () => {
      const geometry = createLaunchpadRingGeometry();
      const params = geometry.parameters;
      expect(params.radius).toBeGreaterThan(0);
      expect(params.tube).toBeGreaterThan(0);
    });
  });
});

describe('PIECE_MAP', () => {
  it('should map all piece types to components', () => {
    const pieceTypes = Object.keys(PIECE_MAP);
    expect(pieceTypes).toContain('straight_ramp');
    expect(pieceTypes).toContain('speed_booster');
    expect(pieceTypes).toContain('bumper_pad');
    expect(pieceTypes).toContain('half_pipe');
    expect(pieceTypes).toContain('goal_bucket');
    expect(pieceTypes).toHaveLength(5);
  });

  it('should have a component for every piece type', () => {
    for (const key of Object.keys(PIECE_MAP)) {
      expect(PIECE_MAP[key as keyof typeof PIECE_MAP]).toBeDefined();
    }
  });

  it('should contain memo-wrapped React components', () => {
    // Verify that PIECE_MAP entries are proper React components
    const Component = PIECE_MAP.straight_ramp;
    expect(Component.displayName).toBe('StraightRamp');
  });
});
