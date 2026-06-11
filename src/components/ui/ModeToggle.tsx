import { useGameStore } from '@/store/useGameStore';
import './ModeToggle.css';

export function ModeToggle() {
  const machineState = useGameStore((s) => s.machineState);
  const transitionState = useGameStore((s) => s.transitionState);

  const isPlaying =
    machineState === 'PLAYING' || machineState === 'SANDBOX_PLAYING';

  const handlePlay = () => {
    if (machineState === 'BUILDING') {
      transitionState('PLAYING');
    } else if (machineState === 'SANDBOX_BUILDING') {
      transitionState('SANDBOX_PLAYING');
    }
  };

  const handleStop = () => {
    if (machineState === 'PLAYING') {
      transitionState('BUILDING');
    } else if (machineState === 'SANDBOX_PLAYING') {
      transitionState('SANDBOX_BUILDING');
    }
  };

  return (
    <div className="mode-toggle">
      {isPlaying ? (
        <button
          type="button"
          className="mode-toggle-stop"
          aria-label="Stop"
          onClick={handleStop}
        >
          Stop
        </button>
      ) : (
        <button
          type="button"
          className="mode-toggle-play"
          aria-label="Play"
          onClick={handlePlay}
        >
          Play
        </button>
      )}
    </div>
  );
}
