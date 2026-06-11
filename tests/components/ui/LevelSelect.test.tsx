import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LevelSelect } from '@/components/ui/LevelSelect';

const mockSetCurrentScreen = vi.fn();
const mockSetMode = vi.fn();
const mockLoadLevel = vi.fn();
const mockSetActiveLevelIndex = vi.fn();
const mockIsLevelUnlocked = vi.fn();

vi.mock('@/store/useGameStore', () => ({
  useGameStore: (selector: (state: unknown) => unknown) => {
    const state = {
      setCurrentScreen: mockSetCurrentScreen,
      setMode: mockSetMode,
      loadLevel: mockLoadLevel,
      setActiveLevelIndex: mockSetActiveLevelIndex,
    };
    return selector(state);
  },
}));

vi.mock('@/hooks/useCampaignProgress', () => ({
  useCampaignProgress: () => ({
    isLevelUnlocked: mockIsLevelUnlocked,
    completeLevel: vi.fn(),
    getUnlockedLevels: vi.fn(),
    completedLevels: new Set<number>(),
  }),
}));

describe('LevelSelect', () => {
  beforeEach(() => {
    mockIsLevelUnlocked.mockReset();
    mockSetCurrentScreen.mockReset();
    mockSetMode.mockReset();
    mockLoadLevel.mockReset();
    mockSetActiveLevelIndex.mockReset();
    mockIsLevelUnlocked.mockImplementation((index: number) => index === 0);
  });

  it('renders the title', () => {
    render(<LevelSelect />);
    expect(screen.getByText('Select Level')).toBeDefined();
  });

  it('renders 5 level cards', () => {
    render(<LevelSelect />);
    const cards = screen.getAllByTestId(/^level-card-/);
    expect(cards).toHaveLength(5);
  });

  it('renders Back button', () => {
    render(<LevelSelect />);
    expect(screen.getByText('Back')).toBeDefined();
  });

  it('shows Locked text for locked levels', () => {
    render(<LevelSelect />);
    const lockLabels = screen.getAllByText('Locked');
    expect(lockLabels).toHaveLength(4);
  });

  it('does not show Locked text for unlocked level', () => {
    render(<LevelSelect />);
    const lockedLabels = screen.queryAllByText('Locked');
    expect(lockedLabels).toHaveLength(4);
    const firstCard = screen.getByTestId('level-card-0');
    expect(firstCard.textContent).not.toContain('Locked');
  });

  it('calls navigation actions when an unlocked level is clicked', async () => {
    const user = userEvent.setup();

    render(<LevelSelect />);
    const firstCard = screen.getByTestId('level-card-0');
    await user.click(firstCard);

    expect(mockSetMode).toHaveBeenCalledWith('CAMPAIGN');
    expect(mockLoadLevel).toHaveBeenCalledTimes(1);
    expect(mockSetActiveLevelIndex).toHaveBeenCalledWith(0);
    expect(mockSetCurrentScreen).toHaveBeenCalledWith('game');
  });

  it('does not call navigation when a locked level is clicked', async () => {
    const user = userEvent.setup();

    render(<LevelSelect />);
    const secondCard = screen.getByTestId('level-card-1');
    await user.click(secondCard);

    expect(mockSetMode).not.toHaveBeenCalled();
    expect(mockLoadLevel).not.toHaveBeenCalled();
    expect(mockSetCurrentScreen).not.toHaveBeenCalled();
  });

  it('disables locked level buttons', () => {
    render(<LevelSelect />);
    const firstCard = screen.getByTestId('level-card-0');
    expect(firstCard).not.toBeDisabled();

    const secondCard = screen.getByTestId('level-card-1');
    expect(secondCard).toBeDisabled();
  });

  it('navigates back to menu on Back click', async () => {
    const user = userEvent.setup();

    render(<LevelSelect />);
    await user.click(screen.getByText('Back'));

    expect(mockSetCurrentScreen).toHaveBeenCalledWith('menu');
  });

  it('renders with data-testid attribute', () => {
    render(<LevelSelect />);
    expect(screen.getByTestId('level-select')).toBeDefined();
  });

  it('shows lock emoji for locked levels', () => {
    render(<LevelSelect />);
    const secondCard = screen.getByTestId('level-card-1');
    expect(secondCard.textContent).toContain('🔒');
  });
});
