import { useGameStore } from '@/store/useGameStore';
import './ModeIndicator.css';

export function ModeIndicator() {
  const machineState = useGameStore((s) => s.machineState);

  const isBuildMode =
    machineState === 'BUILDING' || machineState === 'SANDBOX_BUILDING';

  return (
    <div className="mode-indicator">
      {isBuildMode ? 'Build Mode' : 'Play Mode'}
    </div>
  );
}
