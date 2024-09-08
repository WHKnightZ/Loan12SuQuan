import { getKeys } from "@/configs/consts";
import { IFontFamily } from "@/types";
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
    fontTextures[key] = await loadTexture(`fonts/${fonts[key]}`);
  });

  return Promise.all(promises);
};
