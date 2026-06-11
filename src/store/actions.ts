import type {
  ActiveBlueprintNode,
  ActiveMode,
  GameState,
  LevelDefinition,
  MachineState,
  PieceType,
  PlacedPiece,
} from './types';

export const createSetSelectedBlueprintType =
  (pieceType: PieceType | null) =>
  (state: GameState): GameState => {
    return {
      ...state,
      selectedBlueprintType: pieceType,
    };
  };

export const createPlacePiece =
  (
    pieceType: PieceType,
    position: [number, number, number],
    rotationIndex: 0 | 1 | 2 | 3,
  ) =>
  (state: GameState): GameState => {
    // Check inventory
    if (state.inventory[pieceType] <= 0) {
      return state;
    }

    // Check bounds: grid = [width, depth, height], position = [x, y, z]
    // x → width (grid[0]), y → height (grid[2]), z → depth (grid[1])
    if (
      position[0] < 0 ||
      position[0] >= state.grid[0] ||
      position[1] < 0 ||
      position[1] >= state.grid[2] ||
      position[2] < 0 ||
      position[2] >= state.grid[1]
    ) {
      return state;
    }

    // Check overlap
    const isOccupied = state.placedPieces.some(
      (p) =>
        p.position[0] === position[0] &&
        p.position[1] === position[1] &&
        p.position[2] === position[2],
    );
    if (isOccupied) {
      return state;
    }

    const newPiece: PlacedPiece = {
      id: crypto.randomUUID(),
      type: pieceType,
      position,
      rotationIndex,
    };

    return {
      ...state,
      placedPieces: [...state.placedPieces, newPiece],
      inventory: {
        ...state.inventory,
        [pieceType]: state.inventory[pieceType] - 1,
      },
    };
  };

export const createRemovePiece =
  (id: string) =>
  (state: GameState): GameState => {
    const piece = state.placedPieces.find((p) => p.id === id);
    if (!piece) {
      return state;
    }

    return {
      ...state,
      placedPieces: state.placedPieces.filter((p) => p.id !== id),
      inventory: {
        ...state.inventory,
        [piece.type]: state.inventory[piece.type] + 1,
      },
      selectedPieceId:
        state.selectedPieceId === id ? undefined : state.selectedPieceId,
    };
  };

export const createRotatePiece =
  (id: string) =>
  (state: GameState): GameState => {
    const piece = state.placedPieces.find((p) => p.id === id);
    if (!piece) {
      return state;
    }

    const newRotation = ((piece.rotationIndex + 1) % 4) as 0 | 1 | 2 | 3;

    return {
      ...state,
      placedPieces: state.placedPieces.map((p) =>
        p.id === id ? { ...p, rotationIndex: newRotation } : p,
      ),
    };
  };

export const createSetMode =
  (mode: ActiveMode) =>
  (state: GameState): GameState => {
    return {
      ...state,
      activeMode: mode,
    };
  };

export const createTransitionState =
  (newState: MachineState) =>
  (state: GameState): GameState => {
    const validTransitions: Record<MachineState, MachineState[]> = {
      BUILDING: ['PLAYING'],
      PLAYING: ['LEVEL_CLEARED', 'BUILDING'],
      LEVEL_CLEARED: ['BUILDING'],
      SANDBOX_BUILDING: ['SANDBOX_PLAYING'],
      SANDBOX_PLAYING: ['SANDBOX_BUILDING'],
    };

    if (!validTransitions[state.machineState]?.includes(newState)) {
      return state;
    }

    return {
      ...state,
      machineState: newState,
    };
  };

export const createLoadLevel =
  (level: LevelDefinition) =>
  (state: GameState): GameState => {
    const fullInventory: Record<PieceType, number> = {
      straight_ramp: level.inventory.straight_ramp ?? 0,
      speed_booster: level.inventory.speed_booster ?? 0,
      bumper_pad: level.inventory.bumper_pad ?? 0,
      half_pipe: level.inventory.half_pipe ?? 0,
      goal_bucket: level.inventory.goal_bucket ?? 0,
    };

    return {
      ...state,
      machineState:
        state.activeMode === 'SANDBOX' ? 'SANDBOX_BUILDING' : 'BUILDING',
      grid: [
        level.gridBounds.width,
        level.gridBounds.depth,
        level.gridBounds.height,
      ],
      inventory: fullInventory,
      placedPieces: level.staticTerrain.map((p) => ({
        ...p,
        id: crypto.randomUUID(),
      })),
      selectedPieceId: undefined,
      activeBlueprintNode: undefined,
      selectedBlueprintType: null,
      trajectoryPreviewCache: new Map(),
      launchpadPosition: level.launchpadPosition,
    };
  };

export const createUpdateActiveBlueprint =
  (node: ActiveBlueprintNode | undefined) =>
  (state: GameState): GameState => {
    return {
      ...state,
      activeBlueprintNode: node,
    };
  };

export const createSelectPiece =
  (id: string) =>
  (state: GameState): GameState => {
    return {
      ...state,
      selectedPieceId: id,
    };
  };

export const createClearSelection =
  () =>
  (state: GameState): GameState => {
    return {
      ...state,
      selectedPieceId: undefined,
    };
  };

export const createUpdateTrajectoryCache =
  (key: string, points: [number, number, number][]) =>
  (state: GameState): GameState => {
    const newCache = new Map(state.trajectoryPreviewCache);
    newCache.set(key, points);
    return {
      ...state,
      trajectoryPreviewCache: newCache,
    };
  };

export const createSetMarbleInBucket =
  (bucketId: string, inside: boolean) =>
  (state: GameState): GameState => {
    const next = new Set(state.marbleInBucketIds);
    if (inside) {
      next.add(bucketId);
    } else {
      next.delete(bucketId);
    }
    return {
      ...state,
      marbleInBucketIds: next,
    };
  };
