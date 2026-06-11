import { GameCanvas } from '@/components/scene/GameCanvas';
import { InventoryPanel } from '@/components/ui/InventoryPanel';

export function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameCanvas />
      <InventoryPanel />
    </div>
  );
}
