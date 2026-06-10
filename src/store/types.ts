export type PieceType =
  | 'straight_ramp'
  | 'speed_booster'
  | 'bumper_pad'
  | 'half_pipe'
  | 'goal_bucket';

export type MachineState =
  | 'BUILDING'
  | 'PLAYING'
  | 'LEVEL_CLEARED'
  | 'SANDBOX_BUILDING'
  | 'SANDBOX_PLAYING';

export type ActiveMode = 'CAMPAIGN' | 'SANDBOX';

export interface PiecePlacement {
  pieceType: PieceType;
  position: [number, number, number];
  rotationIndex: 0 | 1 | 2 | 3;
}

export interface PlacedPiece extends PiecePlacement {
  id: string;
}

export interface ActiveBlueprintNode {
  pieceType: PieceType;
  position: [number, number, number];
  rotationIndex: 0 | 1 | 2 | 3;
  valid: boolean;
}

export interface LevelDefinition {
  id: string;
  name: string;
  grid: [number, number, number];
  launchpad: {
    position: [number, number, number];
    direction: [number, number, number];
  };
  goal:
    | {
        position: [number, number, number];
        radius: number;
      }
    | undefined;
  inventory: Record<PieceType, number>;
  placedPieces: PiecePlacement[];
}

export interface GameState {
  machineState: MachineState;
  activeMode: ActiveMode;
  activeLevelIndex: number | undefined;
  grid: [number, number, number];
  inventory: Record<PieceType, number>;
  placedPieces: PlacedPiece[];
  activeBlueprintNode: ActiveBlueprintNode | undefined;
  selectedPieceId: string | undefined;
  trajectoryPreviewCache: Map<string, [number, number, number][]>;
}

export interface StoreActions {
  placePiece: (
    pieceType: PieceType,
    position: [number, number, number],
    rotationIndex: 0 | 1 | 2 | 3
  ) => void;
  removePiece: (id: string) => void;
  rotatePiece: (id: string) => void;
  setMode: (mode: ActiveMode) => void;
  transitionState: (newState: MachineState) => void;
  loadLevel: (level: LevelDefinition) => void;
  updateActiveBlueprint: (node: ActiveBlueprintNode | undefined) => void;
  selectPiece: (id: string) => void;
  clearSelection: () => void;
  updateTrajectoryCache: (
    key: string,
    points: [number, number, number][]
  ) => void;
}

export type GameStore = GameState & StoreActions;
