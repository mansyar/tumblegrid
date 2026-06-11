import { PIECE_META } from '@/constants/pieceMeta';
import type { PieceType } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';

const PIECE_TYPES: PieceType[] = [
  'straight_ramp',
  'speed_booster',
  'bumper_pad',
  'half_pipe',
  'goal_bucket',
];

export function InventoryPanel() {
  const inventory = useGameStore((s) => s.inventory);
  const selectedBlueprintType = useGameStore(
    (s) => s.selectedBlueprintType,
  );
  const setSelectedBlueprintType = useGameStore(
    (s) => s.setSelectedBlueprintType,
  );

  return (
    <div className="inventory-panel">
      {PIECE_TYPES.map((pieceType) => {
        const count = inventory[pieceType];
        const isActive = selectedBlueprintType === pieceType;
        const isDisabled = count <= 0;
        const meta = PIECE_META[pieceType];

        return (
          <button
            key={pieceType}
            type="button"
            className="inventory-item"
            data-active={isActive}
            data-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) {
                setSelectedBlueprintType(pieceType);
              }
            }}
          >
            <span
              className="inventory-item-icon"
              style={{ backgroundColor: meta.color }}
            />
            <span className="inventory-item-label">{meta.label}</span>
            <span className="inventory-item-count">{`x${count}`}</span>
          </button>
        );
      })}
    </div>
  );
}
