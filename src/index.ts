import { getImageSrc, getKeys } from "./utils/common";

const MAP_WIDTH = 8;
const CELL_SIZE = 60;
const SCREEN_SIZE = MAP_WIDTH * CELL_SIZE;
const TILE_SIZE = 54;
const TILE_OFFSET = Math.floor((CELL_SIZE - TILE_SIZE) / 2);

type TileType = "SWORD" | "HEART" | "GOLD" | "ENERGY" | "MANA" | "EXP" | "SWORDRED";

const TILES: { [key in TileType]: number } = { SWORD: 0, HEART: 1, GOLD: 2, ENERGY: 3, MANA: 4, EXP: 5, SWORDRED: 6 };

const COUNT_TILES = Object.keys(TILES).length;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;

canvas.width = canvas.height = SCREEN_SIZE;

const tiles: {
  [key: number]: {
    texture: HTMLImageElement;
    compatible: number[];
    probability: number;
  };
} = {
  [TILES.SWORD]: { compatible: [TILES.SWORDRED], probability: 100, texture: null as any },
  [TILES.HEART]: { compatible: [], probability: 100, texture: null as any },
  [TILES.GOLD]: { compatible: [], probability: 100, texture: null as any },
  [TILES.ENERGY]: { compatible: [], probability: 100, texture: null as any },
  [TILES.MANA]: { compatible: [], probability: 100, texture: null as any },
  [TILES.EXP]: { compatible: [], probability: 100, texture: null as any },
  [TILES.SWORDRED]: { compatible: [TILES.SWORD], probability: 10, texture: null as any },
};

export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min; // Include min, exclude max

let sumProbability = 0;
const tileProbabilities = Array.from({ length: COUNT_TILES }).map((_, index) => {
  const probability = tiles[index].probability;
  sumProbability += probability;
  return sumProbability;
});

export const randomTile = () => {
  const rd = random(0, sumProbability);

  for (let i = 0; i < COUNT_TILES; i += 1) {
    if (rd <= tileProbabilities[i]) return i;
  }

  return -1;
};

const generateMap = () => Array.from({ length: MAP_WIDTH }).map(() => Array.from({ length: MAP_WIDTH }).map(randomTile));

const map = generateMap();

const check = (x: number, y: number, posValue: number, compatible: number[]) => {
  const value = map[y][x];
  return value === posValue || compatible.includes(value);
};

const findFromPos = (x: number, y: number) => {
  let h = 0;
  let v = 0;
  let newX: number, newY: number;
  const posValue = map[y][x];
  const compatible = tiles[posValue].compatible;

  newX = x - 1;
  while (newX >= 0) {
    if (!check(newX, y, posValue, compatible)) break;
    h += 1;
  }
  newX = x + 1;
  while (newX < MAP_WIDTH) {
    if (!check(newX, y, posValue, compatible)) break;
    h += 1;
  }
  newY = y - 1;
  while (newY >= 0) {
    if (!check(x, newY, posValue, compatible)) break;
    v += 1;
  }
  newY = y + 1;
  while (newY < MAP_WIDTH) {
    if (!check(x, newY, posValue, compatible)) break;
    v += 1;
  }

  if (h < 2) h = 0;
};

const init = async () => {
  context.imageSmoothingEnabled = false;

  const loadImage = (key: number, src: string) => {
    const image = new Image();
    tiles[key].texture = image;
    image.src = getImageSrc(`tiles/${src}`);
    return new Promise((res) => (image.onload = () => res(image)));
  };

  await Promise.all(getKeys(TILES).map((tile, index) => loadImage(index, tile.toLowerCase())));
};

const render = () => {
  for (let i = 0; i < MAP_WIDTH; i += 1) {
    for (let j = 0; j < MAP_WIDTH; j += 1) {
      context.fillStyle = (i + j) % 2 ? "#554933" : "#3e3226";
      const x = j * CELL_SIZE;
      const y = i * CELL_SIZE;
      context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      context.drawImage(tiles[map[i][j]].texture, x + TILE_OFFSET, y + TILE_OFFSET, TILE_SIZE, TILE_SIZE);
    }
  }
};

const main = async () => {
  await init();

  render();
};

main();
