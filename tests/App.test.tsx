import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '@/App';

vi.mock('@/components/scene/GameCanvas', () => ({
  GameCanvas: () => <div data-testid="game-canvas">GameCanvas</div>,
}));

vi.mock('@/components/ui/InventoryPanel', () => ({
  InventoryPanel: () => <div data-testid="inventory-panel">InventoryPanel</div>,
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

  it('renders with full viewport dimensions', () => {
    const { container } = render(<App />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('100vw');
    expect(wrapper.style.height).toBe('100vh');
  });
});
