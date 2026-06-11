import { useGameStore } from '@/store/useGameStore';

export function LevelSelect() {
  const setCurrentScreen = useGameStore((s) => s.setCurrentScreen);

  return (
    <div className="level-select">
      <h2 className="level-select__title">Select Level</h2>
      <div className="level-select__grid" data-testid="level-grid">
        {/* Level cards will be implemented in Task 1.4 */}
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
