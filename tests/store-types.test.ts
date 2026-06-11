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
      type: 'straight_ramp',
      position: [0, 0, 0],
      rotationIndex: 0,
    };
    expect(placement.type).toBe('straight_ramp');
    expect(placement.position).toEqual([0, 0, 0]);
    expect(placement.rotationIndex).toBe(0);
  });

  it('should export PlacedPiece interface extending PiecePlacement', () => {
    const piece: PlacedPiece = {
      id: 'test-id',
      type: 'bumper_pad',
      position: [2, 0, 4],
      rotationIndex: 2,
    };
    expect(piece.id).toBe('test-id');
    expect(piece.type).toBe('bumper_pad');
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
      title: 'Test Level',
      description: 'A test level',
      gridBounds: { width: 6, depth: 4, height: 3 },
      staticTerrain: [],
      inventory: {
        straight_ramp: 3,
        speed_booster: 1,
        bumper_pad: 2,
        half_pipe: 0,
        goal_bucket: 1,
      },
      launchpadPosition: [0, 1, 0],
      goalPosition: [10, 1, 4],
    };
    expect(level.id).toBe('test-level');
    expect(level.gridBounds).toEqual({ width: 6, depth: 4, height: 3 });
    expect(level.goalPosition).toBeDefined();
  });

  it('should export LevelDefinition without goalPosition for sandbox', () => {
    const sandboxLevel: LevelDefinition = {
      id: 'sandbox',
      title: 'Sandbox',
      description: 'Free-play mode',
      gridBounds: { width: 10, depth: 10, height: 5 },
      staticTerrain: [],
      inventory: {
        straight_ramp: 99,
        speed_booster: 99,
        bumper_pad: 99,
        half_pipe: 99,
        goal_bucket: 0,
      },
      launchpadPosition: [5, 4, 5],
    };
    expect(sandboxLevel.goalPosition).toBeUndefined();
  });

  it('should export GameState interface', () => {
    const state: GameState = {
      machineState: 'BUILDING',
      activeMode: 'CAMPAIGN',
      activeLevelIndex: 0,
      grid: [10, 10, 5],
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
      selectedBlueprintType: null,
      trajectoryPreviewCache: new Map(),
      launchpadPosition: [0, 1, 0],
    };
    expect(state.machineState).toBe('BUILDING');
    expect(state.activeMode).toBe('CAMPAIGN');
    expect(state.grid).toEqual([10, 10, 5]);
    expect(state.trajectoryPreviewCache).toBeInstanceOf(Map);
  });
});
