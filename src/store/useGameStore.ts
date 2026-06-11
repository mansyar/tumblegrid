import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createClearSelection,
  createLoadLevel,
  createPlacePiece,
  createRemovePiece,
  createRotatePiece,
  createSelectPiece,
  createSetMode,
  createSetSelectedBlueprintType,
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
} from './types';

const initialState: GameState = {
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
};

export const useGameStore = create<GameStore>()(
  devtools(
    (set) => ({
      ...initialState,

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
    }),
    { name: 'TumbleGridStore' },
  ),
);
