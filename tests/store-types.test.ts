import { describe, expect, it } from 'vitest';

import type {
  ActiveBlueprintNode,
  ActiveMode,
  GameState,
  LevelDefinition,
  MachineState,
  PiecePlacement,
  PieceType,
  PlacedPiece,
} from '@/store/types';

describe('Store Type Exports', () => {
  it('should export PieceType union type', () => {
    const validTypes: PieceType[] = [
      'straight_ramp',
      'speed_booster',
      'bumper_pad',
      'half_pipe',
      'goal_bucket',
    ];
    expect(validTypes).toHaveLength(5);
  });

  it('should export MachineState union type', () => {
    const validStates: MachineState[] = [
      'BUILDING',
      'PLAYING',
      'LEVEL_CLEARED',
      'SANDBOX_BUILDING',
      'SANDBOX_PLAYING',
    ];
    expect(validStates).toHaveLength(5);
  });

  it('should export ActiveMode union type', () => {
    const validModes: ActiveMode[] = ['CAMPAIGN', 'SANDBOX'];
    expect(validModes).toHaveLength(2);
  });

  it('should export PiecePlacement interface', () => {
    const placement: PiecePlacement = {
      pieceType: 'straight_ramp',
      position: [0, 0, 0],
      rotationIndex: 0,
    };
    expect(placement.pieceType).toBe('straight_ramp');
    expect(placement.position).toEqual([0, 0, 0]);
    expect(placement.rotationIndex).toBe(0);
  });

  it('should export PlacedPiece interface extending PiecePlacement', () => {
    const piece: PlacedPiece = {
      id: 'test-id',
      pieceType: 'bumper_pad',
      position: [2, 0, 4],
      rotationIndex: 2,
    };
    expect(piece.id).toBe('test-id');
    expect(piece.pieceType).toBe('bumper_pad');
    expect(piece.position).toEqual([2, 0, 4]);
    expect(piece.rotationIndex).toBe(2);
  });

  it('should export ActiveBlueprintNode interface', () => {
    const node: ActiveBlueprintNode = {
      pieceType: 'speed_booster',
      position: [4, 0, 6],
      rotationIndex: 1,
      valid: true,
    };
    expect(node.pieceType).toBe('speed_booster');
    expect(node.valid).toBe(true);
  });

  it('should export LevelDefinition interface', () => {
    const level: LevelDefinition = {
      id: 'test-level',
      name: 'Test Level',
      grid: [6, 4, 3],
      launchpad: {
        position: [0, 1, 0],
        direction: [1, 0, 0],
      },
      goal: {
        position: [10, 1, 4],
        radius: 1,
      },
      inventory: {
        straight_ramp: 3,
        speed_booster: 1,
        bumper_pad: 2,
        half_pipe: 0,
        goal_bucket: 1,
      },
      placedPieces: [],
    };
    expect(level.id).toBe('test-level');
    expect(level.grid).toEqual([6, 4, 3]);
    expect(level.goal).toBeDefined();
  });

  it('should export LevelDefinition with undefined goal for sandbox', () => {
    const sandboxLevel: LevelDefinition = {
      id: 'sandbox',
      name: 'Sandbox',
      grid: [10, 10, 5],
      launchpad: {
        position: [0, 1, 0],
        direction: [1, 0, 0],
      },
      goal: undefined,
      inventory: {
        straight_ramp: 99,
        speed_booster: 99,
        bumper_pad: 99,
        half_pipe: 99,
        goal_bucket: 0,
      },
      placedPieces: [],
    };
    expect(sandboxLevel.goal).toBeUndefined();
  });

  it('should export GameState interface', () => {
    const state: GameState = {
      machineState: 'BUILDING',
      activeMode: 'CAMPAIGN',
      activeLevelIndex: 0,
      inventory: {
        straight_ramp: 3,
        speed_booster: 1,
        bumper_pad: 2,
        half_pipe: 0,
        goal_bucket: 1,
      },
      placedPieces: [],
      activeBlueprintNode: undefined,
      selectedPieceId: undefined,
      trajectoryPreviewCache: new Map(),
    };
    expect(state.machineState).toBe('BUILDING');
    expect(state.activeMode).toBe('CAMPAIGN');
    expect(state.trajectoryPreviewCache).toBeInstanceOf(Map);
  });
});
