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
