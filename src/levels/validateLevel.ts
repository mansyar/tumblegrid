import type { LevelDefinition, PieceType } from '@/store/types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const VALID_PIECE_TYPES: PieceType[] = [
  'straight_ramp',
  'speed_booster',
  'bumper_pad',
  'half_pipe',
  'goal_bucket',
];

export function validateLevel(level: LevelDefinition): ValidationResult {
  const errors: string[] = [];

  // Rule 2: Bounds compliance
  const checkBounds = (position: [number, number, number], label: string) => {
    const { width, depth, height } = level.gridBounds;
    if (
      position[0] < 0 ||
      position[0] >= width ||
      position[1] < 0 ||
      position[1] >= height ||
      position[2] < 0 ||
      position[2] >= depth
    ) {
      errors.push(
        `${label} position [${position}] is out of bounds (grid: ${width}x${depth}x${height})`,
      );
    }
  };

  // Rule 3: No overlap check
  const positions = new Map<string, string>();
  const checkOverlap = (position: [number, number, number], label: string) => {
    const key = `${position[0]},${position[1]},${position[2]}`;
    if (positions.has(key)) {
      errors.push(
        `Overlap detected at [${position}] between ${positions.get(key)} and ${label}`,
      );
    }
    positions.set(key, label);
  };

  // Rule 4: Inventory validity check
  for (const key of Object.keys(level.inventory)) {
    if (!VALID_PIECE_TYPES.includes(key as PieceType)) {
      errors.push(`Invalid inventory key: ${key}`);
    }
  }

  // Rule 7: Inventory non-negative check
  for (const [key, value] of Object.entries(level.inventory)) {
    if (value !== undefined && value < 0) {
      errors.push(`Inventory for ${key} is negative: ${value}`);
    }
  }

  // Rule 5: Launchpad bounds check
  checkBounds(level.launchpadPosition, 'Launchpad');

  // Rule 6: Goal presence/absence check
  if (level.id === 'sandbox') {
    if (level.goalPosition !== undefined) {
      errors.push('Sandbox level must not have goalPosition');
    }
  } else {
    if (level.goalPosition === undefined) {
      errors.push('Campaign level must have goalPosition');
    }
  }

  // Rule 9: Launchpad uniqueness check
  checkOverlap(level.launchpadPosition, 'Launchpad');

  // Check static terrain pieces
  for (let i = 0; i < level.staticTerrain.length; i++) {
    const piece = level.staticTerrain[i];
    const label = `StaticTerrain[${i}] (${piece.type})`;

    // Rule 4: Valid piece type
    if (!VALID_PIECE_TYPES.includes(piece.type)) {
      errors.push(`${label} has invalid type: ${piece.type}`);
    }

    // Rule 8: Rotation index range check
    if (piece.rotationIndex < 0 || piece.rotationIndex > 3) {
      errors.push(`${label} has invalid rotationIndex: ${piece.rotationIndex}`);
    }

    // Rule 2: Bounds compliance
    checkBounds(piece.position, label);

    // Rule 3: No overlap
    checkOverlap(piece.position, label);
  }

  // Goal bounds check (if present) - but don't check overlap since goal_bucket is at same position
  if (level.goalPosition) {
    checkBounds(level.goalPosition, 'Goal');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateLevelSet(levels: LevelDefinition[]): ValidationResult {
  const errors: string[] = [];

  // Rule 1: ID uniqueness check
  const ids = new Set<string>();
  for (const level of levels) {
    if (ids.has(level.id)) {
      errors.push(`Duplicate level ID: ${level.id}`);
    }
    ids.add(level.id);

    // Validate each individual level
    const result = validateLevel(level);
    errors.push(...result.errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
