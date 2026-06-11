import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, type Mock } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────

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
    const state = { machineState };
    return selector(state);
  };
}

// ─── Tests ────────────────────────────────────────────────────────────

describe('ModeIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays Build Mode during BUILDING state', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('BUILDING'),
    );

    const { ModeIndicator } = await import(
      '@/components/ui/ModeIndicator'
    );

    render(<ModeIndicator />);

    expect(screen.getByText('Build Mode')).toBeDefined();
  });

  it('displays Build Mode during SANDBOX_BUILDING state', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('SANDBOX_BUILDING'),
    );

    const { ModeIndicator } = await import(
      '@/components/ui/ModeIndicator'
    );

    render(<ModeIndicator />);

    expect(screen.getByText('Build Mode')).toBeDefined();
  });

  it('displays Play Mode during PLAYING state', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('PLAYING'),
    );

    const { ModeIndicator } = await import(
      '@/components/ui/ModeIndicator'
    );

    render(<ModeIndicator />);

    expect(screen.getByText('Play Mode')).toBeDefined();
  });

  it('displays Play Mode during SANDBOX_PLAYING state', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore('SANDBOX_PLAYING'),
    );

    const { ModeIndicator } = await import(
      '@/components/ui/ModeIndicator'
    );

    render(<ModeIndicator />);

    expect(screen.getByText('Play Mode')).toBeDefined();
  });
});
