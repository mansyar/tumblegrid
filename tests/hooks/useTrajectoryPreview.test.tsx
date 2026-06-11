import { render } from '@testing-library/react';
import { describe, expect, it, vi, type Mock } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────

const mockUpdateTrajectoryCache = vi.fn();
const mockComputeWaypoints = vi.fn();

vi.mock('@/store/useGameStore', () => ({
  useGameStore: vi.fn(),
}));

vi.mock('@/utils/trajectory', () => ({
  computeTrajectoryWaypoints: (...args: unknown[]) =>
    mockComputeWaypoints(...args),
}));

import { useGameStore } from '@/store/useGameStore';
import type { PieceType, ActiveBlueprintNode, PlacedPiece } from '@/store/types';

type MachineState =
  | 'BUILDING'
  | 'PLAYING'
  | 'LEVEL_CLEARED'
  | 'SANDBOX_BUILDING'
  | 'SANDBOX_PLAYING';

interface MockStore {
  machineState: MachineState;
  activeBlueprintNode: ActiveBlueprintNode | undefined;
  placedPieces: PlacedPiece[];
  selectedPieceId: string | undefined;
  selectedBlueprintType: PieceType | null;
  updateTrajectoryCache: typeof mockUpdateTrajectoryCache;
}

function createMockStore(overrides: Partial<MockStore> = {}) {
  const defaults: MockStore = {
    machineState: 'BUILDING',
    activeBlueprintNode: undefined,
    placedPieces: [],
    selectedPieceId: undefined,
    selectedBlueprintType: null,
    updateTrajectoryCache: mockUpdateTrajectoryCache,
  };
  const state = { ...defaults, ...overrides };
  return (selector: (state: unknown) => unknown) => selector(state);
}

// ─── Tests ────────────────────────────────────────────────────────────

describe('useTrajectoryPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('computes waypoints and updates cache when activeBlueprintNode is valid and in Build Mode', async () => {
    const node: ActiveBlueprintNode = {
      pieceType: 'straight_ramp',
      position: [4, 0, 2],
      rotationIndex: 0,
      valid: true,
    };

    const placed: PlacedPiece[] = [
      {
        id: 'piece-1',
        type: 'straight_ramp',
        position: [0, 0, 2],
        rotationIndex: 0,
      },
    ];

    const expectedWaypoints: [number, number, number][] = [
      [1, 0, 2],
      [3, 0, 2],
      [4, 1, 2],
      [5, 0, 2],
    ];
    mockComputeWaypoints.mockReturnValue(expectedWaypoints);

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'BUILDING',
        activeBlueprintNode: node,
        placedPieces: placed,
        selectedBlueprintType: 'straight_ramp',
      }),
    );

    const { useTrajectoryPreview } = await import(
      '@/hooks/useTrajectoryPreview'
    );

    function TestComponent() {
      useTrajectoryPreview();
      return null;
    }

    render(<TestComponent />);

    expect(mockComputeWaypoints).toHaveBeenCalledWith(
      placed,
      [4, 0, 2],
      'straight_ramp',
      undefined,
    );
    expect(mockUpdateTrajectoryCache).toHaveBeenCalledWith(
      'preview',
      expectedWaypoints,
    );
  });

  it('clears cache when activeBlueprintNode is undefined', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'BUILDING',
        activeBlueprintNode: undefined,
        selectedBlueprintType: 'straight_ramp',
      }),
    );

    const { useTrajectoryPreview } = await import(
      '@/hooks/useTrajectoryPreview'
    );

    function TestComponent() {
      useTrajectoryPreview();
      return null;
    }

    render(<TestComponent />);

    expect(mockUpdateTrajectoryCache).toHaveBeenCalledWith('preview', []);
    expect(mockComputeWaypoints).not.toHaveBeenCalled();
  });

  it('clears cache when in Play Mode', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'PLAYING',
        activeBlueprintNode: undefined,
        selectedBlueprintType: null,
      }),
    );

    const { useTrajectoryPreview } = await import(
      '@/hooks/useTrajectoryPreview'
    );

    function TestComponent() {
      useTrajectoryPreview();
      return null;
    }

    render(<TestComponent />);

    expect(mockUpdateTrajectoryCache).toHaveBeenCalledWith('preview', []);
  });

  it('clears cache when blueprint node is invalid', async () => {
    const node: ActiveBlueprintNode = {
      pieceType: 'straight_ramp',
      position: [99, 0, 99],
      rotationIndex: 0,
      valid: false,
    };

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'BUILDING',
        activeBlueprintNode: node,
        selectedBlueprintType: 'straight_ramp',
      }),
    );

    const { useTrajectoryPreview } = await import(
      '@/hooks/useTrajectoryPreview'
    );

    function TestComponent() {
      useTrajectoryPreview();
      return null;
    }

    render(<TestComponent />);

    expect(mockUpdateTrajectoryCache).toHaveBeenCalledWith('preview', []);
    expect(mockComputeWaypoints).not.toHaveBeenCalled();
  });

  it('clears cache when no piece type is selected', async () => {
    const node: ActiveBlueprintNode = {
      pieceType: 'straight_ramp',
      position: [4, 0, 2],
      rotationIndex: 0,
      valid: true,
    };

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'BUILDING',
        activeBlueprintNode: node,
        selectedBlueprintType: null,
      }),
    );

    const { useTrajectoryPreview } = await import(
      '@/hooks/useTrajectoryPreview'
    );

    function TestComponent() {
      useTrajectoryPreview();
      return null;
    }

    render(<TestComponent />);

    expect(mockUpdateTrajectoryCache).toHaveBeenCalledWith('preview', []);
    expect(mockComputeWaypoints).not.toHaveBeenCalled();
  });

  it('uses selectedPieceId when a piece is selected', async () => {
    const node: ActiveBlueprintNode = {
      pieceType: 'straight_ramp',
      position: [4, 0, 2],
      rotationIndex: 0,
      valid: true,
    };

    const placed: PlacedPiece[] = [
      {
        id: 'piece-1',
        type: 'straight_ramp',
        position: [0, 0, 2],
        rotationIndex: 0,
      },
    ];

    const expectedWaypoints: [number, number, number][] = [[1, 0, 2]];
    mockComputeWaypoints.mockReturnValue(expectedWaypoints);

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'BUILDING',
        activeBlueprintNode: node,
        placedPieces: placed,
        selectedPieceId: 'piece-1',
        selectedBlueprintType: 'speed_booster',
      }),
    );

    const { useTrajectoryPreview } = await import(
      '@/hooks/useTrajectoryPreview'
    );

    function TestComponent() {
      useTrajectoryPreview();
      return null;
    }

    render(<TestComponent />);

    expect(mockComputeWaypoints).toHaveBeenCalledWith(
      placed,
      [4, 0, 2],
      'speed_booster',
      'piece-1',
    );
  });
});
