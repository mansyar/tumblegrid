import { describe, expect, it } from 'vitest';

import {
  createClearSelection,
  createLoadLevel,
  createPlacePiece,
  createRemovePiece,
  createRotatePiece,
  createSelectPiece,
  createSetMode,
  createTransitionState,
  createUpdateActiveBlueprint,
  createUpdateTrajectoryCache,
} from '@/store/actions';
import type { GameState, LevelDefinition } from '@/store/types';

const createTestState = (overrides?: Partial<GameState>): GameState => ({
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
  trajectoryPreviewCache: new Map(),
  ...overrides,
});

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

describe('Store Actions', () => {
  describe('createPlacePiece', () => {
    it('should place a piece successfully', () => {
      const state = createTestState();
      const result = createPlacePiece('straight_ramp', [2, 0, 2], 0)(state);

      expect(result.placedPieces).toHaveLength(1);
      expect(result.placedPieces[0].type).toBe('straight_ramp');
      expect(result.placedPieces[0].position).toEqual([2, 0, 2]);
      expect(result.placedPieces[0].rotationIndex).toBe(0);
      expect(result.inventory.straight_ramp).toBe(2);
    });

    it('should reject placement when inventory is empty', () => {
      const state = createTestState();
      const result = createPlacePiece('half_pipe', [2, 0, 2], 0)(state);

      expect(result.placedPieces).toHaveLength(0);
      expect(result.inventory.half_pipe).toBe(0);
    });

    it('should reject placement when position is out of bounds', () => {
      const state = createTestState();
      const result = createPlacePiece('straight_ramp', [11, 0, 2], 0)(state);

      expect(result.placedPieces).toHaveLength(0);
      expect(result.inventory.straight_ramp).toBe(3);
    });

    it('should reject placement when position is occupied', () => {
      const state = createTestState({
        placedPieces: [
          {
            id: 'existing',
            type: 'bumper_pad',
            position: [2, 0, 2],
            rotationIndex: 0,
          },
        ],
      });
      const result = createPlacePiece('straight_ramp', [2, 0, 2], 0)(state);

      expect(result.placedPieces).toHaveLength(1);
      expect(result.inventory.straight_ramp).toBe(3);
    });
  });

  describe('createRemovePiece', () => {
    it('should remove a piece and restore inventory', () => {
      const state = createTestState({
        placedPieces: [
          {
            id: 'test-id',
            type: 'straight_ramp',
            position: [2, 0, 2],
            rotationIndex: 0,
          },
        ],
        inventory: {
          straight_ramp: 2,
          speed_booster: 1,
          bumper_pad: 2,
          half_pipe: 0,
          goal_bucket: 1,
        },
      });
      const result = createRemovePiece('test-id')(state);

      expect(result.placedPieces).toHaveLength(0);
      expect(result.inventory.straight_ramp).toBe(3);
    });

    it('should return state unchanged if piece not found', () => {
      const state = createTestState();
      const result = createRemovePiece('nonexistent')(state);

      expect(result).toEqual(state);
    });

    it('should clear selectedPieceId if removing selected piece', () => {
      const state = createTestState({
        placedPieces: [
          {
            id: 'test-id',
            type: 'straight_ramp',
            position: [2, 0, 2],
            rotationIndex: 0,
          },
        ],
        selectedPieceId: 'test-id',
      });
      const result = createRemovePiece('test-id')(state);

      expect(result.selectedPieceId).toBeUndefined();
    });
  });

  describe('createRotatePiece', () => {
    it('should rotate piece from 0 to 1', () => {
      const state = createTestState({
        placedPieces: [
          {
            id: 'test-id',
            type: 'straight_ramp',
            position: [2, 0, 2],
            rotationIndex: 0,
          },
        ],
      });
      const result = createRotatePiece('test-id')(state);

      expect(result.placedPieces[0].rotationIndex).toBe(1);
    });

    it('should rotate piece from 3 to 0', () => {
      const state = createTestState({
        placedPieces: [
          {
            id: 'test-id',
            type: 'straight_ramp',
            position: [2, 0, 2],
            rotationIndex: 3,
          },
        ],
      });
      const result = createRotatePiece('test-id')(state);

      expect(result.placedPieces[0].rotationIndex).toBe(0);
    });

    it('should return state unchanged if piece not found', () => {
      const state = createTestState();
      const result = createRotatePiece('nonexistent')(state);

      expect(result).toEqual(state);
    });
  });

  describe('createSetMode', () => {
    it('should set mode to SANDBOX', () => {
      const state = createTestState();
      const result = createSetMode('SANDBOX')(state);

      expect(result.activeMode).toBe('SANDBOX');
    });

    it('should set mode to CAMPAIGN', () => {
      const state = createTestState({ activeMode: 'SANDBOX' });
      const result = createSetMode('CAMPAIGN')(state);

      expect(result.activeMode).toBe('CAMPAIGN');
    });
  });

  describe('createTransitionState', () => {
    it('should transition from BUILDING to PLAYING', () => {
      const state = createTestState({ machineState: 'BUILDING' });
      const result = createTransitionState('PLAYING')(state);

      expect(result.machineState).toBe('PLAYING');
    });

    it('should transition from PLAYING to LEVEL_CLEARED', () => {
      const state = createTestState({ machineState: 'PLAYING' });
      const result = createTransitionState('LEVEL_CLEARED')(state);

      expect(result.machineState).toBe('LEVEL_CLEARED');
    });

    it('should transition from PLAYING to BUILDING', () => {
      const state = createTestState({ machineState: 'PLAYING' });
      const result = createTransitionState('BUILDING')(state);

      expect(result.machineState).toBe('BUILDING');
    });

    it('should transition from LEVEL_CLEARED to BUILDING', () => {
      const state = createTestState({ machineState: 'LEVEL_CLEARED' });
      const result = createTransitionState('BUILDING')(state);

      expect(result.machineState).toBe('BUILDING');
    });

    it('should transition from SANDBOX_BUILDING to SANDBOX_PLAYING', () => {
      const state = createTestState({ machineState: 'SANDBOX_BUILDING' });
      const result = createTransitionState('SANDBOX_PLAYING')(state);

      expect(result.machineState).toBe('SANDBOX_PLAYING');
    });

    it('should transition from SANDBOX_PLAYING to SANDBOX_BUILDING', () => {
      const state = createTestState({ machineState: 'SANDBOX_PLAYING' });
      const result = createTransitionState('SANDBOX_BUILDING')(state);

      expect(result.machineState).toBe('SANDBOX_BUILDING');
    });

    it('should reject invalid transition from BUILDING to LEVEL_CLEARED', () => {
      const state = createTestState({ machineState: 'BUILDING' });
      const result = createTransitionState('LEVEL_CLEARED')(state);

      expect(result.machineState).toBe('BUILDING');
    });

    it('should reject invalid transition from BUILDING to SANDBOX_BUILDING', () => {
      const state = createTestState({ machineState: 'BUILDING' });
      const result = createTransitionState('SANDBOX_BUILDING')(state);

      expect(result.machineState).toBe('BUILDING');
    });
  });

  describe('createLoadLevel', () => {
    it('should load level correctly', () => {
      const state = createTestState();
      const result = createLoadLevel(testLevel)(state);

      expect(result.machineState).toBe('BUILDING');
      expect(result.inventory).toEqual(testLevel.inventory);
      expect(result.placedPieces).toHaveLength(1);
      expect(result.placedPieces[0].type).toBe('straight_ramp');
      expect(result.placedPieces[0].id).toBeDefined();
      expect(result.selectedPieceId).toBeUndefined();
      expect(result.activeBlueprintNode).toBeUndefined();
      expect(result.trajectoryPreviewCache.size).toBe(0);
    });

    it('should set SANDBOX_BUILDING state when in SANDBOX mode', () => {
      const state = createTestState({ activeMode: 'SANDBOX' });
      const result = createLoadLevel(testLevel)(state);

      expect(result.machineState).toBe('SANDBOX_BUILDING');
    });
  });

  describe('createUpdateActiveBlueprint', () => {
    it('should set active blueprint node', () => {
      const state = createTestState();
      const node = {
        pieceType: 'straight_ramp' as const,
        position: [2, 0, 2] as [number, number, number],
        rotationIndex: 0 as const,
        valid: true,
      };
      const result = createUpdateActiveBlueprint(node)(state);

      expect(result.activeBlueprintNode).toEqual(node);
    });

    it('should clear active blueprint node', () => {
      const state = createTestState({
        activeBlueprintNode: {
          pieceType: 'straight_ramp',
          position: [2, 0, 2],
          rotationIndex: 0,
          valid: true,
        },
      });
      const result = createUpdateActiveBlueprint(undefined)(state);

      expect(result.activeBlueprintNode).toBeUndefined();
    });
  });

  describe('createSelectPiece', () => {
    it('should select a piece', () => {
      const state = createTestState();
      const result = createSelectPiece('test-id')(state);

      expect(result.selectedPieceId).toBe('test-id');
    });
  });

  describe('createClearSelection', () => {
    it('should clear selection', () => {
      const state = createTestState({ selectedPieceId: 'test-id' });
      const result = createClearSelection()(state);

      expect(result.selectedPieceId).toBeUndefined();
    });
  });

  describe('createUpdateTrajectoryCache', () => {
    it('should update trajectory cache', () => {
      const state = createTestState();
      const points: [number, number, number][] = [
        [0, 0, 0],
        [1, 0, 1],
        [2, 0, 2],
      ];
      const result = createUpdateTrajectoryCache('test-key', points)(state);

      expect(result.trajectoryPreviewCache.get('test-key')).toEqual(points);
    });

    it('should add to existing cache', () => {
      const state = createTestState({
        trajectoryPreviewCache: new Map([['existing', [[0, 0, 0]]]]),
      });
      const points: [number, number, number][] = [[1, 1, 1]];
      const result = createUpdateTrajectoryCache('new-key', points)(state);

      expect(result.trajectoryPreviewCache.size).toBe(2);
      expect(result.trajectoryPreviewCache.get('existing')).toEqual([[0, 0, 0]]);
      expect(result.trajectoryPreviewCache.get('new-key')).toEqual([[1, 1, 1]]);
    });
  });
});
