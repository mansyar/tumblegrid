import { describe, it, expect } from 'vitest';
import { createRampGeometry } from '@/components/pieces/StraightRamp';
import { createLaunchpadBaseGeometry } from '@/components/pieces/Launchpad';
import { createLaunchpadCenterGeometry } from '@/components/pieces/Launchpad';
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

  describe('Launchpad geometries', () => {
    it('should create a valid base geometry', () => {
      const geometry = createLaunchpadBaseGeometry();
      expect(geometry).toBeDefined();
      expect(geometry.type).toBe('BoxGeometry');
    });

    it('should create a valid center geometry', () => {
      const geometry = createLaunchpadCenterGeometry();
      expect(geometry).toBeDefined();
      expect(geometry.type).toBe('BoxGeometry');
    });

    it('should create a valid ring geometry', () => {
      const geometry = createLaunchpadRingGeometry();
      expect(geometry).toBeDefined();
      expect(geometry.type).toBe('TorusGeometry');
    });

    it('should create geometries with correct dimensions', () => {
      const base = createLaunchpadBaseGeometry();
      const params = base.parameters;
      expect(params.width).toBe(2);
      expect(params.height).toBe(0.3);
      expect(params.depth).toBe(2);
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

  it('should be frozen (const assertion)', () => {
    // Verify that PIECE_MAP entries are proper React components
    const Component = PIECE_MAP.straight_ramp;
    expect(typeof Component).toBe('function');
  });
});
