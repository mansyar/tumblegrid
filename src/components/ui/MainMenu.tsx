import { useGameStore } from '@/store/useGameStore';
import './MainMenu.css';

export function MainMenu() {
  const setCurrentScreen = useGameStore((s) => s.setCurrentScreen);

  return (
    <div className="main-menu" data-testid="main-menu">
      <h1 className="main-menu__title">TumbleGrid</h1>
      <div className="main-menu__buttons">
        <button
          className="main-menu__button main-menu__button--campaign"
          onClick={() => setCurrentScreen('levelSelect')}
          type="button"
        >
          Campaign
        </button>
        <button
          className="main-menu__button main-menu__button--sandbox"
          onClick={() => setCurrentScreen('game')}
          type="button"
        >
          Sandbox
        </button>
      </div>
    </div>
  );
}
