import { describe, expect, it, beforeEach } from 'vitest';
import type { LevelDefinition } from '@/store/types';
import { useGameStore } from '@/store/useGameStore';

const testLevel: LevelDefinition = {
  id: 'test-level',
  title: 'Test Level',
  description: 'A test level for integration tests',
  gridBounds: { width: 10, depth: 10, height: 5 },
  staticTerrain: [],
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

describe('UI-Store Integration', () => {
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
      selectedBlueprintType: null,
      trajectoryPreviewCache: new Map(),
    });
  });

  describe('inventory selection affects ghost preview', () => {
    it('setSelectedBlueprintType updates store state', () => {
      expect(useGameStore.getState().selectedBlueprintType).toBeNull();

      useGameStore.getState().setSelectedBlueprintType('straight_ramp');
      expect(useGameStore.getState().selectedBlueprintType).toBe(
        'straight_ramp',
      );

      useGameStore.getState().setSelectedBlueprintType('speed_booster');
      expect(useGameStore.getState().selectedBlueprintType).toBe(
        'speed_booster',
      );

      useGameStore.getState().setSelectedBlueprintType(null);
      expect(useGameStore.getState().selectedBlueprintType).toBeNull();
    });

    it('loadLevel resets selectedBlueprintType to null', () => {
      useGameStore.getState().setSelectedBlueprintType('goal_bucket');
      expect(useGameStore.getState().selectedBlueprintType).toBe(
        'goal_bucket',
      );

      useGameStore.getState().loadLevel(testLevel);
      expect(useGameStore.getState().selectedBlueprintType).toBeNull();
    });
  });

  describe('mode transitions update UI-relevant state', () => {
    it('transitionState changes machineState to PLAYING and back to BUILDING', () => {
      expect(useGameStore.getState().machineState).toBe('BUILDING');

      useGameStore.getState().transitionState('PLAYING');
      expect(useGameStore.getState().machineState).toBe('PLAYING');

      useGameStore.getState().transitionState('BUILDING');
      expect(useGameStore.getState().machineState).toBe('BUILDING');
    });

    it('trajectory cache is writable and readable from store', () => {
      const waypoints: [number, number, number][] = [
        [0, 0, 0],
        [1, 0, 1],
        [2, 0, 2],
      ];

      useGameStore
        .getState()
        .updateTrajectoryCache('preview', waypoints);

      const cached =
        useGameStore.getState().trajectoryPreviewCache.get('preview');
      expect(cached).toEqual(waypoints);
    });
  });
});
