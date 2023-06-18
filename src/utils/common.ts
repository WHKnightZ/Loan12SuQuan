import {
  APP_NAME,
  base,
  COUNT_TILES,
  EXPLOSION_KEYS,
  mapTileInfo,
  MAP_WIDTH,
  SCALE_RATIO,
  TILES,
} from "@/configs/consts";
import { TileInfo } from "@/types";

export const getAppName = () => APP_NAME;

export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

export const getImageSrc = (src: string, ext: "png" | "jpg" | "svg" = "png") => `/static/images/${src}.${ext}`;

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

export const initImages = async () => {
  base.context.imageSmoothingEnabled = false;

  const loadTile = (key: number, src: string) => {
    const image = new Image();
    mapTileInfo[key].texture = image;
    image.src = getImageSrc(`tiles/${src}`);
    return new Promise((res) => (image.onload = () => res(image)));
  };

  await Promise.all(getKeys(TILES).map((tile) => loadTile(TILES[tile], tile.toLowerCase())));

  const loadExplosion = (key: number, src: string) => {
    const image = new Image();
    image.src = getImageSrc(`explosions/${src}`);
    return new Promise(
      (res) =>
        (image.onload = () => {
          mapTileInfo[key].explosions = [];
          for (let i = 0; i < 4; i += 1) {
            const width = Math.floor((image.width / 4) * SCALE_RATIO);
            const height = Math.floor(image.height * SCALE_RATIO);
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d") as CanvasRenderingContext2D;
            context.imageSmoothingEnabled = false;

            context.drawImage(
              image,
              (image.width / 4) * i,
              0,
              Math.floor(image.width / 4),
              image.height,
              0,
              0,
              width,
              height
            );

            const image2 = new Image();
            image2.src = canvas.toDataURL("image/png");
            image2.onload = () => {
              mapTileInfo[key].explosions[i] = image2;
              res(null);
            };
          }
        })
    );
  };

  await Promise.all(EXPLOSION_KEYS.map((tile) => loadExplosion(TILES[tile], tile.toLowerCase())));

  mapTileInfo[TILES.SWORDRED].explosions = mapTileInfo[TILES.SWORD].explosions;
};

export const findBelow = (list: { x: number; y: number }[]) => list.reduce((a, b) => (a < b.y ? b.y : a), -1);

export const getKey = (x: number, y: number) => y * MAP_WIDTH + x;

export const combine = (arr: TileInfo[][]) => {
  const lst: TileInfo[] = [];
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
  return lst;
};
