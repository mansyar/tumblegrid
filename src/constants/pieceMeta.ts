import type { PieceType } from '@/store/types';

export interface PieceMeta {
  label: string;
  color: string;
}

export const PIECE_META: Record<PieceType, PieceMeta> = {
  straight_ramp: { label: 'Straight Ramp', color: '#4A90D9' },
  speed_booster: { label: 'Speed Booster', color: '#E67E22' },
  bumper_pad: { label: 'Bumper Pad', color: '#27AE60' },
  half_pipe: { label: 'Half Pipe', color: '#8E44AD' },
  goal_bucket: { label: 'Goal Bucket', color: '#F1C40F' },
} as const;

/** Direction of a face relative to a piece's cell center (unit vector * half-cell). */
export interface FaceDirections {
  /** Direction from cell center toward the entry face. */
  entry: [number, number, number];
  /** Direction from cell center toward the exit face. */
  exit: [number, number, number];
}

/**
 * Entry/exit face directions for each piece type, indexed by rotationIndex (0-3).
 * All directions are unit vectors, with offset = direction * 1 (half of 2-unit cell).
 *
 * Straight Ramp:
 *   rot 0/1 — descending: entry top (+Y), exit +X/+Z.
 *   rot 2/3 — ascending:  entry bottom (-Y), exit -X/-Z.
 * Speed Booster / Half Pipe: pass-through, entry opposite exit.
 * Bumper Pad: reflect wall — entry and exit are opposite.
 * Goal Bucket: entry top (+Y), exit [0,0,0] (sink — no exit).
 */
export const PIECE_DIRECTIONS: Record<PieceType, FaceDirections[]> = {
  straight_ramp: [
    { entry: [0, 1, 0], exit: [1, 0, 0] },
    { entry: [0, 1, 0], exit: [0, 0, 1] },
    { entry: [0, -1, 0], exit: [-1, 0, 0] },
    { entry: [0, -1, 0], exit: [0, 0, -1] },
  ],
  speed_booster: [
    { entry: [-1, 0, 0], exit: [1, 0, 0] },
    { entry: [0, 0, -1], exit: [0, 0, 1] },
    { entry: [1, 0, 0], exit: [-1, 0, 0] },
    { entry: [0, 0, 1], exit: [0, 0, -1] },
  ],
  bumper_pad: [
    { entry: [1, 0, 0], exit: [-1, 0, 0] },
    { entry: [0, 0, 1], exit: [0, 0, -1] },
    { entry: [-1, 0, 0], exit: [1, 0, 0] },
    { entry: [0, 0, -1], exit: [0, 0, 1] },
  ],
  half_pipe: [
    { entry: [-1, 0, 0], exit: [1, 0, 0] },
    { entry: [0, 0, -1], exit: [0, 0, 1] },
    { entry: [1, 0, 0], exit: [-1, 0, 0] },
    { entry: [0, 0, 1], exit: [0, 0, -1] },
  ],
  goal_bucket: [
    { entry: [0, 1, 0], exit: [0, 0, 0] },
    { entry: [0, 1, 0], exit: [0, 0, 0] },
    { entry: [0, 1, 0], exit: [0, 0, 0] },
    { entry: [0, 1, 0], exit: [0, 0, 0] },
  ],
} as const;
