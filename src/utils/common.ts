import { base, COUNT_TILES, mapTileInfo, MAP_WIDTH, MAP_WIDTH_1, TILES } from "@/configs/consts";
import { ITileInfo } from "@/types";
import { random } from "./math";

export const pause = (duration: number) => {
  return new Promise((res) => setTimeout(() => res(null), duration));
};

export const getImageSrc = (src: string, ext: "png" | "jpg" | "svg" = "png") => `/static/images/${src}.${ext}`;

export const loadTexture = (src: string) => {
  const image = new Image();
  image.src = getImageSrc(src);
  return new Promise<HTMLImageElement>((res) => (image.onload = () => res(image)));
};

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

export const generateMap = () => {
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

export const check = (value: number, posValue: number, compatible: number[]) =>
  value === posValue || compatible.includes(value);

export const findBelow = (list: { x: number; y: number }[]) => list.reduce((a, b) => (a < b.y ? b.y : a), -1);

export const getKey = (x: number, y: number) => y * MAP_WIDTH + x;

const aroundTiles = [
  { x: 0, y: -1, condition: (_: number, y: number) => y >= 1 },
  { x: 1, y: -1, condition: (x: number, y: number) => x < MAP_WIDTH_1 && y >= 1 },
  { x: 1, y: 0, condition: (x: number, _: number) => x < MAP_WIDTH_1 },
  { x: 1, y: 1, condition: (x: number, y: number) => x < MAP_WIDTH_1 && y < MAP_WIDTH_1 },
  { x: 0, y: 1, condition: (_: number, y: number) => y < MAP_WIDTH_1 },
  { x: -1, y: 1, condition: (x: number, y: number) => x >= 1 && y < MAP_WIDTH_1 },
  { x: -1, y: 0, condition: (x: number, _: number) => x >= 1 },
  { x: -1, y: -1, condition: (x: number, y: number) => x >= 1 && y >= 1 },
];

export const combine = (arr: ITileInfo[][]) => {
  const lst: ITileInfo[] = [];
  const has: { [key: number]: boolean } = {};
  arr.forEach((tiles) => {
    tiles.forEach((tile) => {
      const { x, y } = tile;
      const key = getKey(x, y);
      if (has[key]) return;

      has[key] = true;
      lst.push(tile);
    });
  });

  // Xử lý kiếm đỏ: Nổ 1 vùng xung quanh
  const explodeList: ITileInfo[] = [];

  lst.forEach(({ x, y, value }) => {
    if (value !== TILES.SWORDRED) return;

    aroundTiles.forEach(({ x: _x, y: _y, condition }) => {
      if (!condition(x, y)) return;

      const newX = x + _x;
      const newY = y + _y;
      const key = getKey(newX, newY);
      if (has[key]) return;
      has[key] = true;
      explodeList.push({ x: newX, y: newY, point: 0, value: base.map[newY][newX] });
    });
  });

  lst.push(...explodeList);

  return lst;
};

export const isNumber = (value: any): value is number => {
  return typeof value === "number";
};

export const isString = (value: any): value is string => {
  const type = typeof value;

  return (
    type === "string" ||
    (type === "object" &&
      value != null &&
      !Array.isArray(value) &&
      Object.prototype.toString.call(value) === "[object String]")
  );
};

export const isFunction = (value: any): value is Function => {
  return typeof value === "function";
};
