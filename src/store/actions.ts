import type {
  ActiveBlueprintNode,
  ActiveMode,
  GameState,
  LevelDefinition,
  MachineState,
  PieceType,
  PlacedPiece,
} from './types';

export const createPlacePiece =
  (pieceType: PieceType, position: [number, number, number], rotationIndex: 0 | 1 | 2 | 3) =>
  (state: GameState): GameState => {
    // Check inventory
    if (state.inventory[pieceType] <= 0) {
      return state;
    }

    // Check bounds
    if (
      position[0] < 0 ||
      position[0] >= state.grid[0] ||
      position[1] < 0 ||
      position[1] >= state.grid[1] ||
      position[2] < 0 ||
      position[2] >= state.grid[2]
    ) {
      return state;
    }

    // Check overlap
    const isOccupied = state.placedPieces.some(
      (p) =>
        p.position[0] === position[0] &&
        p.position[1] === position[1] &&
        p.position[2] === position[2]
    );
    if (isOccupied) {
      return state;
    }

    const newPiece: PlacedPiece = {
      id: crypto.randomUUID(),
      pieceType,
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
        [piece.pieceType]: state.inventory[piece.pieceType] + 1,
      },
      selectedPieceId: state.selectedPieceId === id ? undefined : state.selectedPieceId,
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
        p.id === id ? { ...p, rotationIndex: newRotation } : p
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
    return {
      ...state,
      machineState: state.activeMode === 'SANDBOX' ? 'SANDBOX_BUILDING' : 'BUILDING',
      inventory: { ...level.inventory },
      placedPieces: level.placedPieces.map((p) => ({
        ...p,
        id: crypto.randomUUID(),
      })),
      selectedPieceId: undefined,
      activeBlueprintNode: undefined,
      trajectoryPreviewCache: new Map(),
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
