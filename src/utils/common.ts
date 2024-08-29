import { base, COUNT_TILES, mapTileInfo, MAP_WIDTH, MAP_WIDTH_1, TILES, ENEMIES } from "@/configs/consts";
import { IMapPointAvatar, IPoint, ITileInfo } from "@/types";
import { random } from "./math";
import { avatarTextures } from "@/textures";

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

export const curveThroughPoints = (points: IPoint[]) => {
  const context = base.context;

  context.beginPath();

  let p0 = points[0];

  if (!p0) return;

  let p1: IPoint;
  let p2: IPoint;
  let p3: IPoint;
  const i6 = 1 / 6;

  points.unshift(p0);
  points.push(points[points.length - 1]);

  context.moveTo(p0.x, p0.y);

  for (let i = 3, n = points.length; i < n; i += 1) {
    p0 = points[i - 3];
    p1 = points[i - 2];
    p2 = points[i - 1];
    p3 = points[i];

    context.bezierCurveTo(
      p2.x * i6 + p1.x - p0.x * i6,
      p2.y * i6 + p1.y - p0.y * i6,
      p3.x * -i6 + p2.x + p1.x * i6,
      p3.y * -i6 + p2.y + p1.y * i6,
      p2.x,
      p2.y
    );
  }

  context.lineWidth = 4;
  context.strokeStyle = "#f8ae49";
  context.stroke();
};

export const curveThroughPoints2 = (basePoints: IPoint[]) => {
  const context = base.context;

  const tension = 0.65;
  const numOfSeg = 8;

  const points = basePoints.reduce((a, b) => [...a, b.x, b.y], [basePoints[0].x, basePoints[0].y]);
  let l = points.length;
  points.push(points[l - 2], points[l - 1]);

  context.beginPath();
  context.moveTo(points[0], points[1]);

  let i = 1,
    rPos = 0,
    rLen = (l - 4) * numOfSeg + 2,
    res = new Float32Array(rLen),
    cache = new Float32Array((numOfSeg + 2) * 4),
    cachePtr = 4;

  // cache inner-loop calculations as they are based on t alone
  cache[0] = 1; // 1, 0, 0, 0

  for (let i = 1; i < numOfSeg; i++) {
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

  const parse = (points: number[], cache: Float32Array, l: number) => {
    for (let i = 2, t: number; i < l; i += 2) {
      var pt1 = points[i],
        pt2 = points[i + 1],
        pt3 = points[i + 2],
        pt4 = points[i + 3],
        t1x = (pt3 - points[i - 2]) * tension,
        t1y = (pt4 - points[i - 1]) * tension,
        t2x = (points[i + 4] - pt1) * tension,
        t2y = (points[i + 5] - pt2) * tension;

      for (t = 0; t < numOfSeg; t++) {
        var c = t << 2,
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
  parse(points, cache, l);

  // add last point
  l = points.length - 2;
  res[rPos++] = points[l];
  res[rPos] = points[l + 1];

  // add lines to path
  for (i = 0, l = res.length; i < l; i += 2) base.context.lineTo(res[i], res[i + 1]);

  context.lineWidth = 4;
  context.strokeStyle = "black";
  context.stroke();
};

export const curveThroughPoints3 = (points: IPoint[], numPoints = 10) => {
  const splinePoints = [];

  let p0 = points[0];
  let p1: IPoint;
  let p2: IPoint;
  let p3: IPoint;

  points = points.slice(0);
  points.unshift(p0);
  points.push(points[points.length - 1]);

  for (let i = 0; i < points.length - 3; i += 1) {
    p0 = points[i];
    p1 = points[i + 1];
    p2 = points[i + 2];
    p3 = points[i + 3];

    for (let t = 0; t < numPoints; t++) {
      const t0 = t / numPoints;
      const t1 = t0 * t0;
      const t2 = t1 * t0;

      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t0 +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t1 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t2);

      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t0 +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t1 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t2);

      splinePoints.push({ x, y });
    }
  }

  const context = base.context;

  context.beginPath();
  context.moveTo(points[1].x, points[1].y);

  splinePoints.forEach(({ x, y }) => {
    context.lineTo(x, y);
  });

  context.lineWidth = 4;
  context.strokeStyle = "black";
  context.stroke();
};

export const drawPoints = (points: IMapPointAvatar[]) => {
  const context = base.context;

  points.forEach(({ x, y, avatar, hidden }) => {
    if (hidden) return;

    context.save();
    context.beginPath();
    context.arc(x, y, 22, 0, Math.PI * 2, true);

    context.strokeStyle = "#00a88e";
    context.lineWidth = 6;
    context.stroke();

    context.strokeStyle = "#1562af";
    context.lineWidth = 2;
    context.stroke();

    context.clip();
    context.closePath();
    context.drawImage(avatarTextures[ENEMIES[avatar].id], x - 22, y - 22, 44, 44);
    context.restore();
  });
};
