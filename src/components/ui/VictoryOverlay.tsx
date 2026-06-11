import { campaignLevels } from '@/levels';
import { useGameStore } from '@/store/useGameStore';
import './VictoryOverlay.css';

export function VictoryOverlay() {
  const machineState = useGameStore((s) => s.machineState);
  const activeLevelIndex = useGameStore((s) => s.activeLevelIndex);
  const loadLevel = useGameStore((s) => s.loadLevel);
  const setActiveLevelIndex = useGameStore((s) => s.setActiveLevelIndex);
  const setShowLevelIntro = useGameStore((s) => s.setShowLevelIntro);
  const resetLevel = useGameStore((s) => s.resetLevel);
  const setCurrentScreen = useGameStore((s) => s.setCurrentScreen);

  if (machineState !== 'LEVEL_CLEARED') {
    return null;
  }

  const isLastLevel =
    activeLevelIndex !== undefined &&
    activeLevelIndex >= campaignLevels.length - 1;

  const handleNextLevel = () => {
    if (activeLevelIndex === undefined || isLastLevel) return;
    const nextIndex = activeLevelIndex + 1;
    const nextLevel = campaignLevels[nextIndex];
    if (!nextLevel) return;
    loadLevel(nextLevel);
    setActiveLevelIndex(nextIndex);
    setShowLevelIntro(true);
  };

  const handleRetry = () => {
    resetLevel();
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <div className="victory-overlay" data-testid="victory-overlay">
      <h2 className="victory-overlay__title">Level Complete!</h2>
      <div className="victory-overlay__buttons">
        <button
          className="victory-overlay__button victory-overlay__button--next"
          onClick={handleNextLevel}
          disabled={isLastLevel}
          type="button"
          data-testid="victory-next-level"
        >
          Next Level
        </button>
        <button
          className="victory-overlay__button victory-overlay__button--retry"
          onClick={handleRetry}
          type="button"
          data-testid="victory-retry"
        >
          Retry
        </button>
        <button
          className="victory-overlay__button victory-overlay__button--menu"
          onClick={handleBackToMenu}
          type="button"
          data-testid="victory-back-to-menu"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
