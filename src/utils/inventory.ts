import type { PieceType } from '@/store/types';

/**
 * Finds the first piece type with available inventory (> 0 count).
 * Returns null when not in a BUILDING state or when no inventory is available.
 */
export function getFirstAvailablePieceType(
  inventory: Record<PieceType, number>,
  machineState: string,
): PieceType | null {
  if (machineState !== 'BUILDING' && machineState !== 'SANDBOX_BUILDING') {
    return null;
  }

  const available = (Object.entries(inventory) as [PieceType, number][]).find(
    ([_, count]) => count > 0,
  );

  return available?.[0] ?? null;
}
