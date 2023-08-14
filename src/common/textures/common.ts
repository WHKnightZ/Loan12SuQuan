import { CELL_SIZE } from "@/configs/consts";
import { Direction, FontChar, HintArrow } from "@/types";
import { flipHorizontal, flipVertical, resize, rotateCW90 } from "@/utils/canvas";
import { getImageSrc } from "@/utils/common";
import { loadTexture } from "@/utils/image";

export let cornerSelections: {
  texture: HTMLImageElement;
  position: { x: number; y: number };
  offset: { x: number; y: number };
}[] = [];

export const loadCornerSelections = () => {
  cornerSelections = [];

  let cornerTopLeft = new Image();
  cornerTopLeft.src = getImageSrc("selection/corner");

  return new Promise((res) => {
    cornerTopLeft.onload = async () => {
      const cornerTopRight = await flipHorizontal(cornerTopLeft);
      const cornerBottomLeft = await flipVertical(cornerTopLeft);
      const cornerBottomRight = await flipVertical(cornerTopRight);

      const size = cornerTopLeft.width;

      const right = CELL_SIZE - size;

      cornerSelections.push({ texture: cornerTopLeft, position: { x: 0, y: 0 }, offset: { x: 1, y: 1 } });
      cornerSelections.push({ texture: cornerTopRight, position: { x: right, y: 0 }, offset: { x: -1, y: 1 } });
      cornerSelections.push({ texture: cornerBottomLeft, position: { x: 0, y: right }, offset: { x: 1, y: -1 } });
      cornerSelections.push({ texture: cornerBottomRight, position: { x: right, y: right }, offset: { x: -1, y: -1 } });

      res(null);
    };
  });
};

export let hintArrows: {
  [key in Direction]: HintArrow;
} = {} as any;

export const loadCommonTextures = async () => {
  let image = new Image();
  image.src = getImageSrc("common/hint-arrow");

  await new Promise(
    (res) =>
      (image.onload = async () => {
        image = await resize(image, 2);
        res(null);
      })
  );
  hintArrows.UP = {
    offset: { x: (CELL_SIZE - image.width) / 2, y: -6 },
    texture: image,
    drt: { x: 0, y: -1 },
  };
  image = await rotateCW90(image);
  hintArrows.RIGHT = {
    offset: { x: CELL_SIZE - image.width + 6, y: (CELL_SIZE - image.height) / 2 },
    texture: image,
    drt: { x: 1, y: 0 },
  };
  image = await rotateCW90(image);
  hintArrows.DOWN = {
    offset: { x: (CELL_SIZE - image.width) / 2, y: CELL_SIZE - image.height + 6 },
    texture: image,
    drt: { x: 0, y: 1 },
  };
  image = await rotateCW90(image);
  hintArrows.LEFT = {
    offset: { x: -6, y: (CELL_SIZE - image.height) / 2 },
    texture: image,
    drt: { x: -1, y: 0 },
  };
};

export let menuTexture: HTMLImageElement = null as any;

type BarType = "life" | "energy" | "mana";

export const barTextures: { [key in BarType]: HTMLImageElement } = {} as any;

export const loadMenu = async () => {
  menuTexture = await loadTexture("common/menu");
  menuTexture = await resize(menuTexture, 2);
  const bars: BarType[] = ["life", "energy", "mana"];
  let res = await Promise.all(bars.map((bar) => loadTexture(`common/${bar}bar`)));
  res = await Promise.all(res.map((img) => resize(img, 2)));
  res.forEach((img, index) => {
    barTextures[bars[index]] = img;
  });
};
export const mapFontChar: { [key: string]: FontChar } = {};

export const loadFont = async () => {
  const fontTexture = await loadTexture("fonts/fontcap");

  const chars =
    ' 0123456789.,:!?()+-*/#$%"@<=>;_&ABCD\u0110EFGHIJKLMNOPQRSTUVWXYZ\u00c1\u00c0\u1ea2\u00c3\u1ea0\u0102\u1eae\u1eb0\u1eb2\u1eb4\u1eb6\u00c2\u1ea4\u1ea6\u1ea8\u1eaa\u1eac\u00c9\u00c8\u1eba\u1ebc\u1eb8\u00ca\u1ebe\u1ec0\u1ec2\u1ec4\u1ec6\u00cd\u00cc\u1ec8\u0128\u1eca\u00d3\u00d2\u1ece\u00d5\u1ecc\u00d4\u1ed0\u1ed2\u1ed4\u1ed6\u1ed8\u01a0\u1eda\u1edc\u1ede\u1ee0\u1ee2\u00da\u00d9\u1ee6\u0168\u1ee4\u01af\u1ee8\u1eea\u1eec\u1eee\u1ef0\u00dd\u1ef2\u1ef6\u1ef8\u1ef4';

  const xList = [
    0, 2, 10, 16, 24, 32, 40, 48, 56, 64, 72, 80, 84, 88, 92, 80, 0, 6, 12, 87, 19, 26, 32, 41, 49, 62, 67, 92, 78, 12,
    96, 86, 32, 49, 58, 66, 74, 83, 41, 92, 0, 20, 8, 14, 29, 48, 55, 65, 37, 73, 81, 90, 0, 20, 7, 28, 46, 57, 65, 36,
    90, 15, 73, 0, 24, 43, 52, 61, 33, 82, 91, 9, 70, 0, 18, 42, 51, 60, 28, 35, 79, 9, 67, 86, 93, 0, 16, 42, 60, 23,
    29, 35, 49, 74, 83, 0, 9, 49, 58, 18, 27, 36, 67, 76, 85, 0, 46, 11, 22, 33, 92, 57, 85, 65, 73, 0, 44, 33, 54, 10,
    20, 81, 89, 64, 72, 0,
  ];
  const yList = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 9, 9, 9, 7, 9, 9, 9, 9, 9, 9, 9, 9, 15, 16, 0, 17, 18, 18, 18, 19,
    20, 20, 20, 20, 21, 21, 24, 24, 27, 27, 27, 28, 29, 29, 29, 29, 30, 30, 33, 36, 36, 36, 37, 38, 38, 39, 40, 42, 45,
    45, 45, 46, 47, 50, 50, 51, 52, 54, 56, 57, 57, 58, 59, 59, 62, 63, 64, 64, 64, 66, 68, 69, 70, 71, 71, 71, 71, 74,
    76, 78, 80, 82, 82, 83, 83, 83, 86, 88, 88, 92, 93, 95, 95, 95, 76, 94, 97, 98, 102, 104, 105, 106, 106, 107, 107,
    109, 109, 110, 113, 114,
  ];
  const widthList = [
    2, 8, 6, 8, 8, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 7, 6, 6, 7, 5, 7, 6, 9, 8, 13, 5, 11, 8, 8, 8, 4, 8, 9, 9, 8, 8, 9, 9,
    7, 7, 8, 9, 6, 6, 8, 7, 10, 8, 9, 8, 9, 8, 7, 8, 8, 8, 11, 8, 8, 7, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 9,
    9, 7, 7, 7, 7, 7, 7, 7, 7, 9, 7, 7, 6, 6, 6, 6, 6, 9, 9, 9, 9, 9, 9, 9, 9, 10, 9, 9, 11, 11, 11, 11, 11, 11, 8, 8,
    8, 8, 8, 10, 10, 10, 10, 10, 10, 8, 8, 8, 8, 8,
  ];
  const heightList = [
    1, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 4, 6, 7, 9, 9, 12, 12, 7, 3, 7, 12, 9, 11, 9, 5, 10, 8, 5, 8, 9, 3, 9, 9, 9, 9, 9,
    9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 11, 9, 9, 9, 9, 9, 9, 9, 9, 9, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12, 14,
    12, 12, 12, 12, 12, 14, 12, 12, 12, 12, 11, 12, 12, 12, 12, 12, 14, 12, 12, 12, 12, 11, 12, 12, 12, 12, 11, 12, 12,
    12, 12, 12, 14, 9, 12, 12, 12, 12, 11, 12, 12, 12, 12, 11, 10, 12, 12, 12, 12, 12, 12, 12, 12, 12, 11,
  ];
  const offsetList = [
    11, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 8, 5, 3, 3, 2, 2, 4, 6, 2, 2, 3, 2, 3, 2, 3, 4, 5, 4, 5, 11, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 2,
    0, 0, 0, 0, 2, 0, 0, 0, 0, 3,
  ];

  const promises: Promise<null>[] = [];

  for (let i = 0; i < chars.length; i += 1) {
    const c = chars.charAt(i);
    const width = Math.floor(widthList[i] * 2);
    const height = Math.floor(heightList[i] * 2);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.imageSmoothingEnabled = false;

    context.drawImage(fontTexture, xList[i], yList[i], widthList[i], heightList[i], 0, 0, width, height);

    const image = new Image();
    image.src = canvas.toDataURL("image/png");

    promises.push(
      new Promise(
        (res) =>
          (image.onload = () => {
            mapFontChar[c] = {
              texture: image,
              offsetY: Math.floor(offsetList[i] * 2),
            };
            res(null);
          })
      )
    );
  }

  return Promise.all(promises);
};
