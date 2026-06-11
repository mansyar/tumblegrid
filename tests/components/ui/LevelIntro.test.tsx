import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockSetShowLevelIntro = vi.fn();

let mockShowLevelIntro = false;
let mockStashedLevelDefinition: unknown = null;

vi.mock('@/store/useGameStore', () => ({
  useGameStore: (selector: (state: unknown) => unknown) => {
    const state = {
      showLevelIntro: mockShowLevelIntro,
      setShowLevelIntro: mockSetShowLevelIntro,
      stashedLevelDefinition: mockStashedLevelDefinition,
    };
    return selector(state);
  },
}));

const testLevel = {
  id: 'campaign_01',
  title: 'Test Title',
  description: 'Test description text.',
  gridBounds: { width: 6, depth: 4, height: 3 },
  staticTerrain: [],
  inventory: { straight_ramp: 2 },
  launchpadPosition: [1, 2, 1],
  goalPosition: [4, 0, 1],
};

describe('LevelIntro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockShowLevelIntro = false;
    mockStashedLevelDefinition = null;
  });

  it('renders nothing when showLevelIntro is false', async () => {
    const { LevelIntro } = await import('@/components/ui/LevelIntro');
    const { container } = render(<LevelIntro />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when no level definition exists', async () => {
    mockShowLevelIntro = true;
    mockStashedLevelDefinition = null;
    const { LevelIntro } = await import('@/components/ui/LevelIntro');
    const { container } = render(<LevelIntro />);
    expect(container.innerHTML).toBe('');
  });

  it('renders title and description when visible', async () => {
    mockShowLevelIntro = true;
    mockStashedLevelDefinition = testLevel;

    const { LevelIntro } = await import('@/components/ui/LevelIntro');
    render(<LevelIntro />);

    expect(screen.getByText('Test Title')).toBeDefined();
    expect(screen.getByText('Test description text.')).toBeDefined();
    expect(screen.getByTestId('level-intro')).toBeDefined();
  });

  it('dismisses on click', async () => {
    const user = userEvent.setup();
    mockShowLevelIntro = true;
    mockStashedLevelDefinition = testLevel;

    const { LevelIntro } = await import('@/components/ui/LevelIntro');
    render(<LevelIntro />);

    await user.click(screen.getByTestId('level-intro'));
    expect(mockSetShowLevelIntro).toHaveBeenCalledWith(false);
  });
});
