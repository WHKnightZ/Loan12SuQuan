export type TileType = "SWORD" | "HEART" | "GOLD" | "ENERGY" | "MANA" | "EXP" | "SWORDRED";

export type Point = { x: number; y: number };

export type PointExt = Point & { value: number };

export type AllMatchedPositions = { x0: number; y0: number; x1: number; y1: number; point: number }[];

export type TileInfo = PointExt & { point: number };

export type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";

export type GameState = "IDLE" | "SELECT" | "EXPLODE" | "FALL" | "FADE" | "WAIT";

export type FallItem = {
  list: (PointExt & { offset: number; v: number })[];
  below: number;
  pushCount?: number;
};

export type Matched4 = {
  turnCount: number;
  matchedList: { [key: string]: boolean };
};

export type Wait = {
  timer: number;
  maxTimer: number;
  callback: () => void;
};

export type PlayerAttribute = {
  value: number;
  maxValue: number;
  timer: number;
  display: number;
};

export type PlayerAttributeExtra = {
  attribute: PlayerAttribute;
  texture: HTMLImageElement;
  maxTimer: number;
};

export interface IPlayer {
  index: number;
  game: IGame;

  life: PlayerAttribute;
  mana: PlayerAttribute;
  energy: PlayerAttribute;
  attack: number;
  intelligence: number;
  barOffsetX: number;
  bars: PlayerAttributeExtra[];
  energyTimer: number;
  avatar: HTMLImageElement;
  avatarOffset: { x: number; y: number };
  turn: number;
  springIndex: number;

  getHintIndex(matchedLength: number): number;
  takeDamage(damage: number): void;
  gainLife(value: number): void;
  gainEnergy(value: number): void;
  gainMana(value: number): void;
  shock(): void;
  render(): void;
  update(): void;
}

export interface IGame {
  state: GameState;
  selected: PointExt | null;
  swapped: PointExt | null;
  reswap: boolean;

  fall: {
    [key: number]: FallItem;
  };

  combo: number;
  explosions: PointExt[];
  explodedTiles: TileInfo[];
  matched4Tiles: Point[];
  matched4: Matched4;

  tIdle: number;
  tSelect: number;
  tSwap: number;
  tExplode: number;
  tExplode2: number;
  tFadeIn: number;
  tFadeOut: number;
  tHintDelay: number;
  startTurnTime: number;

  isFadeIn: boolean;
  isFadeOut: boolean;

  wait: Wait;

  matchedPositions: AllMatchedPositions;
  hintIndex: number;

  players: IPlayer[];
  playerTurn: number;
  turnCount: number;

  needUpdate: boolean;

  computerTimer: number;

  init(): void;
  matchPosition(
    x: number,
    y: number
  ): {
    matched: boolean;
    tiles: TileInfo[];
    point: number;
    matched4Tiles: Point[];
  };
  swap(x0: number, y0: number, x1: number, y1: number): void;
  addMatchedPosition(allMatchedPositions: AllMatchedPositions, x0: number, y0: number, x1: number, y1: number): void;
  findAllMatchedPositions(): void;
  onClick(e: MouseEvent): void;
  onKeyDown(e: KeyboardEvent): void;
  changePlayer(): void;
  idle(): void;
  explode(): void;
  fadeIn(): void;
  fadeOut(): void;
  gainTile(tile: TileInfo): void;
  updateComputer(): void;
  render(): void;
  update(): void;
}

export type GameStateFunction = {
  render: (self: IGame) => void;
  update: (self: IGame) => void;
};

export type HintArrow = {
  offset: { x: number; y: number };
  drt: { x: number; y: number };
  texture: HTMLImageElement;
};

export type FontChar = { texture: HTMLImageElement; offsetY: number };
