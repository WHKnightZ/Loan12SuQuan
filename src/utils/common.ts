import { base, COUNT_TILES, mapTileInfo, MAP_WIDTH, MAP_WIDTH_1, TILES, BASE_MAP } from "@/configs/consts";
import { IPoint, ITileInfo } from "@/types";
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

export const waitLoadImage = (img: HTMLImageElement) => {
  return new Promise<HTMLImageElement>((res) => {
    img.onload = () => res(img);
  });
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
      explodeList.push({ x: newX, y: newY, score: 0, value: base.map[newY][newX] });
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

export const curveThroughPoints = () => {
  const context = base.context;

  context.beginPath();

  let p0: IPoint;
  let p1: IPoint;
  let p2: IPoint;
  let p3: IPoint;
  let i6 = 1 / 6;

  // context.lineJoin = "round";

  for (let i = 2, n = BASE_MAP.length; i <= n; i += 1) {
    p0 = BASE_MAP[i - 3 + (i === 2 ? 1 : 0)];
    p1 = BASE_MAP[i - 2];
    p2 = BASE_MAP[i - 1];
    p3 = BASE_MAP[i + (i === n ? -1 : 0)];

    if (i === 2) {
      context.moveTo(p1.x, p1.y);
    }

    context.bezierCurveTo(
      p2.x * i6 + p1.x - p0.x * i6,
      p2.y * i6 + p1.y - p0.y * i6,
      p3.x * -i6 + p2.x + p1.x * i6,
      p3.y * -i6 + p2.y + p1.y * i6,
      p2.x,
      p2.y
    );
  }

  context.lineWidth = 3;
  context.strokeStyle = "#566783";
  context.stroke();
};

export const curveThroughPoints2 = () => {
  const context = base.context;

  // options or defaults
  const tension = 0.5;
  const numOfSeg = 5;

  const points = BASE_MAP.reduce((a, b) => [...a, b.x, b.y], []);

  var i = 1,
    l = points.length,
    rPos = 0,
    rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0),
    res = new Float32Array(rLen),
    cache = new Float32Array((numOfSeg + 2) * 4),
    cachePtr = 4;

  const pts = points.slice(0);

  pts.unshift(points[1]); // copy 1. point and insert at beginning
  pts.unshift(points[0]);
  pts.push(points[l - 2], points[l - 1]); // duplicate end-points

  // cache inner-loop calculations as they are based on t alone
  cache[0] = 1; // 1,0,0,0

  for (; i < numOfSeg; i++) {
    var st = i / numOfSeg,
      st2 = st * st,
      st3 = st2 * st,
      st23 = st3 * 2,
      st32 = st2 * 3;

    cache[cachePtr++] = st23 - st32 + 1; // c1
    cache[cachePtr++] = st32 - st23; // c2
    cache[cachePtr++] = st3 - 2 * st2 + st; // c3
    cache[cachePtr++] = st3 - st2; // c4
  }

  cache[++cachePtr] = 1; // 0,1,0,0

  const parse = (pts, cache, l) => {
    for (var i = 2, t; i < l; i += 2) {
      var pt1 = pts[i],
        pt2 = pts[i + 1],
        pt3 = pts[i + 2],
        pt4 = pts[i + 3],
        t1x = (pt3 - pts[i - 2]) * tension,
        t1y = (pt4 - pts[i - 1]) * tension,
        t2x = (pts[i + 4] - pt1) * tension,
        t2y = (pts[i + 5] - pt2) * tension;

      for (t = 0; t < numOfSeg; t++) {
        var c = t << 2, //t * 4;
          c1 = cache[c],
          c2 = cache[c + 1],
          c3 = cache[c + 2],
          c4 = cache[c + 3];

        res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
        res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
      }
    }
  };

  // calc. points
  parse(pts, cache, l);

  // add last point
  l = points.length - 2;
  res[rPos++] = points[l];
  res[rPos] = points[l + 1];

  context.beginPath();
  context.moveTo(pts[0], pts[1]);

  // add lines to path
  for (i = 0, l = res.length; i < l; i += 2) base.context.lineTo(res[i], res[i + 1]);

  context.strokeStyle = "#000";
  context.lineWidth = 3;
  context.stroke();
};
