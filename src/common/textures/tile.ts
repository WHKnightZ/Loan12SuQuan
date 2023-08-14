import { TILES, mapTileInfo } from "@/configs/consts";
import { getImageSrc, getKeys } from "@/utils/common";
import { getCropImage } from "@/utils/image";

export const loadTilesAndExplosions = async () => {
  const loadImage = async (key: number, src: string) => {
    const image = new Image();
    image.src = getImageSrc(`tiles/${src}`);
    return new Promise(
      (res) =>
        (image.onload = async () => {
          mapTileInfo[key].texture = await getCropImage(image, 0);
          mapTileInfo[key].explosions = [];
          for (let i = 0; i < 6; i += 1) {
            mapTileInfo[key].explosions[i] = await getCropImage(image, i + 1);
          }
          res(null);
        })
    );
  };
  await Promise.all(getKeys(TILES).map((tile) => loadImage(TILES[tile], tile.toLowerCase())));
};
