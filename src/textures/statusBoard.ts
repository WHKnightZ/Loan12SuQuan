import { resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

export let statusBoardTexture: HTMLImageElement = null as any;

type BarType = "life" | "energy" | "mana";

export const barTextures: { [key in BarType]: HTMLImageElement } = {} as any;

export const loadStatusBoardTexture = async () => {
  statusBoardTexture = await loadTexture("common/status-board").then((img) => resize(img, 2));

  const bars: BarType[] = ["life", "energy", "mana"];
  const res = await Promise.all(bars.map((bar) => loadTexture(`common/${bar}bar`).then((img) => resize(img, 2))));

  res.forEach((img, index) => {
    barTextures[bars[index]] = img;
  });
};
