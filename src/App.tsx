import { GameCanvas } from '@/components/scene/GameCanvas';
import { InventoryPanel } from '@/components/ui/InventoryPanel';
import { ModeToggle } from '@/components/ui/ModeToggle';
import { ModeIndicator } from '@/components/ui/ModeIndicator';
import { useEscapeKey } from '@/hooks/useEscapeKey';

export function App() {
  useEscapeKey();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameCanvas />
      <InventoryPanel />
      <ModeToggle />
      <ModeIndicator />
    </div>
  );
}
