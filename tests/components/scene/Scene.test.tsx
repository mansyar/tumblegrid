import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Scene } from '@/components/scene/Scene';
import type { PlacedPiece } from '@/store/types';

// ─── Mocks ────────────────────────────────────────────────────────────

vi.mock('@react-three/fiber', () => ({
  useThree: () => ({
    camera: { position: { lerp: vi.fn(), set: vi.fn() } },
    gl: { domElement: document.createElement('canvas') },
    pointer: { x: 0, y: 0 },
    raycaster: { setFromCamera: vi.fn() },
  }),
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: vi.fn().mockImplementation(() => null),
  Grid: vi.fn().mockImplementation(() => null),
}));

vi.mock('@/components/pieces/PieceFactory', () => ({
  PieceFactory: vi.fn((props: Record<string, unknown>) => (
    <div data-testid="piece-factory" data-props={JSON.stringify(props)} />
  )),
}));

vi.mock('@/components/scene/GridGhost', () => ({
  GridGhost: vi.fn(() => (
    <div data-testid="grid-ghost" />
  )),
}));

vi.mock('@/hooks/useGridInteraction', () => ({
  useGridInteraction: vi.fn(() => ({
    hoveredCell: null,
    isValid: false,
  })),
}));

vi.mock('@/levels', () => ({
  getLevelByIndex: vi.fn(() => undefined),
}));

const mockStore = vi.fn();

vi.mock('@/store/useGameStore', () => ({
  useGameStore: (selector: (state: unknown) => unknown) => mockStore(selector),
}));

// ─── Tests ────────────────────────────────────────────────────────────

describe('Scene', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default store state: no placed pieces, some inventory
    mockStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          placedPieces: [] as PlacedPiece[],
          inventory: {
            straight_ramp: 3,
            speed_booster: 2,
            bumper_pad: 1,
            half_pipe: 0,
            goal_bucket: 0,
          },
          activeBlueprintNode: undefined,
          machineState: 'BUILDING',
          selectedPieceId: undefined,
          loadLevel: vi.fn(),
        };
        return selector(state);
      },
    );
  });

  it('should be a function component', () => {
    expect(typeof Scene).toBe('function');
  });

  it('should have a name', () => {
    expect(Scene.name).toBe('Scene');
  });

  it('should render without errors', () => {
    expect(() => render(<Scene />)).not.toThrow();
  });

  it('should render GridGhost component', () => {
    const { container } = render(<Scene />);
    expect(container.querySelector('[data-testid="grid-ghost"]')).toBeInTheDocument();
  });

  it('should render PieceFactory for each placed piece', () => {
    const placedPieces: PlacedPiece[] = [
      { id: 'a', type: 'straight_ramp', position: [0, 0, 0], rotationIndex: 0 },
      { id: 'b', type: 'speed_booster', position: [3, 0, 4], rotationIndex: 1 },
    ];

    mockStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          placedPieces,
          inventory: { straight_ramp: 3, speed_booster: 2, bumper_pad: 1, half_pipe: 0, goal_bucket: 0 },
          activeBlueprintNode: undefined,
          machineState: 'BUILDING',
          selectedPieceId: undefined,
          loadLevel: vi.fn(),
        };
        return selector(state);
      },
    );

    const { container } = render(<Scene />);
    const factories = container.querySelectorAll('[data-testid="piece-factory"]');
    expect(factories.length).toBe(2);
  });

  it('should pass correct position and rotation to PieceFactory', () => {
    const placedPieces: PlacedPiece[] = [
      { id: 'a', type: 'straight_ramp', position: [2, 0, 3], rotationIndex: 2 },
    ];

    mockStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          placedPieces,
          inventory: { straight_ramp: 3, speed_booster: 2, bumper_pad: 1, half_pipe: 0, goal_bucket: 0 },
          activeBlueprintNode: undefined,
          machineState: 'BUILDING',
          selectedPieceId: undefined,
          loadLevel: vi.fn(),
        };
        return selector(state);
      },
    );

    const { container } = render(<Scene />);
    const factory = container.querySelector('[data-testid="piece-factory"]');
    expect(factory).toBeInTheDocument();

    const props = JSON.parse(factory?.getAttribute('data-props') ?? '{}');
    expect(props.pieceType).toBe('straight_ramp');
    expect(props.position).toEqual([2, 0, 3]);
    expect(props.rotationIndex).toBe(2);
    expect(props.ghost).toBeUndefined();
  });

  it('should render correct number of pieces with multiple types', () => {
    const placedPieces: PlacedPiece[] = [
      { id: 'a', type: 'straight_ramp', position: [0, 0, 0], rotationIndex: 0 },
      { id: 'b', type: 'bumper_pad', position: [4, 0, 2], rotationIndex: 1 },
      { id: 'c', type: 'half_pipe', position: [6, 0, 6], rotationIndex: 0 },
      { id: 'd', type: 'goal_bucket', position: [8, 0, 8], rotationIndex: 3 },
    ];

    mockStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          placedPieces,
          inventory: { straight_ramp: 3, speed_booster: 2, bumper_pad: 0, half_pipe: 0, goal_bucket: 0 },
          activeBlueprintNode: undefined,
          machineState: 'BUILDING',
          selectedPieceId: undefined,
          loadLevel: vi.fn(),
        };
        return selector(state);
      },
    );

    const { container } = render(<Scene />);
    const factories = container.querySelectorAll('[data-testid="piece-factory"]');
    expect(factories.length).toBe(4);
  });

  it('should render nothing when placedPieces is empty', () => {
    const { container } = render(<Scene />);
    const factories = container.querySelectorAll('[data-testid="piece-factory"]');
    expect(factories.length).toBe(0);
  });

  it('should still render GridGhost when placedPieces is empty', () => {
    const { container } = render(<Scene />);
    expect(container.querySelector('[data-testid="grid-ghost"]')).toBeInTheDocument();
  });

  it('should pass selected=true for the selected piece', () => {
    const placedPieces: PlacedPiece[] = [
      { id: 'selected-piece', type: 'straight_ramp', position: [2, 0, 3], rotationIndex: 0 },
      { id: 'other-piece', type: 'bumper_pad', position: [5, 0, 5], rotationIndex: 1 },
    ];

    mockStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          placedPieces,
          inventory: { straight_ramp: 3, speed_booster: 2, bumper_pad: 1, half_pipe: 0, goal_bucket: 0 },
          activeBlueprintNode: undefined,
          machineState: 'BUILDING',
          selectedPieceId: 'selected-piece',
          loadLevel: vi.fn(),
        };
        return selector(state);
      },
    );

    const { container } = render(<Scene />);
    const factories = container.querySelectorAll('[data-testid="piece-factory"]');
    expect(factories.length).toBe(2);

    const firstProps = JSON.parse(factories[0]?.getAttribute('data-props') ?? '{}');
    const secondProps = JSON.parse(factories[1]?.getAttribute('data-props') ?? '{}');

    // The piece with id 'selected-piece' should have selected=true
    // The other piece should have selected=false (explicitly)
    const posStr = JSON.stringify(firstProps.position);
    if (posStr === '[2,0,3]') {
      expect(firstProps.selected).toBe(true);
      expect(secondProps.selected).toBe(false);
    } else {
      expect(secondProps.selected).toBe(true);
      expect(firstProps.selected).toBe(false);
    }
  });

  it('should pass selected=false or undefined when no piece is selected', () => {
    const placedPieces: PlacedPiece[] = [
      { id: 'piece-a', type: 'straight_ramp', position: [0, 0, 0], rotationIndex: 0 },
    ];

    mockStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          placedPieces,
          inventory: { straight_ramp: 3, speed_booster: 2, bumper_pad: 1, half_pipe: 0, goal_bucket: 0 },
          activeBlueprintNode: undefined,
          machineState: 'BUILDING',
          selectedPieceId: undefined,
          loadLevel: vi.fn(),
        };
        return selector(state);
      },
    );

    const { container } = render(<Scene />);
    const factory = container.querySelector('[data-testid="piece-factory"]');
    const props = JSON.parse(factory?.getAttribute('data-props') ?? '{}');
    expect(props.selected).toBe(false);
  });

  it('should hide ghost when a piece is selected', () => {
    const placedPieces: PlacedPiece[] = [
      { id: 'piece-a', type: 'straight_ramp', position: [0, 0, 0], rotationIndex: 0 },
    ];

    mockStore.mockImplementation(
      (selector: (state: unknown) => unknown) => {
        const state = {
          placedPieces,
          inventory: { straight_ramp: 3, speed_booster: 2, bumper_pad: 1, half_pipe: 0, goal_bucket: 0 },
          activeBlueprintNode: undefined,
          machineState: 'BUILDING',
          selectedPieceId: 'piece-a',
          loadLevel: vi.fn(),
        };
        return selector(state);
      },
    );

    const { container } = render(<Scene />);
    // Ghost should not be present when a piece is selected
    expect(container.querySelector('[data-testid="grid-ghost"]')).not.toBeInTheDocument();
  });
});
