import { getImageSrc, getKeys } from "./utils/common";

const MAP_WIDTH = 8;
const MAP_WIDTH_1 = MAP_WIDTH - 1;
const CELL_SIZE = 60;
const SCREEN_SIZE = MAP_WIDTH * CELL_SIZE;
const TILE_SIZE = 54;
const TILE_OFFSET = Math.floor((CELL_SIZE - TILE_SIZE) / 2);
const GAIN_TURN = 3; // 4
const MATCH_4_POINT = 50;
const SWAP_DURATION = 10;
const SWAP_OFFSET = CELL_SIZE / SWAP_DURATION;

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

type AllMatchedPositions = { x0: number; y0: number; x1: number; y1: number; point: number }[];

const addMatchedPosition = (allMatchedPositions: AllMatchedPositions, x0: number, y0: number, x1: number, y1: number) => {
  swap(x0, y0, x1, y1);
  const { matched: m0, point: p0 } = matchPosition(x0, y0);
  const { matched: m1, point: p1 } = matchPosition(x1, y1);
  if (m0 || m1) allMatchedPositions.push({ x0, y0, x1, y1, point: p0 + p1 });
  swap(x0, y0, x1, y1);
};

const findAllMatchedPositions = () => {
  const allMatchedPositions: AllMatchedPositions = [];
  for (let i = 0; i < MAP_WIDTH_1; i += 1) {
    for (let j = 0; j < MAP_WIDTH_1; j += 1) {
      addMatchedPosition(allMatchedPositions, j, i, j + 1, i);
      addMatchedPosition(allMatchedPositions, j, i, j, i + 1);
    }
  }
  for (let i = 0; i < MAP_WIDTH_1; i += 1) addMatchedPosition(allMatchedPositions, MAP_WIDTH_1, i, MAP_WIDTH_1, i + 1);
  for (let j = 0; j < MAP_WIDTH_1; j += 1) addMatchedPosition(allMatchedPositions, j, MAP_WIDTH_1, j + 1, MAP_WIDTH_1);

  allMatchedPositions.sort((a, b) => (a.point < b.point ? 1 : -1));
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

  // best = findAllMatchedPositions()[0];
};

class Game {
  state: "IDLE" | "SELECT" | "FALL";

  constructor() {}
}

let selected: { x: number; y: number } | null = null;
let swapped: { x: number; y: number } | null = null;
let tSwap = 0;
let reswap = false;

let fall: {
  [key: number]: {
    list: { x: number; y: number; offset: number; v: number; value: number }[];
    below: number;
  };
} = {};

const render = () => {
  for (let i = 0; i < MAP_WIDTH; i += 1) {
    for (let j = 0; j < MAP_WIDTH; j += 1) {
      context.fillStyle = (i + j) % 2 ? "#554933" : "#3e3226";
      const x = j * CELL_SIZE;
      const y = i * CELL_SIZE;
      context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      if (map[i][j] === -1 || (swapped && ((swapped.x === j && swapped.y === i) || (selected.x === j && selected.y === i)))) continue;

      context.drawImage(mapTileInfo[map[i][j]].texture, x + TILE_OFFSET, y + TILE_OFFSET, TILE_SIZE, TILE_SIZE);
    }
  }

  // context.lineWidth = 4;
  // context.strokeStyle = "cyan";

  // context.strokeRect(best.x0 * CELL_SIZE + 2, best.y0 * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
  // context.strokeRect(best.x1 * CELL_SIZE + 2, best.y1 * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

  if (selected) {
    if (!swapped) {
      context.lineWidth = 4;
      context.strokeStyle = "cyan";
      context.strokeRect(selected.x * CELL_SIZE + 2, selected.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
    } else {
      let done = false;
      tSwap += 1;
      if (tSwap > SWAP_DURATION) {
        tSwap = SWAP_DURATION;
        done = true;
      }

      const offset = tSwap * SWAP_OFFSET;

      const { x: x0, y: y0 } = selected;
      const { x: x1, y: y1 } = swapped;

      context.drawImage(
        mapTileInfo[map[y1][x1]].texture,
        x1 * CELL_SIZE + TILE_OFFSET + (x0 - x1) * offset,
        y1 * CELL_SIZE + TILE_OFFSET + (y0 - y1) * offset,
        TILE_SIZE,
        TILE_SIZE
      );
      context.drawImage(
        mapTileInfo[map[y0][x0]].texture,
        x0 * CELL_SIZE + TILE_OFFSET + (x1 - x0) * offset,
        y0 * CELL_SIZE + TILE_OFFSET + (y1 - y0) * offset,
        TILE_SIZE,
        TILE_SIZE
      );

      if (done) {
        swap(x0, y0, x1, y1);

        if (reswap) {
          reswap = false;
          selected = swapped = null;
        } else {
          const { matched: m0, tiles: t0 } = matchPosition(x0, y0);
          const { matched: m1, tiles: t1 } = matchPosition(x1, y1);
          if (m0 || m1) {
            selected = swapped = null;
            const t = [...t0, ...t1];
            fall = {};
            t.forEach(({ x, y }) => {
              map[y][x] = -1;
              if (fall[x]) {
                !fall[x].list.find(({ x: x0, y: y0 }) => x0 === x && y0 === y) && fall[x].list.push({ x, y, v: 0, offset: 0, value: -1 });
              } else fall[x] = { list: [{ x, y, v: 0, offset: 0, value: -1 }], below: -1 };
            });
            const findBelow = (list: { x: number; y: number; offset: number; v: number }[]) => list.reduce((a, b) => (a < b.y ? b.y : a), -1);
            getKeys(fall).forEach((key) => {
              fall[key].below = findBelow(fall[key].list);
              const needAdd = fall[key].list.length;
              fall[key].list = [];
              key = Number(key);
              for (let i = fall[key].below; i >= 0; i -= 1) {
                if (map[i][key] !== -1) {
                  fall[key].list.push({ x: key, y: i, v: 0, offset: 0, value: map[i][key] });
                  map[i][key] = -1;
                }
              }
              for (let i = 0; i < needAdd; i += 1) {
                fall[key].list.push({ x: key, y: -1 - i, v: 0, offset: 0, value: randomTile() });
              }
            });
            console.log(fall);
          } else {
            reswap = true;
            tSwap = 0;
          }
        }
      }
    }
  }
};

const update = () => {
  render();
  requestAnimationFrame(update);
};

const main = async () => {
  await init();

  document.addEventListener("click", (e) => {
    const x = Math.floor(e.offsetX / CELL_SIZE);
    const y = Math.floor(e.offsetY / CELL_SIZE);
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_WIDTH) return;

    if (!selected) {
      selected = { x, y };
      return;
    }

    if (Math.abs(x - selected.x) + Math.abs(y - selected.y) !== 1) {
      selected = null;
      return;
    }

    swapped = { x, y };

    tSwap = 0;
  });

  update();
};

main();
