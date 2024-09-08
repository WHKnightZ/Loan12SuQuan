import { loadTexture } from "@/utils/common";

export let statusBoardTexture: HTMLImageElement = null as any;

type BarType = "life" | "energy" | "mana";

export const barTextures: { [key in BarType]: HTMLImageElement } = {} as any;

export const loadStatusBoard = async () => {
  statusBoardTexture = await loadTexture("common/status-board");

  const bars: BarType[] = ["life", "energy", "mana"];
  const res = await Promise.all(bars.map((bar) => loadTexture(`common/${bar}bar`)));

  res.forEach((img, index) => {
    barTextures[bars[index]] = img;
  });
};
