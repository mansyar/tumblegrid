import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '@/App';

vi.mock('@/components/scene/GameCanvas', () => ({
  GameCanvas: () => <div data-testid="game-canvas">GameCanvas</div>,
}));

vi.mock('@/components/ui/InventoryPanel', () => ({
  InventoryPanel: () => <div data-testid="inventory-panel">InventoryPanel</div>,
}));

vi.mock('@/components/ui/ModeToggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle">ModeToggle</div>,
}));

vi.mock('@/components/ui/ModeIndicator', () => ({
  ModeIndicator: () => <div data-testid="mode-indicator">ModeIndicator</div>,
}));

vi.mock('@/hooks/useEscapeKey', () => ({
  useEscapeKey: () => {},
}));

describe('App', () => {
  it('renders GameCanvas component', () => {
    render(<App />);
    expect(screen.getByTestId('game-canvas')).toBeDefined();
  });

  it('renders InventoryPanel component', () => {
    render(<App />);
    expect(screen.getByTestId('inventory-panel')).toBeDefined();
  });

  it('renders ModeToggle component', () => {
    render(<App />);
    expect(screen.getByTestId('mode-toggle')).toBeDefined();
  });

  it('renders ModeIndicator component', () => {
    render(<App />);
    expect(screen.getByTestId('mode-indicator')).toBeDefined();
  });

  it('renders with full viewport dimensions', () => {
    const { container } = render(<App />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('100vw');
    expect(wrapper.style.height).toBe('100vh');
  });
});
