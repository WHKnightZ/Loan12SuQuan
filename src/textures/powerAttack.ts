import { loadTexture } from "@/utils/common";

export let powerAttackTextures: HTMLImageElement;

export const loadPowerAttackTextures = async () => {
  powerAttackTextures = await loadTexture("common/power-attack");
};
