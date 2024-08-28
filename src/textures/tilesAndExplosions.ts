import { SCALE_RATIO, TILES, getKeys, mapTileInfo } from "@/configs/consts";
import { crop } from "@/utils/canvas";
import { getImageSrc } from "@/utils/common";

const TILE_LENGTH = 7;

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
            const newPosition = (image.width / TILE_LENGTH) * pos;
            const newWidth = image.width / TILE_LENGTH;

            return crop(image, newPosition, 0, newWidth, image.height, 0, 0, width, height);
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
