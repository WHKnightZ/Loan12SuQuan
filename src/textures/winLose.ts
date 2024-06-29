import { resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

export let winTextures: HTMLImageElement;
export let loseTextures: HTMLImageElement;

export const loadWinLoseTextures = async () => {
  let textures: HTMLImageElement[] = await Promise.all([loadTexture("common/win"), loadTexture("common/lose")]);
  textures = await Promise.all(textures.map((t) => resize(t, 2)));
  winTextures = textures[0];
  loseTextures = textures[1];
};
