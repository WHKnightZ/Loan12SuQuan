import { CELL_SIZE, mapTileInfo, SCALE_RATIO, TILES, TILE_SIZE } from "@/configs/consts";
import { flipHorizontal, flipVertical } from "@/utils/canvas";
import { getImageSrc, getKeys } from "@/utils/common";

const loadTilesAndExplosions = async () => {
  const loadImage = (key: number, src: string) => {
    const image = new Image();
    image.src = getImageSrc(`tiles/${src}`);
    return new Promise(
      (res) =>
        (image.onload = async () => {
          const TILE_LENGTH = 7;
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

// All
export const loadTextures = () => {
  return Promise.all([
    loadTilesAndExplosions(),
    loadCornerSelections(),
    //
  ]);
};
