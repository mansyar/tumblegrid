import { GameCanvas } from '@/components/scene/GameCanvas';
import { HUD } from '@/components/ui/HUD';
import { LevelSelect } from '@/components/ui/LevelSelect';
import { MainMenu } from '@/components/ui/MainMenu';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useGameStore } from '@/store/useGameStore';

export function App() {
  const currentScreen = useGameStore((s) => s.currentScreen);
  useEscapeKey();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameCanvas />
      {currentScreen === 'menu' && <MainMenu />}
      {currentScreen === 'levelSelect' && <LevelSelect />}
      {currentScreen === 'game' && <HUD />}
    </div>
  );
}
