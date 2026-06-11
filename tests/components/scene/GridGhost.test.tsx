import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GridGhost } from '@/components/scene/GridGhost';
import type { ActiveBlueprintNode } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';

// ─── Mocks ────────────────────────────────────────────────────────────

vi.mock('@/components/pieces/PieceFactory', () => ({
  PieceFactory: vi.fn((props: Record<string, unknown>) => (
    <div data-testid="piece-factory" data-props={JSON.stringify(props)} />
  )),
}));

vi.mock('@/store/useGameStore', () => ({
  useGameStore: vi.fn(),
}));

// ─── Tests ────────────────────────────────────────────────────────────

describe('GridGhost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when activeBlueprintNode is undefined', () => {
    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = { activeBlueprintNode: undefined };
        return selector(state);
      },
    );

    const { container } = render(<GridGhost />);
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when activeBlueprintNode is invalid', () => {
    const invalidNode: ActiveBlueprintNode = {
      pieceType: 'straight_ramp',
      position: [5, 0, 5],
      rotationIndex: 0,
      valid: false,
    };

    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = { activeBlueprintNode: invalidNode };
        return selector(state);
      },
    );

    const { container } = render(<GridGhost />);
    expect(container.firstChild).toBeNull();
  });

  it('should render PieceFactory when activeBlueprintNode is valid', () => {
    const validNode: ActiveBlueprintNode = {
      pieceType: 'straight_ramp',
      position: [3, 0, 4],
      rotationIndex: 1,
      valid: true,
    };

    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = { activeBlueprintNode: validNode };
        return selector(state);
      },
    );

    render(<GridGhost />);

    const factory = screen.getByTestId('piece-factory');
    expect(factory).toBeInTheDocument();
  });

  it('should pass correct props to PieceFactory', () => {
    const validNode: ActiveBlueprintNode = {
      pieceType: 'speed_booster',
      position: [7, 0, 3],
      rotationIndex: 2,
      valid: true,
    };

    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = { activeBlueprintNode: validNode };
        return selector(state);
      },
    );

    render(<GridGhost />);

    const factory = screen.getByTestId('piece-factory');
    const props = JSON.parse(factory.getAttribute('data-props') ?? '{}');

    expect(props.pieceType).toBe('speed_booster');
    expect(props.position).toEqual([7, 0, 3]);
    expect(props.rotationIndex).toBe(2);
    expect(props.ghost).toBe(true);
  });

  it('should render correct piece type from blueprint', () => {
    const nodes: ActiveBlueprintNode[] = [
      { pieceType: 'bumper_pad', position: [0, 0, 0], rotationIndex: 0, valid: true },
      { pieceType: 'half_pipe', position: [1, 0, 0], rotationIndex: 0, valid: true },
      { pieceType: 'goal_bucket', position: [2, 0, 0], rotationIndex: 0, valid: true },
    ];

    for (const node of nodes) {
      (useGameStore as unknown as Mock).mockImplementation(
        (selector: (state: unknown) => unknown) => {
          const state = { activeBlueprintNode: node };
          return selector(state);
        },
      );

      const { unmount } = render(<GridGhost />);
      const factory = screen.getByTestId('piece-factory');
      const props = JSON.parse(factory.getAttribute('data-props') ?? '{}');
      expect(props.pieceType).toBe(node.pieceType);
      unmount();
    }
  });

  it('should render nothing when pieceType is missing from blueprint', () => {
    // Edge case: blueprint exists but has undefined state
    (useGameStore as unknown as Mock).mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = { activeBlueprintNode: undefined };
        return selector(state);
      },
    );

    const { container } = render(<GridGhost />);
    expect(container.firstChild).toBeNull();
  });
});
