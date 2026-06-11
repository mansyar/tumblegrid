import { beforeEach, describe, expect, it } from 'vitest';

import { useGameStore } from '@/store/useGameStore';
import type { LevelDefinition } from '@/store/types';

const testLevel: LevelDefinition = {
  id: 'test-level',
  title: 'Test Level',
  description: 'A test level',
  gridBounds: { width: 10, depth: 10, height: 5 },
  staticTerrain: [
    {
      type: 'straight_ramp',
      position: [2, 0, 2],
      rotationIndex: 0,
    },
  ],
  inventory: {
    straight_ramp: 5,
    speed_booster: 2,
    bumper_pad: 3,
    half_pipe: 1,
    goal_bucket: 1,
  },
  launchpadPosition: [0, 1, 0],
  goalPosition: [9, 1, 5],
};

describe('Zustand Store Integration', () => {
  beforeEach(() => {
    useGameStore.setState({
      machineState: 'BUILDING',
      activeMode: 'CAMPAIGN',
      activeLevelIndex: undefined,
      grid: [10, 10, 5],
      inventory: {
        straight_ramp: 0,
        speed_booster: 0,
        bumper_pad: 0,
        half_pipe: 0,
        goal_bucket: 0,
      },
      placedPieces: [],
      activeBlueprintNode: undefined,
      selectedPieceId: undefined,
      trajectoryPreviewCache: new Map(),
    });
  });

  it('should initialize with default state', () => {
    const state = useGameStore.getState();
    expect(state.machineState).toBe('BUILDING');
    expect(state.activeMode).toBe('CAMPAIGN');
    expect(state.activeLevelIndex).toBeUndefined();
    expect(state.placedPieces).toHaveLength(0);
  });

  it('should handle full workflow: loadLevel → placePiece → transitionState → PLAYING', () => {
    // Load level
    useGameStore.getState().loadLevel(testLevel);
    let state = useGameStore.getState();
    expect(state.machineState).toBe('BUILDING');
    expect(state.inventory.straight_ramp).toBe(5);
    expect(state.placedPieces).toHaveLength(1);

    // Place a piece
    useGameStore.getState().placePiece('speed_booster', [4, 0, 4], 0);
    state = useGameStore.getState();
    expect(state.placedPieces).toHaveLength(2);
    expect(state.inventory.speed_booster).toBe(1);

    // Transition to PLAYING
    useGameStore.getState().transitionState('PLAYING');
    state = useGameStore.getState();
    expect(state.machineState).toBe('PLAYING');
  });

  it('should handle sandbox workflow', () => {
    // Set to sandbox mode
    useGameStore.getState().setMode('SANDBOX');
    let state = useGameStore.getState();
    expect(state.activeMode).toBe('SANDBOX');

    // Load level
    useGameStore.getState().loadLevel(testLevel);
    state = useGameStore.getState();
    expect(state.machineState).toBe('SANDBOX_BUILDING');

    // Transition to playing
    useGameStore.getState().transitionState('SANDBOX_PLAYING');
    state = useGameStore.getState();
    expect(state.machineState).toBe('SANDBOX_PLAYING');
  });

  it('should persist state across multiple actions', () => {
    // Load level
    useGameStore.getState().loadLevel(testLevel);

    // Place multiple pieces
    useGameStore.getState().placePiece('speed_booster', [4, 0, 4], 0);
    useGameStore.getState().placePiece('bumper_pad', [6, 0, 4], 1);

    const state = useGameStore.getState();
    expect(state.placedPieces).toHaveLength(3);
    expect(state.inventory.speed_booster).toBe(1);
    expect(state.inventory.bumper_pad).toBe(2);
  });

  it('should return piece to inventory on removal', () => {
    // Load level
    useGameStore.getState().loadLevel(testLevel);

    // Place a piece
    useGameStore.getState().placePiece('speed_booster', [4, 0, 4], 0);
    expect(useGameStore.getState().inventory.speed_booster).toBe(1);

    // Remove it
    const placedId = useGameStore.getState().placedPieces[1].id;
    useGameStore.getState().removePiece(placedId);
    expect(useGameStore.getState().inventory.speed_booster).toBe(2);
    expect(useGameStore.getState().placedPieces).toHaveLength(1);
  });

  it('should not place piece when inventory is zero', () => {
    // Load level
    useGameStore.getState().loadLevel(testLevel);

    // Exhaust half_pipe inventory (starts at 1)
    useGameStore.getState().placePiece('half_pipe', [4, 0, 4], 0);
    expect(useGameStore.getState().inventory.half_pipe).toBe(0);

    // Try to place again — should be rejected
    useGameStore.getState().placePiece('half_pipe', [6, 0, 4], 0);
    expect(useGameStore.getState().placedPieces).toHaveLength(2); // Only 1 new piece placed
    expect(useGameStore.getState().inventory.half_pipe).toBe(0); // Still 0
  });

  it('should handle piece selection and rotation', () => {
    // Load level
    useGameStore.getState().loadLevel(testLevel);

    // Select a piece
    const pieceId = useGameStore.getState().placedPieces[0].id;
    useGameStore.getState().selectPiece(pieceId);
    expect(useGameStore.getState().selectedPieceId).toBe(pieceId);

    // Rotate the piece
    useGameStore.getState().rotatePiece(pieceId);
    expect(useGameStore.getState().placedPieces[0].rotationIndex).toBe(1);

    // Clear selection
    useGameStore.getState().clearSelection();
    expect(useGameStore.getState().selectedPieceId).toBeUndefined();
  });
});
