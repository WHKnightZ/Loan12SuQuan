import { loadTexture } from "@/utils/common";

export let backgroundTextures = {} as { menu: HTMLImageElement };

export const loadBackgroundTextures = async () => {
  backgroundTextures.menu = await loadTexture("backgrounds/menu");
};
