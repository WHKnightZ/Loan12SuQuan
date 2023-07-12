import { mapFontChar } from "@/common/textures";
import { base, BOARD_SIZE, SCREEN_WIDTH } from "@/configs/consts";
import { FontChar } from "@/types";

const OFFSET_CHAR = 2;

export class Font {
  constructor() {}

  draw({ text, x, y }: { text: string; x?: number; y?: number }) {
    const chars: FontChar[] = [];
    let width = 0;
    for (let i = 0; i < text.length; i += 1) {
      const c = text.charAt(i).toUpperCase();
      const charTexture = mapFontChar[c];
      if (!charTexture) continue;
      chars.push(charTexture);
      width += charTexture.texture.width + OFFSET_CHAR;
    }

    if (!x) x = Math.floor((SCREEN_WIDTH - width) / 2);
    if (!y) y = Math.floor((BOARD_SIZE - 24) / 2);
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
