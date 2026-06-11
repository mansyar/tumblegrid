import { useCampaignProgress } from '@/hooks/useCampaignProgress';
import { campaignLevels } from '@/levels';
import { useGameStore } from '@/store/useGameStore';
import './LevelSelect.css';

export function LevelSelect() {
  const setCurrentScreen = useGameStore((s) => s.setCurrentScreen);
  const setMode = useGameStore((s) => s.setMode);
  const loadLevel = useGameStore((s) => s.loadLevel);
  const setActiveLevelIndex = useGameStore((s) => s.setActiveLevelIndex);
  const { isLevelUnlocked } = useCampaignProgress();

  const handleLevelClick = (index: number) => {
    const level = campaignLevels[index];
    if (!level) return;
    setMode('CAMPAIGN');
    loadLevel(level);
    setActiveLevelIndex(index);
    setCurrentScreen('game');
  };

  return (
    <div className="level-select" data-testid="level-select">
      <h2 className="level-select__title">Select Level</h2>
      <div className="level-select__grid" data-testid="level-grid">
        {campaignLevels.map((level, index) => {
          const unlocked = isLevelUnlocked(index);
          return (
            <button
              key={level.id}
              className={`level-select__card${unlocked ? '' : ' level-select__card--locked'}`}
              onClick={() => unlocked && handleLevelClick(index)}
              disabled={!unlocked}
              type="button"
              data-testid={`level-card-${index}`}
            >
              <span className="level-select__card-number">
                {unlocked ? index + 1 : '🔒'}
              </span>
              <span className="level-select__card-title">{level.title}</span>
              {!unlocked && (
                <span className="level-select__card-lock">Locked</span>
              )}
            </button>
          );
        })}
      </div>
      <button
        className="level-select__back"
        onClick={() => setCurrentScreen('menu')}
        type="button"
      >
        Back
      </button>
    </div>
  );
}
