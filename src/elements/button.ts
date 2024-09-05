import { base } from "@/configs/consts";
import { IMouseEvent, IRenderable } from "@/types";

export class Button implements IRenderable {
  private right: number;
  private bottom: number;

  private x: number;
  private y: number;
  private w: number;
  private h: number;
  private texture: HTMLImageElement;
  private sx?: number;
  private sy?: number;
  private sw?: number;
  private sh?: number;

  visible: boolean;

  constructor(params: {
    x: number;
    y: number;
    w: number;
    h: number;
    texture: HTMLImageElement;
    sx?: number;
    sy?: number;
    sw?: number;
    sh?: number;
  }) {
    const { x, y, w, h, texture, sx, sy, sw, sh } = params;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.texture = texture;
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;
    this.right = x + w;
    this.bottom = y + h;

    this.visible = true;
  }

  render() {
    if (!this.visible) return;

    if (this.sx !== null) {
      base.context.drawImage(this.texture, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);
      return;
    }

    base.context.drawImage(this.texture, this.x, this.y, this.w, this.h);
  }

  update() {}

  contain({ offsetX, offsetY }: IMouseEvent) {
    if (!this.visible) return false;

    return offsetX >= this.x - 4 && offsetX <= this.right + 8 && offsetY >= this.y - 4 && offsetY <= this.bottom + 8;
  }
}
