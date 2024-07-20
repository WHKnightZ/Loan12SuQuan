import { FONT_SCALE, getKeys } from "@/configs/consts";
import { IFontFamily } from "@/types";
import { resize } from "@/utils/canvas";
import { loadTexture } from "@/utils/common";

export const fontTextures: { [key in IFontFamily]: HTMLImageElement } = {} as any;

const fonts: { [key in IFontFamily]: string } = {
  CAP_WHITE: "cap-white",
  CAP_YELLOW: "cap-yellow",
  ARIAL: "arial",
  BLACK: "black",
  VERDANA: "verdana",
};

export const loadFonts = async () => {
  const promises = getKeys(fonts).map(async (key) => {
    const img = await loadTexture(`fonts/${fonts[key]}`);
    fontTextures[key] = await resize(img, FONT_SCALE);
  });

  return Promise.all(promises);
};
