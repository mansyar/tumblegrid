import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createClearSelection,
  createLoadLevel,
  createPlacePiece,
  createRemovePiece,
  createResetLevel,
  createRotatePiece,
  createSelectPiece,
  createSetActiveLevelIndex,
  createSetCurrentScreen,
  createSetLevelCleared,
  createSetMarbleInBucket,
  createSetMode,
  createSetSelectedBlueprintType,
  createToggleDebugPhysics,
  createTransitionState,
  createUpdateActiveBlueprint,
  createUpdateTrajectoryCache,
} from './actions';
import type {
  ActiveBlueprintNode,
  GameState,
  GameStore,
  LevelDefinition,
  PieceType,
  Screen,
} from './types';

const initialState: GameState = {
  machineState: 'BUILDING',
  activeMode: 'CAMPAIGN',
  currentScreen: 'menu',
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
  launchpadPosition: [0, 1, 0],
  marbleInBucketIds: new Set(),
  debugPhysics: false,
  stashedLevelDefinition: undefined,
};

export const useGameStore = create<GameStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setCurrentScreen: (screen: Screen) => set(createSetCurrentScreen(screen)),

      setActiveLevelIndex: (index: number | undefined) =>
        set(createSetActiveLevelIndex(index)),

      placePiece: (
        pieceType: PieceType,
        position: [number, number, number],
        rotationIndex: 0 | 1 | 2 | 3,
      ) => set(createPlacePiece(pieceType, position, rotationIndex)),

      removePiece: (id: string) => set(createRemovePiece(id)),

      rotatePiece: (id: string) => set(createRotatePiece(id)),

      setMode: (mode: 'CAMPAIGN' | 'SANDBOX') => set(createSetMode(mode)),

      transitionState: (
        newState:
          | 'BUILDING'
          | 'PLAYING'
          | 'LEVEL_CLEARED'
          | 'SANDBOX_BUILDING'
          | 'SANDBOX_PLAYING',
      ) => set(createTransitionState(newState)),

      loadLevel: (level: LevelDefinition) => set(createLoadLevel(level)),

      updateActiveBlueprint: (node: ActiveBlueprintNode | undefined) =>
        set(createUpdateActiveBlueprint(node)),

      selectPiece: (id: string) => set(createSelectPiece(id)),

      clearSelection: () => set(createClearSelection()),

      setSelectedBlueprintType: (pieceType: PieceType | null) =>
        set(createSetSelectedBlueprintType(pieceType)),

      updateTrajectoryCache: (
        key: string,
        points: [number, number, number][],
      ) => set(createUpdateTrajectoryCache(key, points)),

      setMarbleInBucket: (bucketId: string, inside: boolean) =>
        set(createSetMarbleInBucket(bucketId, inside)),

      toggleDebugPhysics: () => set(createToggleDebugPhysics()),

      setLevelCleared: () => set(createSetLevelCleared()),

      resetLevel: () => set(createResetLevel()),
    }),
    { name: 'TumbleGridStore' },
  ),
);
