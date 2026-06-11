import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';
import './LevelIntro.css';

export function LevelIntro() {
  const showLevelIntro = useGameStore((s) => s.showLevelIntro);
  const setShowLevelIntro = useGameStore((s) => s.setShowLevelIntro);
  const levelDefinition = useGameStore((s) => s.stashedLevelDefinition);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (showLevelIntro) {
      timerRef.current = setTimeout(() => {
        setShowLevelIntro(false);
      }, 3000);
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [showLevelIntro, setShowLevelIntro]);

  if (!showLevelIntro || !levelDefinition) {
    return null;
  }

  const handleDismiss = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowLevelIntro(false);
  };

  return (
    <button
      className="level-intro"
      onClick={handleDismiss}
      type="button"
      data-testid="level-intro"
    >
      <h2 className="level-intro__title">{levelDefinition.title}</h2>
      <p className="level-intro__description">
        {levelDefinition.description}
      </p>
      <span className="level-intro__dismiss">Click anywhere to continue</span>
    </button>
  );
}
