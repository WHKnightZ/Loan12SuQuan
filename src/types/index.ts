export type TileType = "SWORD" | "HEART" | "GOLD" | "ENERGY" | "MANA" | "EXP" | "SWORDRED";

export type Point = { x: number; y: number; value: number };

export type AllMatchedPositions = { x0: number; y0: number; x1: number; y1: number; point: number }[];

export type TileInfo = { x: number; y: number; point: number; value: number };

export type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";

export type GameState = "IDLE" | "SELECT" | "EXPLODE" | "FALL" | "FADE";

export type FallItem = {
  list: { x: number; y: number; offset: number; v: number; value: number }[];
  below: number;
  pushCount?: number;
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

  getHintIndex(matchedLength: number): number;
  takeDamage(damage: number): void;
  gainLife(value: number): void;
  gainEnergy(value: number): void;
  gainMana(value: number): void;
  render(): void;
  update(): void;
}

export interface IGame {
  state: GameState;
  selected: Point | null;
  swapped: Point | null;
  reswap: boolean;

  fall: {
    [key: number]: FallItem;
  };

  explosions: Point[];
  explodedTiles: TileInfo[];

  tIdle: number;
  tSelect: number;
  tSwap: number;
  tExplode: number;
  tExplode2: number;
  tFadeIn: number;
  tFadeOut: number;
  tHintDelay: number;

  isFadeIn: boolean;
  isFadeOut: boolean;

  matchedPositions: AllMatchedPositions;
  hintIndex: number;

  players: IPlayer[];
  playerTurn: number;

  init(): void;
  matchPosition(
    x: number,
    y: number
  ): {
    matched: boolean;
    tiles: TileInfo[];
    point: number;
    turn: number;
  };
  swap(x0: number, y0: number, x1: number, y1: number): void;
  addMatchedPosition(allMatchedPositions: AllMatchedPositions, x0: number, y0: number, x1: number, y1: number): void;
  findAllMatchedPositions(): void;
  onClick(e: MouseEvent): void;
  onKeyDown(e: KeyboardEvent): void;
  idle(): void;
  fadeIn(): void;
  fadeOut(): void;
  gainTile(tile: TileInfo): void;
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
