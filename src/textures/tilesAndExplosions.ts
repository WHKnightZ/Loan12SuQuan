import { SCALE_RATIO, TILES, TILE_LENGTH, mapTileInfo } from "@/configs/consts";
import { getImageSrc, getKeys } from "@/utils/common";

export const loadTilesAndExplosions = async () => {
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
