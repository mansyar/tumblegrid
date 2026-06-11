import { InventoryPanel } from '@/components/ui/InventoryPanel';
import { ModeIndicator } from '@/components/ui/ModeIndicator';
import { ModeToggle } from '@/components/ui/ModeToggle';
import './HUD.css';

export function HUD() {
  return (
    <div className="hud-container">
      <InventoryPanel />
      <ModeToggle />
      <ModeIndicator />
    </div>
  );
}
