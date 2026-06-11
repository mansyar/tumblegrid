import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────

vi.mock('@/components/ui/InventoryPanel', () => ({
  InventoryPanel: () => <div data-testid="inventory-panel">InventoryPanel</div>,
}));

vi.mock('@/components/ui/ModeToggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle">ModeToggle</div>,
}));

vi.mock('@/components/ui/ModeIndicator', () => ({
  ModeIndicator: () => <div data-testid="mode-indicator">ModeIndicator</div>,
}));

// ─── Tests ────────────────────────────────────────────────────────────

describe('HUD', () => {
  it('renders InventoryPanel', async () => {
    const { HUD } = await import('@/components/ui/HUD');
    render(<HUD />);
    expect(screen.getByTestId('inventory-panel')).toBeDefined();
  });

  it('renders ModeToggle', async () => {
    const { HUD } = await import('@/components/ui/HUD');
    render(<HUD />);
    expect(screen.getByTestId('mode-toggle')).toBeDefined();
  });

  it('renders ModeIndicator', async () => {
    const { HUD } = await import('@/components/ui/HUD');
    render(<HUD />);
    expect(screen.getByTestId('mode-indicator')).toBeDefined();
  });

  it('has hud-container CSS class', async () => {
    const { HUD } = await import('@/components/ui/HUD');
    const { container } = render(<HUD />);
    const hudElement = container.firstChild as HTMLElement;
    expect(hudElement.className).toContain('hud-container');
  });
});
