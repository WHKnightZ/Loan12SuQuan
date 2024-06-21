export type ITileType = "SWORD" | "HEART" | "GOLD" | "ENERGY" | "MANA" | "EXP" | "SWORDRED";

export type IPoint = { x: number; y: number };

export type IPointExt = IPoint & { value: number };

export type IAllMatchedPositions = { x0: number; y0: number; x1: number; y1: number; score: number }[];

export type ITileInfo = IPointExt & { point: number };

export type IDirection = "UP" | "RIGHT" | "DOWN" | "LEFT";

export type IGameState = "IDLE" | "SELECT" | "EXPLODE" | "FALL" | "FADE" | "WAIT";

export type IFallItem = {
  list: (IPointExt & { offset: number; v: number })[];
  below: number;
  pushCount?: number;
};

export type IMatched4 = {
  turnCount: number;
  matchedList: { [key: string]: boolean };
};

export type IWait = {
  timer: number;
  maxTimer: number;
  callback: () => void;
};

export type IPlayerAttribute = {
  value: number;
  maxValue: number;
  timer: number;
  display: number;
};

export type IPlayerAttributeExtra = {
  attribute: IPlayerAttribute;
  texture: HTMLImageElement;
  maxTimer: number;
};

export interface IPlayer {
  index: number;
  game: IGame;

  life: IPlayerAttribute;
  mana: IPlayerAttribute;
  energy: IPlayerAttribute;
  attack: number;
  intelligence: number;
  barOffsetX: number;
  bars: IPlayerAttributeExtra[];
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
  state: IGameState;
  selected: IPointExt | null;
  swapped: IPointExt | null;
  reswap: boolean;

  fall: {
    [key: number]: IFallItem;
  };

  combo: number;
  explosions: IPointExt[];
  explodedTiles: ITileInfo[];
  matched4Tiles: IPoint[];
  matched4: IMatched4;

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

  wait: IWait;

  matchedPositions: IAllMatchedPositions;
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
    tiles: ITileInfo[];
    point: number;
    matched4Tiles: IPoint[];
  };
  swap(x0: number, y0: number, x1: number, y1: number): void;
  addMatchedPosition(allMatchedPositions: IAllMatchedPositions, x0: number, y0: number, x1: number, y1: number): void;
  findAllMatchedPositions(): void;
  onClick(e: MouseEvent): void;
  onKeyDown(e: KeyboardEvent): void;
  changePlayer(): void;
  idle(): void;
  explode(): void;
  fadeIn(): void;
  fadeOut(): void;
  gainTile(tile: ITileInfo): void;
  updateComputer(): void;
  render(): void;
  update(): void;
}

export type IGameStateFunction = {
  render: (self: IGame) => void;
  update: (self: IGame) => void;
};

export type IHintArrow = {
  offset: { x: number; y: number };
  drt: { x: number; y: number };
  texture: HTMLImageElement;
};

export type IFontChar = { texture: HTMLImageElement; offsetY: number };
