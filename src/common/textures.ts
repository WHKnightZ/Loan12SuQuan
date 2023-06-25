import { CELL_SIZE, EXPLOSION_KEYS, mapTileInfo, SCALE_RATIO, TILES, TILE_SIZE } from "@/configs/consts";
import { flipHorizontal, flipVertical } from "@/utils/canvas";
import { getImageSrc, getKeys } from "@/utils/common";

const loadTiles = () => {
  const loadTile = (key: number, src: string) => {
    const image = new Image();
    image.src = getImageSrc(`tiles/${src}`);
    return new Promise(
      (res) =>
        (image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = TILE_SIZE;
          canvas.height = TILE_SIZE;
          const context = canvas.getContext("2d") as CanvasRenderingContext2D;
          context.imageSmoothingEnabled = false;

          context.drawImage(image, 0, 0, TILE_SIZE, TILE_SIZE);

          const image2 = new Image();
          image2.src = canvas.toDataURL("image/png");
          image2.onload = () => {
            mapTileInfo[key].texture = image2;
            res(null);
          };
        })
    );
  };

  return Promise.all(getKeys(TILES).map((tile) => loadTile(TILES[tile], tile.toLowerCase())));
};

const loadExplosions = async () => {
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

// All
export const loadTextures = () => {
  return Promise.all([
    loadTiles(),
    loadExplosions(),
    loadCornerSelections(),
    //
  ]);
};
