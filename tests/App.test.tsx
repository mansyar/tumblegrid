import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '@/App';

vi.mock('@/components/scene/GameCanvas', () => ({
  GameCanvas: () => <div data-testid="game-canvas">GameCanvas</div>,
}));

vi.mock('@/components/ui/HUD', () => ({
  HUD: () => <div data-testid="hud">HUD</div>,
}));

vi.mock('@/components/ui/MainMenu', () => ({
  MainMenu: () => <div data-testid="main-menu">MainMenu</div>,
}));

vi.mock('@/components/ui/LevelSelect', () => ({
  LevelSelect: () => <div data-testid="level-select">LevelSelect</div>,
}));

vi.mock('@/hooks/useEscapeKey', () => ({
  useEscapeKey: () => {},
}));

const mockStore = vi.fn();

vi.mock('@/store/useGameStore', () => ({
  useGameStore: (selector: (state: unknown) => unknown) => mockStore(selector),
}));

describe('App', () => {
  beforeEach(() => {
    mockStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = { currentScreen: 'menu' };
        return selector(state);
      },
    );
  });

  it('renders GameCanvas component', () => {
    render(<App />);
    expect(screen.getByTestId('game-canvas')).toBeDefined();
  });

  it('renders MainMenu by default', () => {
    render(<App />);
    expect(screen.getByTestId('main-menu')).toBeDefined();
  });

  it('does not render HUD on menu screen', () => {
    render(<App />);
    expect(screen.queryByTestId('hud')).toBeNull();
  });

  it('renders LevelSelect when currentScreen is levelSelect', () => {
    mockStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = { currentScreen: 'levelSelect' };
        return selector(state);
      },
    );

    render(<App />);
    expect(screen.getByTestId('level-select')).toBeDefined();
    expect(screen.queryByTestId('main-menu')).toBeNull();
    expect(screen.queryByTestId('hud')).toBeNull();
  });

  it('renders HUD when currentScreen is game', () => {
    mockStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = { currentScreen: 'game' };
        return selector(state);
      },
    );

    render(<App />);
    expect(screen.getByTestId('hud')).toBeDefined();
    expect(screen.queryByTestId('main-menu')).toBeNull();
    expect(screen.queryByTestId('level-select')).toBeNull();
  });

  it('renders with full viewport dimensions', () => {
    const { container } = render(<App />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('100vw');
    expect(wrapper.style.height).toBe('100vh');
  });
});
