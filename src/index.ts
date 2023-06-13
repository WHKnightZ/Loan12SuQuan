import { getImageSrc, getKeys } from "./utils/common";

const MAP_WIDTH = 8;
const CELL_SIZE = 60;
const SCREEN_SIZE = MAP_WIDTH * CELL_SIZE;
const TILE_SIZE = 54;
const TILE_OFFSET = Math.floor((CELL_SIZE - TILE_SIZE) / 2);
const GAIN_TURN = 3;
const MATCH_4_POINT = 50;

type TileType = "SWORD" | "HEART" | "GOLD" | "ENERGY" | "MANA" | "EXP" | "SWORDRED";

const TILES: { [key in TileType]: number } = { SWORD: 0, HEART: 1, GOLD: 2, ENERGY: 3, MANA: 4, EXP: 5, SWORDRED: 6 };

const COUNT_TILES = Object.keys(TILES).length;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;

canvas.width = canvas.height = SCREEN_SIZE;

const mapTileInfo: {
  [key: number]: {
    texture: HTMLImageElement;
    compatible: number[];
    probability: number;
    point: number;
  };
} = {
  [TILES.SWORD]: { compatible: [TILES.SWORDRED], probability: 100, point: 10, texture: null as any },
  [TILES.HEART]: { compatible: [], probability: 100, point: 9, texture: null as any },
  [TILES.GOLD]: { compatible: [], probability: 100, point: 6, texture: null as any },
  [TILES.ENERGY]: { compatible: [], probability: 100, point: 7, texture: null as any },
  [TILES.MANA]: { compatible: [], probability: 100, point: 8, texture: null as any },
  [TILES.EXP]: { compatible: [], probability: 100, point: 6, texture: null as any },
  [TILES.SWORDRED]: { compatible: [TILES.SWORD], probability: 10, point: 30, texture: null as any },
};

export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min; // Include min, exclude max

let sumProbability = 0;
const tileProbabilities = Array.from({ length: COUNT_TILES }).map((_, index) => {
  const probability = mapTileInfo[index].probability;
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

const generateMap = () => {
  const genBase = () => Array.from({ length: MAP_WIDTH }).map(() => Array.from({ length: MAP_WIDTH }).map(randomTile));

  const mapBase = genBase();

  const check = (x: number, y: number, posValue: number, compatible: number[]) => {
    const value = mapBase[y][x];
    return value === posValue || compatible.includes(value);
  };

  const checkMatched = (x: number, y: number) => {
    let h = 0;
    let v = 0;
    const posValue = mapBase[y][x];
    const compatible = mapTileInfo[posValue].compatible;

    let newX = x + 1;
    while (newX < MAP_WIDTH) {
      if (!check(newX, y, posValue, compatible)) break;
      h += 1;
      newX += 1;
    }
    if (h >= 2) return true;
    let newY = y + 1;
    while (newY < MAP_WIDTH) {
      if (!check(x, newY, posValue, compatible)) break;
      v += 1;
      newY += 1;
    }
    if (v >= 2) return true;

    return false;
  };

  let matched = true;
  while (matched) {
    matched = false;
    for (let i = 0; i < MAP_WIDTH; i += 1) {
      for (let j = 0; j < MAP_WIDTH; j += 1) {
        if (!checkMatched(j, i)) continue;

        matched = true;
        mapBase[i][j] = randomTile();
      }
    }
  }

  return mapBase;
};

const map = generateMap();

const check = (value: number, posValue: number, compatible: number[]) => value === posValue || compatible.includes(value);

const matchPosition = (x: number, y: number) => {
  type TileInfo = { x: number; y: number; point: number };
  let h: TileInfo[] = [];
  let v: TileInfo[] = [];
  let newX: number, newY: number;
  const posValue = map[y][x];
  const compatible = mapTileInfo[posValue].compatible;

  newX = x - 1;
  while (newX >= 0) {
    const value = map[y][newX];
    if (!check(value, posValue, compatible)) break;
    h.push({ x: newX, y, point: mapTileInfo[value].point });
    newX -= 1;
  }
  newX = x + 1;
  while (newX < MAP_WIDTH) {
    const value = map[y][newX];
    if (!check(value, posValue, compatible)) break;
    h.push({ x: newX, y, point: mapTileInfo[value].point });
    newX += 1;
  }
  newY = y - 1;
  while (newY >= 0) {
    const value = map[newY][x];
    if (!check(value, posValue, compatible)) break;
    v.push({ x, y: newY, point: mapTileInfo[value].point });
    newY -= 1;
  }
  newY = y + 1;
  while (newY < MAP_WIDTH) {
    const value = map[newY][x];
    if (!check(value, posValue, compatible)) break;
    v.push({ x, y: newY, point: mapTileInfo[value].point });
    newY += 1;
  }

  let hasH = true;
  let hasV = true;

  if (h.length < 2) {
    h = [];
    hasH = false;
  }
  if (v.length < 2) {
    v = [];
    hasV = false;
  }

  const matched = hasH || hasV;
  const tiles = matched ? [...h, ...v, { x, y, point: mapTileInfo[map[y][x]].point }] : [];

  return {
    matched,
    tiles,
    point: tiles.reduce((a, b) => a + b.point, 0) + (h.length >= GAIN_TURN ? MATCH_4_POINT : 0) + (v.length >= GAIN_TURN ? MATCH_4_POINT : 0),
    turn: Number(h.length >= GAIN_TURN) + Number(v.length >= GAIN_TURN),
  };
};

const swap = (x0: number, y0: number, x1: number, y1: number) => {
  const tmp = map[y0][x0];
  map[y0][x0] = map[y1][x1];
  map[y1][x1] = tmp;
};

const findAllMatchedPositions = () => {
  const allMatchedPositions: { x0: number; y0: number; x1: number; y1: number; point: number }[] = [];
  for (let i = 0; i < MAP_WIDTH - 1; i += 1) {
    for (let j = 0; j < MAP_WIDTH - 1; j += 1) {
      swap(j, i, j + 1, i);
      const { matched: m0, point: p0 } = matchPosition(j, i);
      const { matched: m1, point: p1 } = matchPosition(j + 1, i);
      if (m0 || m1) allMatchedPositions.push({ x0: j, y0: i, x1: j + 1, y1: i, point: p0 + p1 });
      swap(j, i, j + 1, i);

      swap(j, i, j, i + 1);
      const { matched: m2, point: p2 } = matchPosition(j, i);
      const { matched: m3, point: p3 } = matchPosition(j, i + 1);
      if (m2 || m3) allMatchedPositions.push({ x0: j, y0: i, x1: j, y1: i + 1, point: p2 + p3 });
      swap(j, i, j, i + 1);
    }
  }
  allMatchedPositions.sort((a, b) => (a.point < b.point ? 1 : -1));
  console.log(allMatchedPositions);
  return allMatchedPositions;
};

let best = { x0: -1, y0: -1, x1: -1, y1: -1, point: 0 };

const init = async () => {
  context.imageSmoothingEnabled = false;

  const loadImage = (key: number, src: string) => {
    const image = new Image();
    mapTileInfo[key].texture = image;
    image.src = getImageSrc(`tiles/${src}`);
    return new Promise((res) => (image.onload = () => res(image)));
  };

  await Promise.all(getKeys(TILES).map((tile, index) => loadImage(index, tile.toLowerCase())));

  best = findAllMatchedPositions()[0];
};

const render = () => {
  for (let i = 0; i < MAP_WIDTH; i += 1) {
    for (let j = 0; j < MAP_WIDTH; j += 1) {
      context.fillStyle = (i + j) % 2 ? "#554933" : "#3e3226";
      const x = j * CELL_SIZE;
      const y = i * CELL_SIZE;
      context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      context.drawImage(mapTileInfo[map[i][j]].texture, x + TILE_OFFSET, y + TILE_OFFSET, TILE_SIZE, TILE_SIZE);
    }
  }

  context.lineWidth = 5;
  context.strokeStyle = "cyan";

  context.strokeRect(best.x0 * CELL_SIZE, best.y0 * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  context.strokeRect(best.x1 * CELL_SIZE, best.y1 * CELL_SIZE, CELL_SIZE, CELL_SIZE);

  // findAll().forEach(({ x, y }) => {
  //   context.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  // });
};

const main = async () => {
  await init();

  render();
};

main();
