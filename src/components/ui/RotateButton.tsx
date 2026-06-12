import { useAudio } from '@/hooks/useAudio';
import { useGameStore } from '@/store/useGameStore';
import './RotateButton.css';

export function RotateButton() {
  const machineState = useGameStore((s) => s.machineState);
  const selectedPieceId = useGameStore((s) => s.selectedPieceId);
  const activeBlueprintNode = useGameStore((s) => s.activeBlueprintNode);
  const rotatePiece = useGameStore((s) => s.rotatePiece);
  const updateActiveBlueprint = useGameStore((s) => s.updateActiveBlueprint);
  const { playUIClick } = useAudio();

  const isBuilding =
    machineState === 'BUILDING' || machineState === 'SANDBOX_BUILDING';

  const hasTarget = selectedPieceId !== null || activeBlueprintNode !== null;

  const handleRotate = () => {
    if (selectedPieceId) {
      playUIClick('rotate');
      rotatePiece(selectedPieceId);
      return;
    }

    if (activeBlueprintNode) {
      playUIClick('rotate');
      const newRotation = ((activeBlueprintNode.rotationIndex + 1) % 4) as
        | 0
        | 1
        | 2
        | 3;
      updateActiveBlueprint({
        ...activeBlueprintNode,
        rotationIndex: newRotation,
      });
    }
  };

  if (!isBuilding || !hasTarget) return null;

  return (
    <div className="rotate-button-container">
      <button
        type="button"
        className="rotate-button"
        aria-label="Rotate piece"
        onClick={handleRotate}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21.5 2v6h-6M2.5 22v-6h6" />
          <path d="M2.5 12a9.96 9.96 0 0 1 3-7.07L8 2.5M21.5 12a9.96 9.96 0 0 1-3 7.07L16 21.5" />
        </svg>
      </button>
    </div>
  );
}
