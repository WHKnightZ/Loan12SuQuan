import { resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

export let powerAttackTextures: HTMLImageElement;

export const loadPowerAttackTextures = async () => {
  const textures: HTMLImageElement = await loadTexture("common/power-attack");
  powerAttackTextures = await resize(textures, 2);
};
