import type { LevelDefinition, PieceType } from '@/store/types';

/**
 * A piece placed by the player as part of a solution.
 * This is what the test defines as the "intended solution" for a level.
 */
export interface SolutionPiece {
  pieceType: PieceType;
  position: [number, number, number];
  rotationIndex: 0 | 1 | 2 | 3;
}

/**
 * Result of validating a solution against a level definition.
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Piece types that players can place from inventory.
 * goal_bucket is always static terrain, not a player-placed piece.
 */
const PLACEABLE_PIECE_TYPES: PieceType[] = [
  'straight_ramp',
  'speed_booster',
  'bumper_pad',
  'half_pipe',
];

/**
 * Validates a solution against a level definition.
 *
 * Checks:
 * 1. All piece types are valid placeable types
 * 2. Solution fits within the level's inventory (no overuse)
 * 3. All positions are within grid bounds
 * 4. No overlapping pieces (solution vs solution, solution vs static terrain)
 * 5. No piece on top of the launchpad or goal bucket
 *
 * @param level - The level definition to validate against
 * @param solutionPieces - The pieces placed as the intended solution
 * @returns ValidationResult with valid flag and list of errors
 */
export function validateSolution(
  level: LevelDefinition,
  solutionPieces: SolutionPiece[],
): ValidationResult {
  const errors: string[] = [];

  // Build inventory usage counter
  const inventoryUsed: Partial<Record<PieceType, number>> = {};

  // Track all occupied positions: "x,y,z" -> description
  const occupied = new Map<string, string>();

  // Register static terrain positions
  for (const terrain of level.staticTerrain) {
    const key = terrain.position.join(',');
    occupied.set(key, `static ${terrain.type} at [${terrain.position}]`);
  }

  // Register launchpad position
  const launchpadKey = level.launchpadPosition.join(',');
  occupied.set(launchpadKey, `launchpad at [${level.launchpadPosition}]`);

  // Register goal position if present
  if (level.goalPosition) {
    const goalKey = level.goalPosition.join(',');
    occupied.set(goalKey, `goal at [${level.goalPosition}]`);
  }

  // Validate each solution piece
  for (let i = 0; i < solutionPieces.length; i++) {
    const piece = solutionPieces[i];
    const label = `piece ${i} (${piece.pieceType} at [${piece.position}])`;

    // Check 1: Valid piece type
    if (!PLACEABLE_PIECE_TYPES.includes(piece.pieceType)) {
      errors.push(`${label}: invalid piece type '${piece.pieceType}' — must be one of: ${PLACEABLE_PIECE_TYPES.join(', ')}`);
      continue; // Skip further checks for this piece
    }

    // Check 2: Inventory usage
    const currentUsed = inventoryUsed[piece.pieceType] ?? 0;
    inventoryUsed[piece.pieceType] = currentUsed + 1;

    const available = level.inventory[piece.pieceType] ?? 0;
    if (currentUsed + 1 > available) {
      errors.push(
        `${label}: exceeds inventory — used ${currentUsed + 1} but only ${available} available`,
      );
    }

    // Check 3: Within grid bounds
    const [x, y, z] = piece.position;
    const { width, depth, height } = level.gridBounds;

    if (x < 0 || x >= width) {
      errors.push(`${label}: x=${x} is out of bounds (0..${width - 1})`);
    }
    if (y < 0 || y >= height) {
      errors.push(`${label}: y=${y} is out of bounds (0..${height - 1})`);
    }
    if (z < 0 || z >= depth) {
      errors.push(`${label}: z=${z} is out of bounds (0..${depth - 1})`);
    }

    // Check 4: No overlap with existing pieces
    const key = piece.position.join(',');
    if (occupied.has(key)) {
      errors.push(
        `${label}: overlaps with ${occupied.get(key)}`,
      );
    }

    // Register this piece's position
    occupied.set(key, `${label}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Counts how many of each piece type appear in a solution.
 * Useful for verifying inventory fit without full validation.
 */
export function countSolutionPieces(
  solutionPieces: SolutionPiece[],
): Partial<Record<PieceType, number>> {
  const counts: Partial<Record<PieceType, number>> = {};
  for (const piece of solutionPieces) {
    counts[piece.pieceType] = (counts[piece.pieceType] ?? 0) + 1;
  }
  return counts;
}
