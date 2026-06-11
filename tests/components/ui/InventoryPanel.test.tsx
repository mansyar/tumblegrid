import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, type Mock } from 'vitest';

import type { PieceType } from '@/store/types';

// ─── Mocks ────────────────────────────────────────────────────────────

const mockSetSelectedBlueprintType = vi.fn();

vi.mock('@/store/useGameStore', () => ({
  useGameStore: vi.fn(),
}));

import { useGameStore } from '@/store/useGameStore';

function createMockStore(overrides?: {
  inventory?: Partial<Record<PieceType, number>>;
  selectedBlueprintType?: PieceType | null;
}) {
  const fullInventory: Record<PieceType, number> = {
    straight_ramp: 3,
    speed_booster: 2,
    bumper_pad: 1,
    half_pipe: 0,
    goal_bucket: 0,
    ...overrides?.inventory,
  };

  return (selector: (state: unknown) => unknown) => {
    const state = {
      inventory: fullInventory,
      selectedBlueprintType:
        overrides?.selectedBlueprintType ?? null,
      setSelectedBlueprintType: mockSetSelectedBlueprintType,
    };
    return selector(state);
  };
}

// ─── Tests ────────────────────────────────────────────────────────────

describe('InventoryPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all five piece types from store inventory', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore(),
    );

    const { InventoryPanel } = await import(
      '@/components/ui/InventoryPanel'
    );

    render(<InventoryPanel />);

    expect(screen.getByText('Straight Ramp')).toBeDefined();
    expect(screen.getByText('Speed Booster')).toBeDefined();
    expect(screen.getByText('Bumper Pad')).toBeDefined();
    expect(screen.getByText('Half Pipe')).toBeDefined();
    expect(screen.getByText('Goal Bucket')).toBeDefined();
  });

  it('displays correct remaining count for each piece type', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        inventory: {
          straight_ramp: 5,
          speed_booster: 0,
          bumper_pad: 2,
          half_pipe: 1,
          goal_bucket: 0,
        },
      }),
    );

    const { InventoryPanel } = await import(
      '@/components/ui/InventoryPanel'
    );

    render(<InventoryPanel />);

    expect(screen.getByText('x5')).toBeDefined();
    expect(screen.getByText('x2')).toBeDefined();
    expect(screen.getByText('x1')).toBeDefined();
    // speed_booster and goal_bucket are both x0
    expect(screen.getAllByText('x0')).toHaveLength(2);
  });

  it('highlights the active blueprint type', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        selectedBlueprintType: 'speed_booster',
      }),
    );

    const { InventoryPanel } = await import(
      '@/components/ui/InventoryPanel'
    );

    const { container } = render(<InventoryPanel />);

    // The active item should have a data attribute indicating it's active
    const activeItem = container.querySelector(
      '[data-active="true"]',
    );
    expect(activeItem).not.toBeNull();
    expect(activeItem?.textContent).toContain('Speed Booster');
  });

  it('greys out and disables piece types with 0 count', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        inventory: {
          straight_ramp: 0,
          speed_booster: 2,
          bumper_pad: 0,
          half_pipe: 0,
          goal_bucket: 0,
        },
      }),
    );

    const { InventoryPanel } = await import(
      '@/components/ui/InventoryPanel'
    );

    const { container } = render(<InventoryPanel />);

    // Items with 0 count should have data-disabled="true"
    const disabledItems = container.querySelectorAll(
      '[data-disabled="true"]',
    );

    // straight_ramp, bumper_pad, half_pipe, goal_bucket are 0
    expect(disabledItems).toHaveLength(4);

    // The speed_booster (count 2) should NOT be disabled
    const enabledItems = container.querySelectorAll(
      '[data-disabled="false"]',
    );
    expect(enabledItems).toHaveLength(1);
    expect(enabledItems[0]?.textContent).toContain('Speed Booster');
  });

  it('clicking a piece type updates store selectedBlueprintType', async () => {
    const user = userEvent.setup();

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore(),
    );

    const { InventoryPanel } = await import(
      '@/components/ui/InventoryPanel'
    );

    render(<InventoryPanel />);

    const straightRampItem = screen.getByText('Straight Ramp');
    await user.click(straightRampItem);

    expect(mockSetSelectedBlueprintType).toHaveBeenCalledWith(
      'straight_ramp',
    );
  });

  it('does not call setSelectedBlueprintType when clicking disabled item', async () => {
    const user = userEvent.setup();

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore(),
    );

    const { InventoryPanel } = await import(
      '@/components/ui/InventoryPanel'
    );

    render(<InventoryPanel />);

    const halfPipeItem = screen.getByText('Half Pipe');
    await user.click(halfPipeItem);

    expect(mockSetSelectedBlueprintType).not.toHaveBeenCalled();
  });
});
