import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MainMenu } from '@/components/ui/MainMenu';

const mockSetCurrentScreen = vi.fn();

vi.mock('@/store/useGameStore', () => ({
  useGameStore: (selector: (state: unknown) => unknown) => {
    const state = { setCurrentScreen: mockSetCurrentScreen };
    return selector(state);
  },
}));

describe('MainMenu', () => {
  beforeEach(() => {
    mockSetCurrentScreen.mockReset();
  });

  it('renders the title TumbleGrid', () => {
    render(<MainMenu />);
    expect(screen.getByText('TumbleGrid')).toBeDefined();
  });

  it('renders Campaign button', () => {
    render(<MainMenu />);
    expect(screen.getByText('Campaign')).toBeDefined();
  });

  it('renders Sandbox button', () => {
    render(<MainMenu />);
    expect(screen.getByText('Sandbox')).toBeDefined();
  });

  it('calls setCurrentScreen with levelSelect when Campaign is clicked', async () => {
    const user = userEvent.setup();

    render(<MainMenu />);
    await user.click(screen.getByText('Campaign'));
    expect(mockSetCurrentScreen).toHaveBeenCalledWith('levelSelect');
  });

  it('calls setCurrentScreen with game when Sandbox is clicked', async () => {
    const user = userEvent.setup();

    render(<MainMenu />);
    await user.click(screen.getByText('Sandbox'));
    expect(mockSetCurrentScreen).toHaveBeenCalledWith('game');
  });

  it('has data-testid attribute', () => {
    render(<MainMenu />);
    expect(screen.getByTestId('main-menu')).toBeDefined();
  });
});
