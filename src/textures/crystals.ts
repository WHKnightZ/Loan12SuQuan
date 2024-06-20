import { TILES, getKeys } from "@/configs/consts";
import { flipHorizontal, resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

export const crystalTextures: HTMLImageElement[][] = [];
export const swordCrystalTextures: HTMLImageElement[][] = [];
export let damageTextures: HTMLImageElement[] = [];

export const loadCrystals = async () => {
  const crystalSize = 34;
  let texture = await loadTexture("common/crystals");
  texture = await resize(texture, 2.62);

  await Promise.all(
    getKeys(TILES).map(async (key, index) => {
      const tile = TILES[key];

      const crystals = await Promise.all(
        Array.from({ length: 6 }).map(
          (_, index2) =>
            new Promise<HTMLImageElement>((res) => {
              const canvas = document.createElement("canvas");
              canvas.width = crystalSize;
              canvas.height = crystalSize;
              const context = canvas.getContext("2d") as CanvasRenderingContext2D;
              context.imageSmoothingEnabled = false;
              context.drawImage(
                texture,
                crystalSize * index2,
                crystalSize * index,
                crystalSize,
                crystalSize,
                0,
                0,
                crystalSize,
                crystalSize
              );
              const image = new Image();
              image.src = canvas.toDataURL();
              image.onload = () => res(image);
            })
        )
      );

      crystalTextures[tile] = crystals;
    })
  );

  swordCrystalTextures[0] = crystalTextures[TILES.SWORDRED];
  swordCrystalTextures[1] = await Promise.all(swordCrystalTextures[0].map((i) => flipHorizontal(i)));

  texture = await loadTexture("common/damage");
  texture = await resize(texture, 2);

  const dmgWidth = 120;
  const dmgHeight = 66;

  damageTextures = await Promise.all(
    Array.from({ length: 5 }).map(
      (_, index) =>
        new Promise<HTMLImageElement>((res) => {
          const canvas = document.createElement("canvas");
          canvas.width = dmgWidth;
          canvas.height = dmgHeight;
          const context = canvas.getContext("2d") as CanvasRenderingContext2D;
          context.imageSmoothingEnabled = false;
          context.drawImage(texture, dmgWidth * index, 0, dmgWidth, dmgHeight, 0, 0, dmgWidth, dmgHeight);
          const image = new Image();
          image.src = canvas.toDataURL();
          image.onload = () => res(image);
        })
    )
  );
};
