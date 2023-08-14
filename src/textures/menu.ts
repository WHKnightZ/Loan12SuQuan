import { resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

export let menuTexture: HTMLImageElement = null as any;

type BarType = "life" | "energy" | "mana";

export const barTextures: { [key in BarType]: HTMLImageElement } = {} as any;

export const loadMenu = async () => {
  menuTexture = await loadTexture("common/menu");
  menuTexture = await resize(menuTexture, 2);
  const bars: BarType[] = ["life", "energy", "mana"];
  let res = await Promise.all(bars.map((bar) => loadTexture(`common/${bar}bar`)));
  res = await Promise.all(res.map((img) => resize(img, 2)));
  res.forEach((img, index) => {
    barTextures[bars[index]] = img;
  });
};
