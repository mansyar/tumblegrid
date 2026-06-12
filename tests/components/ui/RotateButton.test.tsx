import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, type Mock } from 'vitest';

// ─── Mocks ────────────────────────────────────────────────────────────

const mockRotatePiece = vi.fn();
const mockUpdateActiveBlueprint = vi.fn();
const mockPlayUIClick = vi.fn();

vi.mock('@/store/useGameStore', () => ({
  useGameStore: vi.fn(),
}));

vi.mock('@/hooks/useAudio', () => ({
  useAudio: () => ({
    playUIClick: mockPlayUIClick,
  }),
}));

import { useGameStore } from '@/store/useGameStore';

type MachineState =
  | 'BUILDING'
  | 'PLAYING'
  | 'LEVEL_CLEARED'
  | 'SANDBOX_BUILDING'
  | 'SANDBOX_PLAYING';

function createMockStore(options: {
  machineState: MachineState;
  selectedPieceId?: string | null;
  activeBlueprintNode?: {
    pieceType: string;
    position: [number, number, number];
    rotationIndex: number;
    valid: boolean;
  } | null;
}) {
  return (selector: (state: unknown) => unknown) => {
    const state = {
      machineState: options.machineState,
      selectedPieceId: options.selectedPieceId ?? null,
      activeBlueprintNode: options.activeBlueprintNode ?? null,
      rotatePiece: mockRotatePiece,
      updateActiveBlueprint: mockUpdateActiveBlueprint,
    };
    return selector(state);
  };
}

// ─── Tests ────────────────────────────────────────────────────────────

describe('RotateButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when state is PLAYING', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'PLAYING',
        selectedPieceId: 'piece-1',
      }),
    );

    const { RotateButton } = await import(
      '@/components/ui/RotateButton'
    );

    render(<RotateButton />);

    expect(
      screen.queryByRole('button', { name: /rotate/i }),
    ).toBeNull();
  });

  it('renders nothing when no target (no selected piece or blueprint)', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'BUILDING',
        selectedPieceId: null,
        activeBlueprintNode: null,
      }),
    );

    const { RotateButton } = await import(
      '@/components/ui/RotateButton'
    );

    render(<RotateButton />);

    expect(
      screen.queryByRole('button', { name: /rotate/i }),
    ).toBeNull();
  });

  it('renders button when selected piece exists in BUILDING state', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'BUILDING',
        selectedPieceId: 'piece-1',
      }),
    );

    const { RotateButton } = await import(
      '@/components/ui/RotateButton'
    );

    render(<RotateButton />);

    const button = screen.getByRole('button', { name: /rotate/i });
    expect(button).toBeDefined();
  });

  it('renders button when active blueprint exists in BUILDING state', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'BUILDING',
        activeBlueprintNode: {
          pieceType: 'straight_ramp',
          position: [0, 0, 0],
          rotationIndex: 0,
          valid: true,
        },
      }),
    );

    const { RotateButton } = await import(
      '@/components/ui/RotateButton'
    );

    render(<RotateButton />);

    const button = screen.getByRole('button', { name: /rotate/i });
    expect(button).toBeDefined();
  });

  it('calls rotatePiece when clicked with selected piece', async () => {
    const user = userEvent.setup();

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'BUILDING',
        selectedPieceId: 'piece-1',
      }),
    );

    const { RotateButton } = await import(
      '@/components/ui/RotateButton'
    );

    render(<RotateButton />);

    const button = screen.getByRole('button', { name: /rotate/i });
    await user.click(button);

    expect(mockRotatePiece).toHaveBeenCalledWith('piece-1');
    expect(mockPlayUIClick).toHaveBeenCalledWith('rotate');
  });

  it('calls updateActiveBlueprint when clicked with active blueprint', async () => {
    const user = userEvent.setup();

    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'BUILDING',
        activeBlueprintNode: {
          pieceType: 'straight_ramp',
          position: [0, 0, 0],
          rotationIndex: 1,
          valid: true,
        },
      }),
    );

    const { RotateButton } = await import(
      '@/components/ui/RotateButton'
    );

    render(<RotateButton />);

    const button = screen.getByRole('button', { name: /rotate/i });
    await user.click(button);

    expect(mockUpdateActiveBlueprint).toHaveBeenCalledWith({
      pieceType: 'straight_ramp',
      position: [0, 0, 0],
      rotationIndex: 2,
      valid: true,
    });
    expect(mockPlayUIClick).toHaveBeenCalledWith('rotate');
  });

  it('renders in SANDBOX_BUILDING state', async () => {
    (useGameStore as unknown as Mock).mockImplementation(
      createMockStore({
        machineState: 'SANDBOX_BUILDING',
        selectedPieceId: 'piece-1',
      }),
    );

    const { RotateButton } = await import(
      '@/components/ui/RotateButton'
    );

    render(<RotateButton />);

    const button = screen.getByRole('button', { name: /rotate/i });
    expect(button).toBeDefined();
  });
});
