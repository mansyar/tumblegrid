import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, type Mock } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────

const mockTransitionState = vi.fn();

vi.mock('@/store/useGameStore', () => ({
  useGameStore: vi.fn(),
}));

import { useGameStore } from '@/store/useGameStore';

type MachineState =
  | 'BUILDING'
  | 'PLAYING'
  | 'LEVEL_CLEARED'
  | 'SANDBOX_BUILDING'
  | 'SANDBOX_PLAYING';

function createMockStore(machineState: MachineState) {
  return (selector: (state: unknown) => unknown) => {
    const state = {
      machineState,
      transitionState: mockTransitionState,
    };
    return selector(state);
  };
}

// ─── Tests ────────────────────────────────────────────────────────────

describe('ModeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Play button by default', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('BUILDING'),
    );

    const { ModeToggle } = await import(
      '@/components/ui/ModeToggle'
    );

    render(<ModeToggle />);

    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).toBeDefined();
  });

  it('Play button dispatches PLAYING when state is BUILDING', async () => {
    const user = userEvent.setup();

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('BUILDING'),
    );

    const { ModeToggle } = await import(
      '@/components/ui/ModeToggle'
    );

    render(<ModeToggle />);

    const playButton = screen.getByRole('button', { name: /play/i });
    await user.click(playButton);

    expect(mockTransitionState).toHaveBeenCalledWith('PLAYING');
  });

  it('Play button dispatches SANDBOX_PLAYING when state is SANDBOX_BUILDING', async () => {
    const user = userEvent.setup();

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('SANDBOX_BUILDING'),
    );

    const { ModeToggle } = await import(
      '@/components/ui/ModeToggle'
    );

    render(<ModeToggle />);

    const playButton = screen.getByRole('button', { name: /play/i });
    await user.click(playButton);

    expect(mockTransitionState).toHaveBeenCalledWith(
      'SANDBOX_PLAYING',
    );
  });

  it('Stop button is not rendered during BUILDING state', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('BUILDING'),
    );

    const { ModeToggle } = await import(
      '@/components/ui/ModeToggle'
    );

    render(<ModeToggle />);

    expect(
      screen.queryByRole('button', { name: /stop/i }),
    ).toBeNull();
  });

  it('Stop button is visible during PLAYING state', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('PLAYING'),
    );

    const { ModeToggle } = await import(
      '@/components/ui/ModeToggle'
    );

    render(<ModeToggle />);

    const stopButton = screen.getByRole('button', { name: /stop/i });
    expect(stopButton).toBeDefined();
  });

  it('Stop button dispatches BUILDING when state is PLAYING', async () => {
    const user = userEvent.setup();

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('PLAYING'),
    );

    const { ModeToggle } = await import(
      '@/components/ui/ModeToggle'
    );

    render(<ModeToggle />);

    const stopButton = screen.getByRole('button', { name: /stop/i });
    await user.click(stopButton);

    expect(mockTransitionState).toHaveBeenCalledWith('BUILDING');
  });

  it('Stop button dispatches SANDBOX_BUILDING when state is SANDBOX_PLAYING', async () => {
    const user = userEvent.setup();

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('SANDBOX_PLAYING'),
    );

    const { ModeToggle } = await import(
      '@/components/ui/ModeToggle'
    );

    render(<ModeToggle />);

    const stopButton = screen.getByRole('button', { name: /stop/i });
    await user.click(stopButton);

    expect(mockTransitionState).toHaveBeenCalledWith(
      'SANDBOX_BUILDING',
    );
  });
});
