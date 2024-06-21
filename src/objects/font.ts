import { base, BOARD_SIZE, SCREEN_WIDTH } from "@/configs/consts";
import { mapFontChar } from "@/textures";
import { IFontChar } from "@/types";

const OFFSET_CHAR = 2;

export class Font {
  constructor() {}

  draw({ text, x, y }: { text: string; x?: number; y?: number }) {
    x = x || SCREEN_WIDTH / 2;
    y = y || BOARD_SIZE / 2;
    const chars: IFontChar[] = [];
    let width = 0;
    for (let i = 0; i < text.length; i += 1) {
      const c = text.charAt(i).toUpperCase();
      const charTexture = mapFontChar[c];
      if (!charTexture) continue;
      chars.push(charTexture);
      width += charTexture.texture.width + OFFSET_CHAR;
    }

    x = x - Math.floor(width / 2);
    y = y - 12;
    let offsetX = x;
    for (let i = 0; i < text.length; i += 1) {
      const c = text.charAt(i).toUpperCase();
      const charTexture = mapFontChar[c];
      if (!charTexture) continue;

      const { texture, offsetY } = charTexture;

      base.context.drawImage(texture, offsetX, y + offsetY);
      offsetX += texture.width + OFFSET_CHAR;
    }
  }
}

export const font = new Font();
