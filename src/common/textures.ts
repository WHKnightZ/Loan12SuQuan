import { CELL_SIZE, mapTileInfo, SCALE_RATIO, TILES, TILE_LENGTH } from "@/configs/consts";
import { Direction, HintArrow } from "@/types";
import { flipHorizontal, flipVertical, resize, rotateCW90 } from "@/utils/canvas";
import { getImageSrc, getKeys } from "@/utils/common";

const loadTexture = (src: string) => {
  const image = new Image();
  image.src = getImageSrc(src);
  return new Promise<HTMLImageElement>((res) => (image.onload = () => res(image)));
};

const loadTilesAndExplosions = async () => {
  const loadImage = (key: number, src: string) => {
    const image = new Image();
    image.src = getImageSrc(`tiles/${src}`);
    return new Promise(
      (res) =>
        (image.onload = async () => {
          const getCropImage = (pos: number) => {
            const width = Math.floor((image.width / TILE_LENGTH) * SCALE_RATIO);
            const height = Math.floor(image.height * SCALE_RATIO);
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d") as CanvasRenderingContext2D;
            context.imageSmoothingEnabled = false;

            const newPosition = (image.width / TILE_LENGTH) * pos;
            const newWidth = image.width / TILE_LENGTH;

            context.drawImage(image, newPosition, 0, newWidth, image.height, 0, 0, width, height);

            const image2 = new Image();
            image2.src = canvas.toDataURL("image/png");

            return new Promise<HTMLImageElement>((res) => (image2.onload = () => res(image2)));
          };

          mapTileInfo[key].texture = await getCropImage(0);
          mapTileInfo[key].explosions = [];
          for (let i = 0; i < 6; i += 1) {
            mapTileInfo[key].explosions[i] = await getCropImage(i + 1);
          }
          res(null);
        })
    );
  };

  await Promise.all(getKeys(TILES).map((tile) => loadImage(TILES[tile], tile.toLowerCase())));
};

export let cornerSelections: {
  texture: HTMLImageElement;
  position: { x: number; y: number };
  offset: { x: number; y: number };
}[] = [];

const loadCornerSelections = () => {
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

const loadCommonTextures = async () => {
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

const loadMenu = async () => {
  menuTexture = await loadTexture("common/menu");
  menuTexture = await resize(menuTexture, 2);
  const bars: BarType[] = ["life", "energy", "mana"];
  let res = await Promise.all(bars.map((bar) => loadTexture(`common/${bar}bar`)));
  res = await Promise.all(res.map((img) => resize(img, 2)));
  res.forEach((img, index) => {
    barTextures[bars[index]] = img;
  });
};

const COUNT_AVATARS = 2;

export const avatarTextures = Array.from({ length: COUNT_AVATARS }).map(() => [null, null]) as HTMLImageElement[][];

const loadAvatars = async () => {
  await Promise.all(
    avatarTextures.map(
      (_, index) =>
        new Promise((res) => {
          loadTexture(`avatars/${index}`)
            .then((img) => resize(img, 2))
            .then((img) => {
              avatarTextures[index][1] = img;
              res(null);
            });
        })
    )
  );

  return Promise.all(
    avatarTextures.map(
      (i) =>
        new Promise((res) => {
          flipHorizontal(i[1]).then((img) => {
            i[0] = img;
            res(null);
          });
        })
    )
  );
};

// All
export const loadTextures = () => {
  return Promise.all([
    loadTilesAndExplosions(),
    loadCornerSelections(),
    loadCommonTextures(),
    loadMenu(),
    loadAvatars(),
    //
  ]);
};
