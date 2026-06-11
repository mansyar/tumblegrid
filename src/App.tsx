import { GameCanvas } from '@/components/scene/GameCanvas';
import { HUD } from '@/components/ui/HUD';
import { useEscapeKey } from '@/hooks/useEscapeKey';

export function App() {
  useEscapeKey();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameCanvas />
      <HUD />
    </div>
  );
}
