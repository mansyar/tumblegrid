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

export type Screen = 'menu' | 'levelSelect' | 'game';

export interface PiecePlacement {
  type: PieceType;
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

export interface GridBounds {
  width: number;
  depth: number;
  height: number;
}

export interface LevelDefinition {
  id: string;
  title: string;
  description: string;
  gridBounds: GridBounds;
  staticTerrain: PiecePlacement[];
  inventory: Partial<Record<PieceType, number>>;
  launchpadPosition: [number, number, number];
  goalPosition?: [number, number, number];
}

export interface GameState {
  machineState: MachineState;
  activeMode: ActiveMode;
  currentScreen: Screen;
  activeLevelIndex: number | undefined;
  grid: [number, number, number];
  inventory: Record<PieceType, number>;
  placedPieces: PlacedPiece[];
  activeBlueprintNode: ActiveBlueprintNode | undefined;
  selectedPieceId: string | undefined;
  selectedBlueprintType: PieceType | null;
  trajectoryPreviewCache: Map<string, [number, number, number][]>;
  launchpadPosition: [number, number, number];
  /** Set of goal bucket piece IDs that the marble is currently inside. */
  marbleInBucketIds: Set<string>;
  /** Toggle for Rapier debug wireframe visualization (D key). */
  debugPhysics: boolean;
}

export interface StoreActions {
  setCurrentScreen: (screen: Screen) => void;
  placePiece: (
    pieceType: PieceType,
    position: [number, number, number],
    rotationIndex: 0 | 1 | 2 | 3,
  ) => void;
  removePiece: (id: string) => void;
  rotatePiece: (id: string) => void;
  setMode: (mode: ActiveMode) => void;
  transitionState: (newState: MachineState) => void;
  loadLevel: (level: LevelDefinition) => void;
  updateActiveBlueprint: (node: ActiveBlueprintNode | undefined) => void;
  selectPiece: (id: string) => void;
  clearSelection: () => void;
  setSelectedBlueprintType: (pieceType: PieceType | null) => void;
  updateTrajectoryCache: (
    key: string,
    points: [number, number, number][],
  ) => void;
  setMarbleInBucket: (bucketId: string, inside: boolean) => void;
  toggleDebugPhysics: () => void;
}

export type GameStore = GameState & StoreActions;
