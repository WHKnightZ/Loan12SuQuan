export type TileType = "SWORD" | "HEART" | "GOLD" | "ENERGY" | "MANA" | "EXP" | "SWORDRED";

export type Point = { x: number; y: number; value: number };

export type AllMatchedPositions = { x0: number; y0: number; x1: number; y1: number; point: number }[];

export type TileInfo = { x: number; y: number; point: number; value: number };

export type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";

export type GameState = "IDLE" | "SELECT" | "EXPLODE" | "FALL" | "FADE";

export interface IGame {
  state: GameState;
  selected: Point | null;
  swapped: Point | null;
  reswap: boolean;

  fall: {
    [key: number]: {
      list: { x: number; y: number; offset: number; v: number; value: number }[];
      below: number;
      pushCount?: number;
    };
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

  fadeIn: boolean;
  fadeOut: boolean;

  matchedPositions: AllMatchedPositions;
  hintIndex: number;

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
