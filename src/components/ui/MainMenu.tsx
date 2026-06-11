import { useGameStore } from '@/store/useGameStore';

export function MainMenu() {
  const setCurrentScreen = useGameStore((s) => s.setCurrentScreen);

  return (
    <div className="main-menu">
      <h1 className="main-menu__title">TumbleGrid</h1>
      <div className="main-menu__buttons">
        <button
          className="main-menu__button"
          onClick={() => setCurrentScreen('levelSelect')}
          type="button"
        >
          Campaign
        </button>
        <button
          className="main-menu__button"
          onClick={() => setCurrentScreen('game')}
          type="button"
        >
          Sandbox
        </button>
      </div>
    </div>
  );
}
