import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSetCurrentScreen = vi.fn();
const mockLoadLevel = vi.fn();
const mockSetActiveLevelIndex = vi.fn();
const mockSetShowLevelIntro = vi.fn();
const mockResetLevel = vi.fn();

let mockMachineState = 'BUILDING';
let mockActiveLevelIndex: number | undefined = 0;

vi.mock('@/store/useGameStore', () => ({
  useGameStore: (selector: (state: unknown) => unknown) => {
    const state = {
      machineState: mockMachineState,
      activeLevelIndex: mockActiveLevelIndex,
      activeMode: 'CAMPAIGN',
      loadLevel: mockLoadLevel,
      setActiveLevelIndex: mockSetActiveLevelIndex,
      setShowLevelIntro: mockSetShowLevelIntro,
      resetLevel: mockResetLevel,
      setCurrentScreen: mockSetCurrentScreen,
    };
    return selector(state);
  },
}));

describe('VictoryOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMachineState = 'BUILDING';
    mockActiveLevelIndex = 0;
  });

  it('renders nothing when machineState is not LEVEL_CLEARED', async () => {
    const { VictoryOverlay } = await import('@/components/ui/VictoryOverlay');
    const { container } = render(<VictoryOverlay />);
    expect(container.innerHTML).toBe('');
  });

  it('renders overlay when LEVEL_CLEARED', async () => {
    mockMachineState = 'LEVEL_CLEARED';
    const { VictoryOverlay } = await import('@/components/ui/VictoryOverlay');
    render(<VictoryOverlay />);
    expect(screen.getByTestId('victory-overlay')).toBeDefined();
    expect(screen.getByText('Level Complete!')).toBeDefined();
  });

  it('renders three buttons', async () => {
    mockMachineState = 'LEVEL_CLEARED';
    const { VictoryOverlay } = await import('@/components/ui/VictoryOverlay');
    render(<VictoryOverlay />);
    expect(screen.getByTestId('victory-next-level')).toBeDefined();
    expect(screen.getByTestId('victory-retry')).toBeDefined();
    expect(screen.getByTestId('victory-back-to-menu')).toBeDefined();
  });

  it('Next Level calls loadLevel with next level and shows intro', async () => {
    const user = userEvent.setup();
    mockMachineState = 'LEVEL_CLEARED';
    mockActiveLevelIndex = 0;

    const { VictoryOverlay } = await import('@/components/ui/VictoryOverlay');
    render(<VictoryOverlay />);
    await user.click(screen.getByTestId('victory-next-level'));

    expect(mockLoadLevel).toHaveBeenCalledTimes(1);
    expect(mockSetActiveLevelIndex).toHaveBeenCalledWith(1);
    expect(mockSetShowLevelIntro).toHaveBeenCalledWith(true);
  });

  it('Next Level is disabled on last level', async () => {
    mockMachineState = 'LEVEL_CLEARED';
    mockActiveLevelIndex = 4;

    const { VictoryOverlay } = await import('@/components/ui/VictoryOverlay');
    render(<VictoryOverlay />);
    const nextBtn = screen.getByTestId('victory-next-level');
    expect(nextBtn).toBeDisabled();
  });

  it('Next Level button is not disabled on early levels', async () => {
    mockMachineState = 'LEVEL_CLEARED';
    mockActiveLevelIndex = 1;

    const { VictoryOverlay } = await import('@/components/ui/VictoryOverlay');
    render(<VictoryOverlay />);
    const nextBtn = screen.getByTestId('victory-next-level');
    expect(nextBtn).not.toBeDisabled();
  });

  it('Retry calls resetLevel', async () => {
    const user = userEvent.setup();
    mockMachineState = 'LEVEL_CLEARED';

    const { VictoryOverlay } = await import('@/components/ui/VictoryOverlay');
    render(<VictoryOverlay />);
    await user.click(screen.getByTestId('victory-retry'));

    expect(mockResetLevel).toHaveBeenCalledTimes(1);
  });

  it('Back to Menu navigates to menu', async () => {
    const user = userEvent.setup();
    mockMachineState = 'LEVEL_CLEARED';

    const { VictoryOverlay } = await import('@/components/ui/VictoryOverlay');
    render(<VictoryOverlay />);
    await user.click(screen.getByTestId('victory-back-to-menu'));

    expect(mockSetCurrentScreen).toHaveBeenCalledWith('menu');
  });
});
