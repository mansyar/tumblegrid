import { InventoryPanel } from '@/components/ui/InventoryPanel';
import { LevelIntro } from '@/components/ui/LevelIntro';
import { ModeIndicator } from '@/components/ui/ModeIndicator';
import { ModeToggle } from '@/components/ui/ModeToggle';
import { MuteToggle } from '@/components/ui/MuteToggle';
import { VictoryOverlay } from '@/components/ui/VictoryOverlay';
import './HUD.css';

export function HUD() {
  return (
    <div className="hud-container">
      <InventoryPanel />
      <ModeToggle />
      <ModeIndicator />
      <LevelIntro />
      <VictoryOverlay />
      <MuteToggle />
    </div>
  );
}
