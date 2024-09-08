import { loadTexture } from "@/utils/common";

export let winTextures: HTMLImageElement;
export let loseTextures: HTMLImageElement;

export const loadWinLoseTextures = async () => {
  const textures: HTMLImageElement[] = await Promise.all([loadTexture("common/win"), loadTexture("common/lose")]);
  winTextures = textures[0];
  loseTextures = textures[1];
};
