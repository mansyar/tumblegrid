import type { PlacedPiece } from '@/store/types';
import {
  computeTrajectoryWaypoints,
  findNearestPiece,
} from '@/utils/trajectory';
import { describe, expect, it } from 'vitest';

function makePiece(
  id: string,
  type: PlacedPiece['type'],
  x: number,
  z: number,
  rotationIndex: 0 | 1 | 2 | 3 = 0,
  y = 0,
): PlacedPiece {
  return { id, type, position: [x, y, z], rotationIndex };
}

describe('findNearestPiece', () => {
  it('returns the closest piece by horizontal distance', () => {
    const pieces = [
      makePiece('a', 'straight_ramp', 0, 0),
      makePiece('b', 'speed_booster', 10, 10),
    ];
    const result = findNearestPiece(pieces, [2, 0, 2]);
    expect(result?.id).toBe('a');
  });

  it('returns undefined for empty array', () => {
    expect(findNearestPiece([], [0, 0, 0])).toBeUndefined();
  });

  it('favors single piece correctly', () => {
    const pieces = [makePiece('x', 'straight_ramp', 6, 6)];
    const result = findNearestPiece(pieces, [4, 0, 4]);
    expect(result?.id).toBe('x');
  });
});

describe('computeTrajectoryWaypoints', () => {
  it('returns empty array when no placed pieces exist', () => {
    const result = computeTrajectoryWaypoints(
      [],
      [4, 0, 2],
      'speed_booster',
    );
    expect(result).toEqual([]);
  });

  it('returns empty array when hovered position is null', () => {
    const pieces = [makePiece('a', 'straight_ramp', 2, 2)];
    const result = computeTrajectoryWaypoints(
      pieces,
      null,
      'speed_booster',
    );
    expect(result).toEqual([]);
  });

  it('finds nearest piece and computes waypoints from its exit face to target entry/exit faces', () => {
    // straight_ramp at [0,0,0] rot 0: exit=[+1,0,0] → exit face at [1,0,0]
    // target (selectedPieceType: speed_booster rot 0): entry=[-1,0,0], exit=[+1,0,0]
    // hover at [4,0,0]
    const pieces = [makePiece('a', 'straight_ramp', 0, 0)];
    const result = computeTrajectoryWaypoints(
      pieces,
      [4, 0, 0],
      'speed_booster',
    );

    // source exit face = [0+1, 0, 0] = [1,0,0]
    // intermediate: cell at [2,0,0]
    // target entry face = [4-1, 0, 0] = [3,0,0]
    // target exit face = [4+1, 0, 0] = [5,0,0]
    expect(result).toEqual([
      [1, 0, 0],
      [2, 0, 0],
      [3, 0, 0],
      [5, 0, 0],
    ]);
  });

  it('handles adjacent pieces without intermediate cells', () => {
    // straight_ramp at [2,0,2] rot 0: exit=[+1,0,0], exit face=[3,0,2]
    // hover at [4,0,2], pieceType: straight_ramp rot 0: entry=[0,+1,0], exit=[+1,0,0]
    // entry face=[4,1,2], exit face=[5,0,2]
    const pieces = [makePiece('a', 'straight_ramp', 2, 2)];
    const result = computeTrajectoryWaypoints(
      pieces,
      [4, 0, 2],
      'straight_ramp',
    );

    // Adjacent: gap = |4-2|/2 = 1, so no intermediate cells (loop runs 0 times)
    expect(result).toEqual([
      [3, 0, 2],
      [4, 1, 2],
      [5, 0, 2],
    ]);
  });

  it('uses selected piece as source when selectedPieceId is provided', () => {
    // Two pieces: 'a' at [0,0,0], 'b' at [10,0,10]
    // Hover at [4,0,4] — nearest would be 'a' (distance 32 vs 200)
    // But selectedPieceId='b' overrides
    const pieces = [
      makePiece('a', 'straight_ramp', 0, 0),
      makePiece('b', 'straight_ramp', 10, 10),
    ];
    const result = computeTrajectoryWaypoints(
      pieces,
      [4, 0, 4],
      'speed_booster',
      'b',
    );

    // source 'b' at [10,0,10], exit=[+1,0,0] → exit face=[11,0,10]
    // intermediate: [8,0,8], [6,0,6]
    // target entry = [4-1, 0, 4] = [3,0,4]
    // target exit = [4+1, 0, 4] = [5,0,4]
    expect(result).toEqual([
      [11, 0, 10],
      [8, 0, 8],
      [6, 0, 6],
      [3, 0, 4],
      [5, 0, 4],
    ]);
  });

  it('deduplicates when source exit face equals target entry face', () => {
    // straight_ramp at [0,0,0] rot 0: exit=[+1,0,0], exit face=[1,0,0]
    // speed_booster at [2,0,0] rot 0: entry=[-1,0,0], entry face=[1,0,0]
    // Same point! Should only appear once.
    const pieces = [makePiece('a', 'straight_ramp', 0, 0)];
    const result = computeTrajectoryWaypoints(
      pieces,
      [2, 0, 0],
      'speed_booster',
    );

    // source exit = [1,0,0]
    // cell gap = |2-0|/2 = 1, no intermediates
    // target entry = [2-1,0,0] = [1,0,0] (duplicate → skipped)
    // target exit = [2+1,0,0] = [3,0,0]
    expect(result).toEqual([[1, 0, 0], [3, 0, 0]]);
  });

  it('handles goal_bucket which has no exit ([0,0,0])', () => {
    // straight_ramp at [0,0,0] rot 0: exit=[+1,0,0], exit face=[1,0,0]
    // goal_bucket at [4,0,0] rot 0: entry=[0,+1,0], exit=[0,0,0]
    const pieces = [makePiece('a', 'straight_ramp', 0, 0)];
    const result = computeTrajectoryWaypoints(
      pieces,
      [4, 0, 0],
      'goal_bucket',
    );

    // source exit = [1,0,0]
    // intermediate: cell at [2,0,0] (gap=2 cells, only 1 intermediate)
    // target entry = [4,1,0] (= [0+4, 1, 0+0])
    // target exit = [4,0,0] (= [0+4, 0, 0+0])
    expect(result).toEqual([
      [1, 0, 0],
      [2, 0, 0],
      [4, 1, 0],
      [4, 0, 0],
    ]);
  });

  it('returns empty array when selectedPieceId does not match any piece', () => {
    const pieces = [makePiece('a', 'straight_ramp', 0, 0)];
    const result = computeTrajectoryWaypoints(
      pieces,
      [4, 0, 4],
      'speed_booster',
      'nonexistent',
    );
    // Falls back to nearest piece 'a'
    expect(result.length).toBeGreaterThan(0);
  });
});
