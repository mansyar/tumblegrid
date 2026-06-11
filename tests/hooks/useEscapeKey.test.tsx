import { render } from '@testing-library/react';
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

describe('useEscapeKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Escape key dispatches BUILDING when state is PLAYING', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('PLAYING'),
    );

    const { useEscapeKey } = await import(
      '@/hooks/useEscapeKey'
    );

    function TestComponent() {
      useEscapeKey();
      return null;
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    await user.keyboard('{Escape}');

    expect(mockTransitionState).toHaveBeenCalledWith('BUILDING');
  });

  it('Escape key dispatches SANDBOX_BUILDING when state is SANDBOX_PLAYING', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('SANDBOX_PLAYING'),
    );

    const { useEscapeKey } = await import(
      '@/hooks/useEscapeKey'
    );

    function TestComponent() {
      useEscapeKey();
      return null;
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    await user.keyboard('{Escape}');

    expect(mockTransitionState).toHaveBeenCalledWith(
      'SANDBOX_BUILDING',
    );
  });

  it('Escape key does nothing during BUILDING state', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('BUILDING'),
    );

    const { useEscapeKey } = await import(
      '@/hooks/useEscapeKey'
    );

    function TestComponent() {
      useEscapeKey();
      return null;
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    await user.keyboard('{Escape}');

    expect(mockTransitionState).not.toHaveBeenCalled();
  });

  it('Escape key does nothing during SANDBOX_BUILDING state', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('SANDBOX_BUILDING'),
    );

    const { useEscapeKey } = await import(
      '@/hooks/useEscapeKey'
    );

    function TestComponent() {
      useEscapeKey();
      return null;
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    await user.keyboard('{Escape}');

    expect(mockTransitionState).not.toHaveBeenCalled();
  });
});
