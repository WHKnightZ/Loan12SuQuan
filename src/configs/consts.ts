import { TileType } from "@/types";

export const APP_NAME = "Loạn 12 Sứ Quân";

export const BOARD_COLORS = ["#3e3226", "#554933"];
export const BACKGROUND_COLOR = BOARD_COLORS[0];
export const MAP_WIDTH = 8;
export const MAP_WIDTH_1 = MAP_WIDTH - 1;
export const TOTAL_TILES = MAP_WIDTH * MAP_WIDTH;
export const CELL_SIZE = 60;
export const BOARD_SIZE = MAP_WIDTH * CELL_SIZE;
export const MENU_HEIGHT = 120;
export const SCREEN_WIDTH = BOARD_SIZE;
export const SCREEN_HEIGHT = BOARD_SIZE + MENU_HEIGHT;

export const TILE_SIZE = 50;
export const REAL_TILE_SIZE = 28;
export const TILE_LENGTH = 7;
// export const TILE_SIZE = 76;
// export const REAL_TILE_SIZE = 33;
// export const TILE_LENGTH = 5;

export const TILE_OFFSET = Math.floor((CELL_SIZE - TILE_SIZE) / 2);
export const GAIN_TURN = 3;
export const MATCH_4_POINT = 50;
export const SWAP_DURATION = 10;
export const SWAP_OFFSET = CELL_SIZE / SWAP_DURATION;
export const VELOCITY_BASE = 2;
export const GRAVITY = 0.4;
export const SCALE_RATIO = TILE_SIZE / REAL_TILE_SIZE;
export const CORNER_SELECTION_CYCLE = 30;
export const HINT_ARROW_CYCLE = 30;

export const PLAYER_INTELLIGENCE = 40;
export const DEFAULT_MANA = 100;
export const DEFAULT_ENERGY = 100;

export const TILES: { [key in TileType]: number } = {
  SWORD: 0,
  HEART: 1,
  GOLD: 2,
  ENERGY: 3,
  MANA: 4,
  EXP: 5,
  SWORDRED: 6,
};

export const COUNT_TILES = Object.keys(TILES).length;

export const mapTileInfo: {
  [key: number]: {
    texture: HTMLImageElement;
    compatible: number[];
    probability: number;
    point: number;
    explosions: HTMLImageElement[];
  };
} = {
  [TILES.SWORD]: { compatible: [TILES.SWORDRED], probability: 90, point: 10, texture: null as any, explosions: [] },
  [TILES.HEART]: { compatible: [], probability: 100, point: 9, texture: null as any, explosions: [] },
  [TILES.GOLD]: { compatible: [], probability: 100, point: 6, texture: null as any, explosions: [] },
  [TILES.ENERGY]: { compatible: [], probability: 100, point: 7, texture: null as any, explosions: [] },
  [TILES.MANA]: { compatible: [], probability: 100, point: 8, texture: null as any, explosions: [] },
  [TILES.EXP]: { compatible: [], probability: 100, point: 6, texture: null as any, explosions: [] },
  [TILES.SWORDRED]: { compatible: [TILES.SWORD], probability: 10, point: 30, texture: null as any, explosions: [] },
};

export const base: {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  map: number[][];
} = {} as any;

export const cornerSelectionOffsets = Array.from({ length: CORNER_SELECTION_CYCLE }).map((_, i) =>
  Math.floor(3 * Math.sin((2 * Math.PI * i) / CORNER_SELECTION_CYCLE))
);

export const hintArrowOffsets = Array.from({ length: HINT_ARROW_CYCLE }).map((_, i) =>
  Math.floor(3 * Math.sin((2 * Math.PI * i) / HINT_ARROW_CYCLE))
);
